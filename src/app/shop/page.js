export const dynamic="force-dynamic";
import Catalog from "@/components/Catalog";import {readCatalog} from "@/lib/catalog";export const metadata={title:"All Sneakers"};export default async function Shop(){const products=await readCatalog();return <Catalog initialProducts={products}/>}
