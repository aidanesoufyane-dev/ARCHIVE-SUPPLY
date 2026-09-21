import {readCatalog} from "@/lib/catalog";
import HomeExperience from "@/components/HomeExperience";
export const dynamic="force-dynamic";
export default async function Home(){return <HomeExperience products={await readCatalog()}/>}
