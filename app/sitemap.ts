import type { MetadataRoute } from "next";
import { site } from "@/content/site";

const routes = ["", "/about", "/jadwal-ibadah", "/next-steps", "/contact", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({ url: `${site.url}${r}`, lastModified: site.updated, changeFrequency: "weekly", priority: r ? 0.7 : 1 }));
}
