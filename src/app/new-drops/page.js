export const dynamic="force-dynamic";
import Catalog from "@/components/Catalog";import {readCatalog} from "@/lib/catalog";export const metadata={title:"New Drops"};export default async function Page(){const products=await readCatalog();return <Catalog initialProducts={products.filter(p=>p.new)} title="NEW DROPS." eyebrow="THE LATEST FROM ARCHIVE/SUPPLY"/>}
