export const dynamic="force-dynamic";
import Catalog from "@/components/Catalog";import {readCatalog} from "@/lib/catalog";export const metadata={title:"Men"};export default async function Page(){const products=(await readCatalog()).filter(product=>product.gender!=="Women");return <Catalog initialProducts={products} title="MEN'S ROTATION." eyebrow="ARCHIVE / MEN / FW26"/>}
