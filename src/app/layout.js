import "./globals.css";
import "./refinements.css";
import { CommerceProvider } from "@/context/CommerceContext";
import StorefrontShell from "@/components/StorefrontShell";
import { siteUrl } from "@/lib/site-url";

export const metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: "ARCHIVE/SUPPLY — Independent Footwear Edit", template: "%s — ARCHIVE/SUPPLY" },
  description: "A sharp edit of new sneakers, iconic silhouettes and limited releases.",
  openGraph: { title: "ARCHIVE/SUPPLY", description: "Own the street. Discover the latest independent footwear edit.", images: ["/hero-oxblood.png"] },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }) {
  return <html lang="en"><body><CommerceProvider><StorefrontShell>{children}</StorefrontShell></CommerceProvider></body></html>;
}
