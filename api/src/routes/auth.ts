import { zValidator } from "@hono/zod-validator";
import { type Context, Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { jwt, sign, verify } from "hono/jwt";
import { z } from "zod";
import { env, isProd } from "../env";
import { clientIp, fail } from "../http";
import { allow, redis, sql } from "../services";

export const COOKIE = "scc_token";
const REFRESH_COOKIE = "scc_refresh";
export type Session = { sub: string; email: string; name: string };
type User = { id: string; email: string; name: string };

/** Protects /admin/*. Tokens live in httpOnly cookies, never in JS. */
export const requireAuth = jwt({ secret: env.JWT_SECRET, cookie: COOKIE, alg: "HS256" });

// Verified against when the email is unknown, so response time doesn't reveal which emails exist.
const DUMMY_HASH = await Bun.password.hash(crypto.randomUUID());

const now = () => Math.floor(Date.now() / 1000);
const cookie = (path: string, maxAge: number) => ({ httpOnly: true, secure: isProd, sameSite: "Lax" as const, path, maxAge });

/**
 * Short-lived access token (JWT_EXPIRES_IN) + refresh token (JWT_REFRESH_EXPIRES_IN).
 * Each refresh token id is stored in Redis: refreshing rotates it, logout revokes it.
 * The refresh cookie is scoped to /auth so it is only sent to these routes.
 */
async function startSession(c: Context, user: User) {
  const access = await sign({ sub: user.id, email: user.email, name: user.name, exp: now() + env.JWT_EXPIRES_IN }, env.JWT_SECRET, "HS256");
  const jti = crypto.randomUUID();
  const refresh = await sign({ sub: user.id, jti, exp: now() + env.JWT_REFRESH_EXPIRES_IN }, env.JWT_REFRESH_SECRET, "HS256");
  await redis.set(`refresh:${jti}`, user.id, "EX", env.JWT_REFRESH_EXPIRES_IN);
  setCookie(c, COOKIE, access, cookie("/", env.JWT_EXPIRES_IN));
  setCookie(c, REFRESH_COOKIE, refresh, cookie("/auth", env.JWT_REFRESH_EXPIRES_IN));
}

async function readRefresh(c: Context) {
  const token = getCookie(c, REFRESH_COOKIE);
  if (!token) return null;
  try {
    const p = await verify(token, env.JWT_REFRESH_SECRET, "HS256");
    return typeof p.jti === "string" && typeof p.sub === "string" ? { jti: p.jti, sub: p.sub } : null;
  } catch {
    return null;
  }
}

function endSession(c: Context) {
  deleteCookie(c, COOKIE, { path: "/", secure: isProd });
  deleteCookie(c, REFRESH_COOKIE, { path: "/auth", secure: isProd });
}

const login = z.object({ email: z.email().max(200), password: z.string().min(1).max(200) });

export const auth = new Hono()
  .post("/login", zValidator("json", login), async (c) => {
    const { email, password } = c.req.valid("json");
    // Per IP and per account, so rotating IPs doesn't allow unlimited guesses on one admin.
    const [byIp, byAccount] = await Promise.all([
      allow(`login:${clientIp(c)}`, 10, 15 * 60),
      allow(`login:${email.toLowerCase()}`, 10, 15 * 60),
    ]);
    if (!byIp || !byAccount) return fail(c, 429, "Terlalu banyak percobaan masuk. Coba lagi dalam 15 menit.");
    const [user] = await sql`select id, email, name, password_hash from users where email = ${email.toLowerCase()}`;
    const ok = await Bun.password.verify(password, user?.password_hash ?? DUMMY_HASH);
    if (!user || !ok) return fail(c, 401, "Email atau password salah.");
    await startSession(c, user);
    return c.json({ user: { id: user.id, email: user.email, name: user.name } });
  })
  .post("/refresh", async (c) => {
    const r = await readRefresh(c);
    // getdel makes each refresh token single-use (rotation).
    if (!r || (await redis.getdel(`refresh:${r.jti}`)) !== r.sub) {
      endSession(c);
      return fail(c, 401, "Sesi berakhir. Silakan masuk lagi.");
    }
    const [user] = await sql`select id, email, name from users where id = ${r.sub}`;
    if (!user) {
      endSession(c);
      return fail(c, 401, "Sesi berakhir. Silakan masuk lagi.");
    }
    await startSession(c, user);
    return c.json({ user });
  })
  .post("/logout", async (c) => {
    const r = await readRefresh(c);
    if (r) await redis.del(`refresh:${r.jti}`).catch(() => {});
    endSession(c);
    return c.body(null, 204);
  })
  .get("/me", requireAuth, (c) => {
    const { sub, email, name } = c.get("jwtPayload") as Session;
    return c.json({ user: { id: sub, email, name } });
  });
