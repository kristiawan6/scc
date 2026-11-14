import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { join } from "node:path";
import { z } from "zod";
import { collectionBySlug, siteFields } from "../../../lib/cms";
import { env } from "../env";
import { fail } from "../http";
import { objectSchema } from "../schema";
import { s3, sql } from "../services";
import { requireAuth } from "./auth";

const UUID = "{[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}";
const siteSchema = objectSchema(siteFields);
const entryBody = z.object({ data: z.unknown(), published: z.boolean().default(true) });

/** Validates `data` against the collection's field definitions from lib/cms.ts. */
function parseData(slug: string, data: unknown) {
  const col = collectionBySlug(slug);
  if (!col) return { notFound: true as const };
  const r = objectSchema(col.fields).safeParse(data);
  return r.success ? { col, data: r.data } : { col, issues: r.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })) };
}

// Note: pass objects (not JSON.stringify) for jsonb params; Bun.SQL encodes a string as a JSON string scalar.

// Image types we accept, recognised by their first bytes (never by the client's claim).
function sniffImage(b: Uint8Array): { ext: string; type: string } | null {
  const hex = (n: number, o = 0) => [...b.subarray(o, o + n)].map((x) => x.toString(16).padStart(2, "0")).join("");
  const ascii = (o: number, n: number) => String.fromCharCode(...b.subarray(o, o + n));
  if (hex(3) === "ffd8ff") return { ext: "jpg", type: "image/jpeg" };
  if (hex(8) === "89504e470d0a1a0a") return { ext: "png", type: "image/png" };
  if (ascii(0, 4) === "GIF8") return { ext: "gif", type: "image/gif" };
  if (ascii(0, 4) === "RIFF" && ascii(8, 4) === "WEBP") return { ext: "webp", type: "image/webp" };
  if (ascii(4, 4) === "ftyp" && /^avi[fs]$/.test(ascii(8, 4))) return { ext: "avif", type: "image/avif" };
  return null;
}

export const adminRoutes = new Hono()
  .use(requireAuth)

  .get("/summary", async (c) => {
    const counts = await sql`select collection, count(*)::int as total from entries group by collection`;
    const [{ unread }] = await sql`select count(*)::int as unread from messages where not read`;
    return c.json({ collections: Object.fromEntries(counts.map((r: { collection: string; total: number }) => [r.collection, r.total])), unread });
  })

  // ─── Collections ───────────────────────────────────────────────
  .get("/content/:collection", async (c) => {
    const col = collectionBySlug(c.req.param("collection"));
    if (!col) return fail(c, 404, "Koleksi tidak ditemukan.");
    const rows = await sql`
      select id, position, published, data, updated_at from entries
      where collection = ${col.slug} order by position, created_at`;
    return c.json(rows);
  })
  .get(`/content/:collection/:id${UUID}`, async (c) => {
    const [row] = await sql`
      select id, position, published, data, updated_at from entries
      where collection = ${c.req.param("collection")} and id = ${c.req.param("id")}`;
    return row ? c.json(row) : fail(c, 404, "Konten tidak ditemukan.");
  })
  .post("/content/:collection", zValidator("json", entryBody), async (c) => {
    const body = c.req.valid("json");
    const r = parseData(c.req.param("collection"), body.data);
    if ("notFound" in r) return fail(c, 404, "Koleksi tidak ditemukan.");
    if (r.issues) return fail(c, 400, "Periksa kembali isian.", { issues: r.issues });
    const [row] = await sql`
      insert into entries (collection, position, published, data)
      values (${r.col.slug}, (select coalesce(max(position), -1) + 1 from entries where collection = ${r.col.slug}),
              ${body.published}, ${r.data}::jsonb)
      returning id, position, published, data, updated_at`;
    return c.json(row, 201);
  })
  .put("/content/:collection/order", zValidator("json", z.object({ ids: z.array(z.uuid()).max(500) })), async (c) => {
    const { ids } = c.req.valid("json");
    const collection = c.req.param("collection");
    await sql.begin(async (tx) => {
      for (const [i, id] of ids.entries()) {
        await tx`update entries set position = ${i} where id = ${id} and collection = ${collection}`;
      }
    });
    return c.body(null, 204);
  })
  .put(`/content/:collection/:id${UUID}`, zValidator("json", entryBody), async (c) => {
    const body = c.req.valid("json");
    const r = parseData(c.req.param("collection"), body.data);
    if ("notFound" in r) return fail(c, 404, "Koleksi tidak ditemukan.");
    if (r.issues) return fail(c, 400, "Periksa kembali isian.", { issues: r.issues });
    const [row] = await sql`
      update entries set data = ${r.data}::jsonb, published = ${body.published}, updated_at = now()
      where id = ${c.req.param("id")} and collection = ${r.col.slug}
      returning id, position, published, data, updated_at`;
    return row ? c.json(row) : fail(c, 404, "Konten tidak ditemukan.");
  })
  .delete(`/content/:collection/:id${UUID}`, async (c) => {
    const res = await sql`delete from entries where id = ${c.req.param("id")} and collection = ${c.req.param("collection")}`;
    return res.count ? c.body(null, 204) : fail(c, 404, "Konten tidak ditemukan.");
  })

  // ─── Site settings ─────────────────────────────────────────────
  .get("/site", async (c) => {
    const [row] = await sql`select data, updated_at from settings where key = 'site'`;
    return c.json(row ?? { data: null });
  })
  .put("/site", zValidator("json", z.object({ data: z.unknown() })), async (c) => {
    const r = siteSchema.safeParse(c.req.valid("json").data);
    if (!r.success) {
      return fail(c, 400, "Periksa kembali isian.", { issues: r.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })) });
    }
    const [row] = await sql`
      insert into settings (key, data) values ('site', ${r.data}::jsonb)
      on conflict (key) do update set data = excluded.data, updated_at = now()
      returning data, updated_at`;
    return c.json(row);
  })

  // ─── Uploads ───────────────────────────────────────────────────
  .post(
    "/uploads",
    bodyLimit({ maxSize: env.MAX_FILE_SIZE_MB * 1024 * 1024 + 64 * 1024, onError: (c) => fail(c, 413, `Ukuran file maksimal ${env.MAX_FILE_SIZE_MB} MB.`) }),
    async (c) => {
      const { file } = await c.req.parseBody();
      if (!(file instanceof File)) return fail(c, 400, "Pilih file gambar untuk diunggah.");
      if (file.size > env.MAX_FILE_SIZE_MB * 1024 * 1024) return fail(c, 413, `Ukuran file maksimal ${env.MAX_FILE_SIZE_MB} MB.`);
      const bytes = new Uint8Array(await file.arrayBuffer());
      const kind = sniffImage(bytes);
      if (!kind) return fail(c, 415, "Format tidak didukung. Gunakan JPG, PNG, WebP, AVIF, atau GIF.");

      const now = new Date();
      const key = `uploads/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${crypto.randomUUID()}.${kind.ext}`;
      let url: string;
      if (s3) {
        await s3.write(key, bytes, { type: kind.type, acl: env.S3_PUBLIC_READ ? "public-read" : undefined });
        url = `${env.S3_PUBLIC_BASE!.replace(/\/$/, "")}/${key}`;
      } else {
        await Bun.write(join(env.UPLOAD_DIR, key), bytes);
        url = `${(env.API_PUBLIC_URL ?? new URL(c.req.url).origin).replace(/\/$/, "")}/${key}`;
      }
      return c.json({ url }, 201);
    },
  )

  // ─── Contact messages ──────────────────────────────────────────
  .get("/messages", async (c) => {
    const rows = await sql`select * from messages order by created_at desc limit 200`;
    return c.json(rows);
  })
  .patch(`/messages/:id${UUID}`, zValidator("json", z.object({ read: z.boolean() })), async (c) => {
    const res = await sql`update messages set read = ${c.req.valid("json").read} where id = ${c.req.param("id")}`;
    return res.count ? c.body(null, 204) : fail(c, 404, "Pesan tidak ditemukan.");
  })
  .delete(`/messages/:id${UUID}`, async (c) => {
    const res = await sql`delete from messages where id = ${c.req.param("id")}`;
    return res.count ? c.body(null, 204) : fail(c, 404, "Pesan tidak ditemukan.");
  });
