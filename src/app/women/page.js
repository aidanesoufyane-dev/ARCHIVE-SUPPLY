export const dynamic="force-dynamic";
import Catalog from "@/components/Catalog";import {readCatalog} from "@/lib/catalog";export const metadata={title:"Women"};export default async function Page(){const products=(await readCatalog()).filter(product=>product.gender==="Women");return <Catalog initialProducts={products} title="WOMEN'S ROTATION." eyebrow="ARCHIVE / WOMEN / FW26"/>}
