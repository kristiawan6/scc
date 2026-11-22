import type { Metadata } from "next";
import { site } from "@/content/site";
import { img } from "./placeholders";

const og = { url: img.og, width: 1200, height: 630, alt: "Foto bersama jemaat GBI Soho City Church" };

/** Per-page metadata. Next replaces (not merges) openGraph per page, so every page sets the full set here. */
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "id_ID", siteName: site.name, url: path, title, description, images: [og] },
    twitter: { card: "summary_large_image", title, description, images: [img.og] },
  };
}
