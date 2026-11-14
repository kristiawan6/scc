import type { Metadata, Viewport } from "next";
import { Caveat, Epilogue, Inter } from "next/font/google";
import { site } from "@/content/site";
import { churchJsonLd, toScript } from "@/lib/jsonld";
import { img } from "@/lib/placeholders";
import "./globals.css";

const epilogue = Epilogue({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-epilogue" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const caveat = Caveat({ subsets: ["latin"], weight: ["600"], variable: "--font-caveat" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | Jakarta`, template: `%s | ${site.shortName}` },
  description: site.description,
  keywords: ["GBI Soho City Church", "GBI SCC", "gereja Jakarta Selatan", "gereja Pancoran", "SOHO Pancoran", "ibadah Minggu Jakarta"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: site.shortName,
    url: site.url,
    title: site.name,
    description: site.description,
    images: [{ url: img.og, width: 1200, height: 630, alt: "Jemaat beribadah di GBI Soho City Church" }],
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description, images: [img.og] },
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
