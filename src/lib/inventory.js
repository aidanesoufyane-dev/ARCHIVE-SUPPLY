import mongoose from "mongoose";
import CatalogEntry from "@/models/CatalogEntry";
import Order from "@/models/Order";
import {products} from "@/data/products";
import {connectToDatabase} from "@/lib/mongodb";

export class InventoryError extends Error {
 constructor(message,status=409){super(message);this.status=status}
}

export async function prepareInventory(slugs){
 if(!await connectToDatabase())throw new InventoryError("Inventory storage unavailable",503);
 for(const slug of new Set(slugs)){
  const product=products.find(p=>p.slug===slug);
  if(!product)continue;
  try{await CatalogEntry.updateOne({slug},{$setOnInsert:{...product,sizes:product.sizes.map(s=>({...s,reserved:0})),published:true}},{upsert:true})}
  catch(error){if(error.code!==11000)throw error}
 }
}

export function normalizeLines(lines){
 if(!Array.isArray(lines)||!lines.length||lines.length>100)throw new InventoryError("Your bag is empty or too large",400);
 const combined=new Map();
 for(const line of lines){
  if(typeof line?.slug!=="string"||!Number.isInteger(line.size)||!Number.isInteger(line.quantity)||line.quantity<1||line.quantity>10)throw new InventoryError("Sizes and quantities must be valid whole numbers (1–10 pairs).",400);
  const key=line.slug+":"+line.size;
  const quantity=(combined.get(key)?.quantity||0)+line.quantity;
  if(quantity>10)throw new InventoryError("Maximum 10 pairs per size.",400);
  combined.set(key,{slug:line.slug,size:line.size,quantity});
 }
 return [...combined.values()];
}

// All affected product documents and the order commit together.
export async function placeStockOrder(data,lines){
 await prepareInventory(lines.map(l=>l.slug));
 return mongoose.connection.transaction(async session=>{
  const items=[];
  for(const line of lines){
   const product=await CatalogEntry.findOne({slug:line.slug,published:true,deleted:{$ne:true}}).session(session);
   const size=product?.sizes.find(s=>s.size===line.size);
   const available=size?size.stock-(size.get("reserved")||0):0;
   if(!size||available<line.quantity)throw new InventoryError(`${product?.name||line.slug} / EU ${line.size}: only ${Math.max(0,available)} available. Update your bag.`);
   size.set("reserved",(size.get("reserved")||0)+line.quantity);
   await product.save({session});
   items.push({...line,name:product.name,colorway:product.colorway,image:product.images[0],unitPrice:product.price});
  }
  const subtotal=items.reduce((sum,item)=>sum+item.unitPrice*item.quantity,0);
  const [order]=await Order.create([{...data,items,subtotal,total:subtotal+data.shippingCost,inventoryState:"reserved"}],{session});
  return order;
 });
}

export async function changeStockOrder(id,status){
 if(!mongoose.isValidObjectId(id))throw new InventoryError("Invalid order ID",400);
 await connectToDatabase();
 const initial=await Order.findById(id).lean();
 if(!initial)throw new InventoryError("Order not found",404);
 await prepareInventory(initial.items.map(i=>i.slug));
 return mongoose.connection.transaction(async session=>{
  const order=await Order.findById(id).session(session);
  if(!order)throw new InventoryError("Order not found",404);
  if(order.status===status&&order.get("inventoryState"))return order;
  if(["delivered","cancelled"].includes(order.status)){
   if(order.status===status)return order;
   throw new InventoryError("Completed orders cannot be reopened. Adjust inventory separately for a return.");
  }
  for(const item of order.items){
   // Older orders did not reserve stock. Check and account for them on their next update.
   if(status==="cancelled"&&order.get("inventoryState")!=="reserved")continue;
   const product=await CatalogEntry.findOne({slug:item.slug}).session(session);
   const size=product?.sizes.find(s=>s.size===item.size);
   if(!size)throw new InventoryError(`Inventory missing for ${item.name} / EU ${item.size}.`);
   const reserved=size.get("reserved")||0;
   if(order.get("inventoryState")==="reserved"){
    if(reserved<item.quantity)throw new InventoryError("Stock reservation needs reconciliation.");
    if(status==="delivered"){if(size.stock<item.quantity)throw new InventoryError("Insufficient physical stock.");size.stock-=item.quantity;size.set("reserved",reserved-item.quantity)}
    if(status==="cancelled")size.set("reserved",reserved-item.quantity);
   }else{
    if(size.stock-reserved<item.quantity)throw new InventoryError(`Not enough available stock for ${item.name} / EU ${item.size}.`);
    if(status==="delivered")size.stock-=item.quantity;
    else size.set("reserved",reserved+item.quantity);
   }
   await product.save({session});
  }
  order.status=status;
  order.set("inventoryState",status==="delivered"?"deducted":status==="cancelled"?"released":"reserved");
  order.paymentStatus=status==="delivered"?"collected":status==="cancelled"?"failed":"pending";
  await order.save({session});
  return order;
 });
}
