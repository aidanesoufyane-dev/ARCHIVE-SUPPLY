import {changeStockOrder,InventoryError} from "@/lib/inventory";
const statuses=["new","confirmed","preparing","shipped","delivered","cancelled"];
export async function PATCH(request,{params}){
 if(!process.env.ADMIN_SESSION_TOKEN||request.cookies.get("archive_admin_session")?.value!==process.env.ADMIN_SESSION_TOKEN)return Response.json({error:"Admin authorization required"},{status:403});
 if(request.headers.get("origin")&&request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:"Invalid origin"},{status:403});
 try{const {id}=await params;const {status}=await request.json();if(!statuses.includes(status))return Response.json({error:"Invalid status"},{status:400});const order=await changeStockOrder(id,status);return Response.json({order})}
 catch(error){return Response.json({error:error instanceof InventoryError?error.message:"Unable to update order"},{status:error instanceof InventoryError?error.status:500})}
}
