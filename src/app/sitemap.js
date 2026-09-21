import {collections} from "@/data/products";
import {readCatalog} from "@/lib/catalog";
import {siteUrl} from "@/lib/site-url";
export const dynamic="force-dynamic";
export default async function sitemap(){
 const base=siteUrl();
 const paths=["","/shop","/new-drops","/men","/women","/collections","/wishlist","/about","/help","/contact","/privacy","/terms"];
 const products=await readCatalog();
 return [...paths.map((path,i)=>({url:`${base}${path}`,changeFrequency:i?"monthly":"weekly",priority:i?.7:1})),...products.map(product=>({url:`${base}/product/${product.slug}`,changeFrequency:"monthly",priority:.8})),...collections.map(collection=>({url:`${base}/collections/${collection.slug}`,changeFrequency:"monthly",priority:.7}))];
}
