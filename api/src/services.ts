import { RedisClient, S3Client, SQL } from "bun";
import { dbConfig, env, redisUrl } from "./env";

// Bun's built-in clients: no ORM or driver dependencies. All connect lazily.

// prepare:false keeps queries working behind PgBouncer in transaction mode.
export const sql = new SQL({ ...dbConfig, prepare: false, max: 10 });

export const redis = new RedisClient(redisUrl, { connectionTimeout: 2000, autoReconnect: true });

export const s3 = env.S3_ENDPOINT
  ? new S3Client({
      endpoint: env.S3_ENDPOINT,
      accessKeyId: env.S3_ACCESS_KEY,
      secretAccessKey: env.S3_SECRET_KEY,
      bucket: env.S3_BUCKET,
      region: env.S3_REGION,
      virtualHostedStyle: !env.S3_FORCE_PATH_STYLE,
    })
  : null;

/**
 * Fixed-window rate limit. Returns true when the request may proceed.
 * ponytail: fails open if Redis is down, so the site keeps working; switch to
 * fail-closed if abuse ever matters more than availability.
 */
export async function allow(key: string, limit: number, windowSec: number) {
  try {
    // SET NX EX first: the key always carries a TTL, even if INCR then fails.
    await redis.send("SET", [`rl:${key}`, "0", "EX", String(windowSec), "NX"]);
    return (await redis.incr(`rl:${key}`)) <= limit;
  } catch (err) {
    console.warn("rate limit skipped, redis unavailable:", (err as Error).message);
    return true;
  }
}
