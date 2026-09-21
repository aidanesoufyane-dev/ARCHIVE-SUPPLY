const assert=require("node:assert/strict");
const mongoose=require("mongoose");

(async()=>{
 const slug="inventory-check-"+Date.now();
 const slugs=[slug,slug+"-empty"];
 const customer={email:slug+"@example.invalid",firstName:"Inventory",lastName:"Test",phone:"000000000"};
 const headers={"Content-Type":"application/json",Origin:"http://localhost:3000",Cookie:"archive_admin_session="+process.env.ADMIN_SESSION_TOKEN};
 const api=async(path,method,body)=>{const r=await fetch("http://localhost:3000"+path,{method,headers,body:body?JSON.stringify(body):undefined});return {status:r.status,body:await r.json()}};
 const checkout=items=>api("/api/orders","POST",{customer,shipping:{address:"Test only",city:"Test",postalCode:"00000",country:"MA",method:"standard"},items});
 await mongoose.connect(process.env.MONGODB_URI,{serverSelectionTimeoutMS:8000});
 const catalog=mongoose.connection.collection("catalogentries"),orders=mongoose.connection.collection("orders");
 const stock=()=>catalog.findOne({slug});
 const line=quantity=>({slug,size:42,quantity});
 try{
  await catalog.insertMany(slugs.map((s,i)=>({slug:s,name:"Inventory test",price:100,published:true,deleted:false,images:["/assets/products/studio-runner-oxblood/01-main.png"],sizes:[{size:42,stock:i?0:3,reserved:0}]})));
  assert.equal((await checkout([line(1.5)])).status,400);
  assert.equal((await checkout([line(4)])).status,409);
  assert.equal((await checkout([line(2),line(2)])).status,409);
  assert.equal((await checkout([line(1),{slug:slugs[1],size:42,quantity:1}])).status,409);
  assert.equal((await stock()).sizes[0].reserved,0,"Failed multi-item order must roll back");
  const attempts=await Promise.all([checkout([line(2)]),checkout([line(2)])]);
  assert.deepEqual(attempts.map(r=>r.status).sort(),[201,409],"Concurrent checkout must not oversell");
  let record=await orders.findOne({"customer.email":customer.email});
  assert.equal(record.inventoryState,"reserved");
  assert.equal((await stock()).sizes[0].reserved,2);
  assert.equal((await stock()).sizes[0].stock,3);
  const publicCatalog=await api("/api/catalog","GET");
  assert.equal(publicCatalog.body.products.find(p=>p.slug===slug).sizes[0].stock,1,"Storefront must expose only available stock");
  const edited={slug,name:"Inventory test",price:100,images:["/assets/products/studio-runner-oxblood/01-main.png"],sizes:[{size:42,stock:1}],published:true};
  assert.equal((await api("/api/catalog","PATCH",edited)).status,409,"Cannot remove reserved stock");
  edited.sizes[0].stock=3;
  assert.equal((await api("/api/catalog","PATCH",edited)).status,200);
  assert.equal((await stock()).sizes[0].reserved,2,"Catalog edits must preserve reservations");

  assert.equal((await api("/api/orders/"+record._id,"PATCH",{status:"delivered"})).status,200);
  assert.equal((await stock()).sizes[0].stock,1);
  assert.equal((await stock()).sizes[0].reserved,0);
  assert.equal((await api("/api/orders/"+record._id,"PATCH",{status:"delivered"})).status,200);
  assert.equal((await stock()).sizes[0].stock,1,"Repeat delivery must not deduct twice");
  assert.equal((await api("/api/orders/"+record._id,"PATCH",{status:"new"})).status,409);
  assert.equal((await checkout([line(1)])).status,201);
  record=await orders.findOne({"customer.email":customer.email,status:"new"});
  assert.equal((await api("/api/orders/"+record._id,"PATCH",{status:"cancelled"})).status,200);
  assert.equal((await stock()).sizes[0].stock,1);
  assert.equal((await stock()).sizes[0].reserved,0);
  console.log("PASS: validation, duplicate lines, rollback, concurrent stock checks, reservation, delivery, repeat delivery, terminal status, cancellation.");
 }finally{
  console.log("Test orders removed:",(await orders.deleteMany({"customer.email":customer.email,"items.slug":{$in:slugs}})).deletedCount);
  console.log("Test products removed:",(await catalog.deleteMany({slug:{$in:slugs}})).deletedCount);
  await mongoose.disconnect();
 }
})().catch(error=>{console.error(error.message);process.exitCode=1});
