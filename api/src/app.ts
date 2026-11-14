import { Hono } from "hono";
import { serveStatic } from "@hono/bun";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { corsOrigins, env } from "./env";
import { adminRoutes } from "./routes/admin";
import { auth } from "./routes/auth";
import { publicRoutes } from "./routes/public";
import { s3 } from "./services";

export const app = new Hono();

if (env.NODE_ENV !== "test") app.use(logger());
app.use(secureHeaders({ crossOriginResourcePolicy: "cross-origin" }));
app.use(cors({ origin: corsOrigins, credentials: true, allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"] }));

// Local-disk uploads (only when S3 is not configured).
if (!s3) app.use("/uploads/*", serveStatic({ root: env.UPLOAD_DIR }));

app.get("/health", (c) => c.json({ ok: true }));
app.route("/", publicRoutes);
app.route("/auth", auth);
app.route("/admin", adminRoutes);

app.notFound((c) => c.json({ error: "Tidak ditemukan." }, 404));
app.onError((err, c) => {
  if (err instanceof HTTPException) return err.getResponse();
  console.error(err);
  return c.json({ error: "Terjadi kesalahan di server. Coba lagi sebentar lagi." }, 500);
});
