import { Hono } from "hono";
import { collectionBySlug } from "../../../lib/cms";
import { type ContactInput, validateContact } from "../../../lib/contact";
import { clientIp, fail } from "../http";
import { allow, sql } from "../services";

const str = (v: unknown) => (typeof v === "string" ? v : "");

// Read-only content for the website, plus the contact form.
export const publicRoutes = new Hono()
  .get("/content/:collection", async (c) => {
    const col = collectionBySlug(c.req.param("collection"));
    if (!col) return fail(c, 404, "Koleksi tidak ditemukan.");
    const rows = await sql`
      select id, data from entries
      where collection = ${col.slug} and published
      order by position, created_at`;
    c.header("Cache-Control", "public, max-age=60, stale-while-revalidate=600");
    return c.json(rows.map((r: { id: string; data: object }) => ({ id: r.id, ...r.data })));
  })
  .get("/site", async (c) => {
    const [row] = await sql`select data from settings where key = 'site'`;
    if (!row) return fail(c, 404, "Pengaturan situs belum diisi.");
    c.header("Cache-Control", "public, max-age=60, stale-while-revalidate=600");
    return c.json(row.data);
  })
  .post("/contact", async (c) => {
    const body = ((await c.req.json().catch(() => null)) ?? {}) as Record<string, unknown>;
    const input: ContactInput = {
      name: str(body.name).trim(),
      email: str(body.email).trim(),
      phone: str(body.phone).trim(),
      topic: str(body.topic),
      message: str(body.message).trim(),
    };
    const errors = validateContact(input);
    if (Object.keys(errors).length) return fail(c, 400, "Periksa kembali isian formulir.", { errors });
    if (!(await allow(`contact:${clientIp(c)}`, 5, 60 * 60))) {
      return fail(c, 429, "Kamu sudah mengirim beberapa pesan. Coba lagi dalam satu jam.");
    }
    await sql`insert into messages ${sql(input)}`;
    return c.json({ ok: true }, 201);
  });
