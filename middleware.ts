import { type NextRequest, NextResponse } from "next/server";
import { markdownSlug } from "@/lib/markdown";

// Content negotiation for AI agents: a request that prefers "text/markdown" (Accept header)
// gets the page's Markdown copy instead of HTML. Browsers never send that, so they get HTML.
export function middleware(req: NextRequest) {
  const accept = req.headers.get("accept") ?? "";
  const slug = markdownSlug(req.nextUrl.pathname);
  if (slug && /text\/markdown/i.test(accept) && !/text\/html/i.test(accept.split(",")[0])) {
    return NextResponse.rewrite(new URL(`/md/${slug}`, req.url));
  }
  const res = NextResponse.next();
  if (slug) res.headers.set("Vary", "Accept");
  return res;
}

export const config = { matcher: ["/", "/about", "/jadwal-ibadah", "/next-steps", "/contact", "/privacy"] };
