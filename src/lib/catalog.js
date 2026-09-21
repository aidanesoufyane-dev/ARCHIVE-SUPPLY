import {products} from '@/data/products';
import {connectToDatabase} from './mongodb';
import CatalogEntry from '@/models/CatalogEntry';
export async function readCatalog(admin=false){
 if(!process.env.MONGODB_URI){if(admin)throw Error("Catalog storage not configured");return products;}
 await connectToDatabase();
 const entries=await CatalogEntry.find({}).lean();
 const merged=new Map(products.map(p=>[p.slug,{...p,published:true}]));
 for(const entry of entries){const {_id,__v,createdAt,updatedAt,...fields}=entry;merged.set(entry.slug,{brand:'ARCHIVE/SUPPLY',material:'Mesh / suede',fit:'True to size',...merged.get(entry.slug),...fields,id:String(_id)});}
 return [...merged.values()].filter(p=>!p.deleted&&(admin||p.published)).map(p=>({...p,sizes:p.sizes.map(s=>({...s,onHand:s.stock,reserved:s.reserved||0,stock:admin?s.stock:Math.max(0,s.stock-(s.reserved||0))})),stock:p.sizes.reduce((n,s)=>n+(admin?s.stock:Math.max(0,s.stock-(s.reserved||0))),0)}));
}
