import mongoose from 'mongoose';
import {InventoryError} from '@/lib/inventory';
import {readCatalog} from '@/lib/catalog';
import {connectToDatabase} from '@/lib/mongodb';
import CatalogEntry from '@/models/CatalogEntry';
const admin=r=>!!process.env.ADMIN_SESSION_TOKEN&&r.cookies.get('archive_admin_session')?.value===process.env.ADMIN_SESSION_TOKEN;
export async function GET(request){try{return Response.json({products:await readCatalog(admin(request)&&new URL(request.url).searchParams.get("admin")==="1")})}catch{return Response.json({error:'Catalog storage is unavailable'},{status:503})}}
export async function POST(request){return write(request)}
export async function PATCH(request){return write(request)}
async function write(request){
 if(!admin(request))return Response.json({error:'Sign in required'},{status:403});
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Invalid origin'},{status:403});
 try{const b=await request.json();if(!/^[a-z0-9-]{1,100}$/.test(b.slug)||typeof b.name!=='string'||!b.name.trim()||!Number.isFinite(b.price)||b.price<0||!Array.isArray(b.images)||!b.images.length||b.images.some(x=>typeof x!=='string'||!x.startsWith('/assets/'))||!Array.isArray(b.sizes)||b.sizes.some(s=>!Number.isInteger(s.size)||!Number.isInteger(s.stock)||s.stock<0))return Response.json({error:'Check name, slug, price, local images and stock.'},{status:400});
 await connectToDatabase();const existing=await readCatalog(true);if(request.method==='POST'&&existing.some(p=>p.slug===b.slug))return Response.json({error:'Slug already exists'},{status:409});
 const fields={name:b.name.trim().slice(0,150),price:b.price,collection:String(b.collection||''),category:String(b.category||''),colorway:String(b.colorway||''),description:String(b.description||'').slice(0,3000),images:b.images,sizes:b.sizes,published:!!b.published,deleted:false};
 await mongoose.connection.transaction(async session=>{
 const current=await CatalogEntry.findOne({slug:b.slug}).session(session);
 const sizes=fields.sizes.map(s=>({...s,reserved:current?.sizes.find(x=>x.size===s.size)?.get("reserved")||0}));
 if(new Set(sizes.map(s=>s.size)).size!==sizes.length||sizes.some(s=>s.stock<s.reserved)||current?.sizes.some(s=>(s.get("reserved")||0)>0&&!sizes.some(x=>x.size===s.size)))throw new InventoryError('On-hand stock cannot be below reserved stock, and reserved sizes cannot be removed.');
 await CatalogEntry.findOneAndUpdate({slug:b.slug},{$set:{...fields,sizes}},{upsert:true,runValidators:true,session});
 });return Response.json({ok:true});
 }catch(error){return Response.json({error:error instanceof InventoryError?error.message:'Unable to save product'},{status:error instanceof InventoryError?409:500})}
}
export async function DELETE(request){if(!admin(request))return Response.json({error:'Sign in required'},{status:403});if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Invalid origin'},{status:403});try{const {slug}=await request.json();if(typeof slug!=='string')return Response.json({error:'Invalid slug'},{status:400});await connectToDatabase();await CatalogEntry.findOneAndUpdate({slug},{$set:{deleted:true}},{upsert:true});return Response.json({ok:true})}catch{return Response.json({error:'Unable to delete product'},{status:500})}}
