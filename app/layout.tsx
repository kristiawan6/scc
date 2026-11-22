import type { Metadata, Viewport } from "next";
import { Caveat, Epilogue, Inter } from "next/font/google";
import { alternateNames, site } from "@/content/site";
import { churchJsonLd, toScript } from "@/lib/jsonld";
import { ogImage } from "@/lib/seo";
import "./globals.css";

const epilogue = Epilogue({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-epilogue" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const caveat = Caveat({ subsets: ["latin"], weight: ["600"], variable: "--font-caveat" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} | Gereja di Pancoran, Jakarta Selatan`,
  description: site.description,
  openGraph: { type: "website", locale: "id_ID", siteName: site.name, images: [ogImage] },
  twitter: { card: "summary_large_image", images: [ogImage.url] },
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "religion",
  keywords: [
    "GBI Soho City Church", ...alternateNames, "gereja Jakarta Selatan", "gereja Pancoran", "gereja Tebet",
    "SOHO Pancoran", "ibadah Minggu Jakarta Selatan", "Worship Night Jakarta", "Sekolah Minggu Jakarta Selatan", "GBI Rayon 1i",
  ],
  manifest: "/manifest.json",
};

export const viewport: Viewport = { themeColor: "#0f0f0f" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${epilogue.variable} ${inter.variable} ${caveat.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-gold px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Langsung ke konten
        </a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toScript(churchJsonLd()) }} />
      </body>
    </html>
  );
}
