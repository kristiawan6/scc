import { site } from "@/content/site";
import { markdownPages, renderMarkdown } from "@/lib/markdown";

// Reached via /<page>.md (rewrite in next.config.ts) or "Accept: text/markdown" (middleware.ts).
export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(markdownPages).map((slug) => ({ slug }));

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const md = renderMarkdown(slug);
  if (!md) return new Response("Not found", { status: 404 });
  const html = `${site.url}${markdownPages[slug].path === "/" ? "/" : markdownPages[slug].path}`;
  return new Response(md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      // Search engines index the HTML page, not this copy.
      Link: `<${html}>; rel="canonical"`,
    },
  });
}
