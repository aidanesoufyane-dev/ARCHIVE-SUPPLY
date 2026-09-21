import {createHash} from "node:crypto";
import {connectToDatabase} from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";

const reply=(body,status=200)=>Response.json(body,{status,headers:{"Cache-Control":"no-store"}});
export async function POST(request){
 const origin=request.headers.get("origin");
 if(origin&&origin!==new URL(request.url).origin)return reply({error:"Invalid origin"},403);
 let body;
 try{const text=await request.text();if(text.length>2048)return reply({error:"Request too large"},413);body=JSON.parse(text)}catch{return reply({error:"Invalid request"},400)}
 const email=typeof body?.email==="string"?body.email.trim().toLowerCase():"";
 if(email.length>254||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return reply({error:"Enter a valid email address."},400);
 if(!["homepage","footer"].includes(body.source))return reply({error:"Invalid signup source"},400);
 try{
  if(!await connectToDatabase())throw Error("Storage unavailable");
  const id=createHash("sha256").update(email).digest("hex");
  await Subscriber.updateOne({_id:id},{$setOnInsert:{email,source:body.source,consentVersion:"drop-notes-v1",createdAt:new Date(),updatedAt:new Date()}},{upsert:true,runValidators:true,timestamps:false});
  return reply({message:"You’re on the list. Thanks for joining!"});
 }catch(error){
  if(error?.code===11000)return reply({message:"You’re on the list. Thanks for joining!"});
  return reply({error:"We couldn’t save your email. Please try again."},503);
 }
}

export async function GET(request){
 if(!process.env.ADMIN_SESSION_TOKEN||request.cookies.get("archive_admin_session")?.value!==process.env.ADMIN_SESSION_TOKEN)return reply({error:"Sign in required"},403);
 const params=new URL(request.url).searchParams;
 const page=Math.max(1,Math.min(100000,Number.parseInt(params.get("page"),10)||1));
 const search=(params.get("q")||"").trim().slice(0,254);
 const filter=search?{email:{$regex:search.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),$options:"i"}}:{};
 try{
  if(!await connectToDatabase())throw Error("Storage unavailable");
  const [subscribers,total]=await Promise.all([Subscriber.find(filter).select("email source createdAt").sort({createdAt:-1,_id:1}).skip((page-1)*50).limit(50).lean(),Subscriber.countDocuments(filter)]);
  return reply({subscribers,total,page,pages:Math.max(1,Math.ceil(total/50))});
 }catch{return reply({error:"Unable to load subscribers. Please try again."},503)}
}
