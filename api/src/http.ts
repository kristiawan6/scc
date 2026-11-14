import type { Context } from "hono";
import type { Server } from "bun";
import { trustedProxies } from "./env";

const bare = (ip: string) => ip.replace(/^::ffff:/, "");

/**
 * Client IP for rate limiting. X-Forwarded-For is only read when the direct peer
 * is listed in TRUSTED_PROXIES; then the right-most hop that is not one of our
 * proxies is the client. Anyone else could spoof the header to dodge the limit.
 */
export function clientIp(c: Context): string {
  // c.env is the Bun server; absent under app.request() in tests.
  const peer = bare((c.env as Server<unknown> | undefined)?.requestIP?.(c.req.raw)?.address ?? "unknown");
  if (!trustedProxies.has(peer)) return peer;
  const hops = (c.req.header("x-forwarded-for") ?? "").split(",").map((s) => bare(s.trim())).filter(Boolean);
  return hops.reverse().find((ip) => !trustedProxies.has(ip)) ?? peer;
}

export const fail = (c: Context, status: 400 | 401 | 404 | 413 | 415 | 429, error: string, extra?: object) =>
  c.json({ error, ...extra }, status);
