import { NextResponse } from "next/server";

export async function POST(request){
  const { accessKey } = await request.json();
  if(!process.env.ADMIN_ACCESS_KEY || accessKey !== process.env.ADMIN_ACCESS_KEY){
    return NextResponse.json({error:"Invalid credentials"},{status:401});
  }
  if(!process.env.ADMIN_SESSION_TOKEN){
    return NextResponse.json({error:"Admin session is not configured"},{status:503});
  }
  const response=NextResponse.json({ok:true,path:process.env.ADMIN_PATH||"/studio-control"});
  response.cookies.set("archive_admin_session",process.env.ADMIN_SESSION_TOKEN,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/",maxAge:60*60*8});
  return response;
}
export async function DELETE(){const response=NextResponse.json({ok:true});response.cookies.set("archive_admin_session","",{httpOnly:true,path:"/",maxAge:0});return response;}
