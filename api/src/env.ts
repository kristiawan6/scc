import { z } from "zod";

const bool = z.enum(["true", "false"]).default("false").transform((v) => v === "true");

/** "15m" | "7d" | "12h" | "30s" → seconds. */
export function duration(v: string): number {
  const m = /^(\d+)\s*([smhd])$/.exec(v.trim());
  if (!m) throw new Error(`Invalid duration "${v}" (use e.g. 15m, 12h, 7d)`);
  return Number(m[1]) * { s: 1, m: 60, h: 3600, d: 86400 }[m[2] as "s" | "m" | "h" | "d"];
}
const dur = (fallback: string) => z.string().default(fallback).transform((v, ctx) => {
  try {
    return duration(v);
  } catch (e) {
    ctx.addIssue({ code: "custom", message: (e as Error).message });
    return z.NEVER;
  }
});

const schema = z.object({
  // ─── Application
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3001),
  // Website origin(s) allowed to call the API with cookies, comma-separated.
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  // IPs of reverse proxies allowed to set X-Forwarded-For, comma-separated. Empty = use the socket address.
  TRUSTED_PROXIES: z.string().default(""),

  // ─── Database
  DATABASE_HOST: z.string().min(1),
  DATABASE_PORT: z.coerce.number().int().positive().default(5432),
  DATABASE_DB: z.string().min(1),
  DATABASE_USER: z.string().min(1),
  DATABASE_PASSWORD: z.string().default(""),

  // ─── Redis
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  REDIS_PASSWORD: z.string().default(""),
  REDIS_DB: z.coerce.number().int().min(0).default(0),

  // ─── JWT
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: dur("15m"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  JWT_REFRESH_EXPIRES_IN: dur("7d"),

  // ─── File uploads
  UPLOAD_DIR: z.string().default("./uploads"),
  MAX_FILE_SIZE_MB: z.coerce.number().positive().default(20),

  // ─── MinIO S3
  S3_ENDPOINT: z.string().optional(),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().default("us-east-1"),
  S3_FORCE_PATH_STYLE: bool,
  S3_PUBLIC_BASE: z.string().optional(),
  S3_PUBLIC_READ: bool,
  // Public base URL of this API, used for local-disk upload URLs. Defaults to the request origin.
  API_PUBLIC_URL: z.string().optional(),
}).refine((e) => !e.S3_ENDPOINT || (e.S3_BUCKET && e.S3_PUBLIC_BASE), {
  message: "S3_BUCKET and S3_PUBLIC_BASE are required when S3_ENDPOINT is set",
  path: ["S3_PUBLIC_BASE"],
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid environment (see api/.env.example):\n" + z.prettifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === "production";
export const trustedProxies = new Set(env.TRUSTED_PROXIES.split(",").map((s) => s.trim()).filter(Boolean));
export const corsOrigins = env.FRONTEND_URL.split(",").map((o) => o.trim().replace(/\/$/, "")).filter(Boolean);

/** Connection options for Bun.SQL, shared by the API and the scripts. */
export const dbConfig = {
  hostname: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  database: env.DATABASE_DB,
  username: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
};

export const redisUrl = `redis://${env.REDIS_PASSWORD ? `:${encodeURIComponent(env.REDIS_PASSWORD)}@` : ""}${env.REDIS_HOST}:${env.REDIS_PORT}/${env.REDIS_DB}`;
