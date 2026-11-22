import { type NextRequest, NextResponse } from "next/server";
import { markdownSlug, prefersMarkdown } from "@/lib/markdown";

// Content negotiation for AI agents: a request that prefers "text/markdown" (Accept header)
// gets the page's Markdown copy instead of HTML. Browsers never send that, so they get HTML.
export function middleware(req: NextRequest) {
  const slug = markdownSlug(req.nextUrl.pathname);
  if (slug && prefersMarkdown(req.headers.get("accept") ?? "")) {
    return NextResponse.rewrite(new URL(`/md/${slug}`, req.url));
  }
  const res = NextResponse.next();
  if (slug) res.headers.set("Vary", "Accept");
  return res;
}

export const config = { matcher: ["/", "/about", "/jadwal-ibadah", "/next-steps", "/contact", "/privacy"] };
