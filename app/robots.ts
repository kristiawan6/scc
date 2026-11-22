import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// AI search and assistant crawlers are welcome on public pages, so people asking an AI
// "gereja di Pancoran" or "jadwal ibadah GBI SCC" get an answer. The CMS stays private.
const aiBots = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot",
  "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot", "Applebot-Extended", "Bingbot", "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/admin" },
      { userAgent: aiBots, allow: "/", disallow: "/admin" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
