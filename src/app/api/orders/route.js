import {NextResponse} from "next/server";
import {connectToDatabase} from "@/lib/mongodb";
import Order from "@/models/Order";
import {normalizeLines,placeStockOrder,InventoryError} from "@/lib/inventory";

const authorized=request=>Boolean(process.env.ADMIN_SESSION_TOKEN)&&request.cookies.get("archive_admin_session")?.value===process.env.ADMIN_SESSION_TOKEN;
const clean=value=>String(value||"").trim();
const storageError=error=>error?.name==="MongoParseError"?"MongoDB connection string is invalid. Update MONGODB_URI.":"Unable to connect to order storage";

export async function POST(request){
 try{
  if(!process.env.MONGODB_URI)return NextResponse.json({error:"Order storage is not configured"},{status:503});
  const body=await request.json();
  const customer={email:clean(body.customer?.email).toLowerCase(),firstName:clean(body.customer?.firstName),lastName:clean(body.customer?.lastName),phone:clean(body.customer?.phone)};
  const shipping={address:clean(body.shipping?.address),city:clean(body.shipping?.city),postalCode:clean(body.shipping?.postalCode),country:clean(body.shipping?.country),method:body.shipping?.method==="express"?"express":"standard"};
  if(!customer.email.includes("@")||!customer.firstName||!customer.lastName||!customer.phone||!shipping.address||!shipping.city||!shipping.postalCode||!shipping.country)return NextResponse.json({error:"Complete all contact and delivery fields"},{status:400});
  if(!Array.isArray(body.items)||!body.items.length)return NextResponse.json({error:"Your bag is empty"},{status:400});
  const lines=normalizeLines(body.items);
  const shippingCost=shipping.method==="express"?15:0;
  const orderNumber=`AS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
  const order=await placeStockOrder({orderNumber,customer,shipping,shippingCost,paymentMethod:"cod",notes:clean(body.notes)},lines);
  return NextResponse.json({order:{orderNumber:order.orderNumber,status:order.status,total:order.total}},{status:201});
 }catch(error){return NextResponse.json({error:error instanceof InventoryError?error.message:"Unable to place order. Please try again."},{status:error instanceof InventoryError?error.status:500})}
}

export async function GET(request){
 if(!authorized(request))return NextResponse.json({error:"Admin authorization required"},{status:403});
 try{await connectToDatabase();const orders=await Order.find({}).sort({createdAt:-1}).limit(250).lean();return NextResponse.json({orders})}
 catch(error){return NextResponse.json({error:storageError(error)},{status:500})}
}
