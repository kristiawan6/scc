import { describe, expect, test } from "bun:test";

// These tests never reach Postgres or Redis: every request is rejected before a query runs.
Object.assign(process.env, {
  NODE_ENV: "test",
  DATABASE_HOST: "127.0.0.1",
  DATABASE_PORT: "1",
  DATABASE_DB: "test",
  DATABASE_USER: "test",
  JWT_SECRET: "test-secret-test-secret-test-secret!",
  JWT_REFRESH_SECRET: "test-refresh-test-refresh-test-refresh!",
});

const { app } = await import("./app");
const { sanitizeHtml } = await import("./sanitize");
const { objectSchema } = await import("./schema");
const { collectionBySlug } = await import("../../lib/cms");

describe("sanitizeHtml", () => {
  test("keeps formatting, drops scripts, handlers and unsafe links", () => {
    const out = sanitizeHtml(
      `<p onclick="x()">Hi <strong>you</strong><script>alert(1)</script></p>` +
        `<a href="javascript:alert(1)">bad</a> <a href="https://gbiscc.org" target="_blank">ok</a>` +
        `<img src=x onerror=alert(1)><div><h2 style="color:red">T</h2></div><!-- c --><iframe src="//e"></iframe>`,
    );
    expect(out).toBe(
      `<p>Hi <strong>you</strong></p>bad <a href="https://gbiscc.org" rel="noopener noreferrer">ok</a><h2>T</h2>`,
    );
  });

  test("drops raw-text elements whose content would become live markup", () => {
    for (const tag of ["xmp", "noembed", "noframes", "plaintext", "textarea", "title", "noscript", "unknown-tag"]) {
      expect(sanitizeHtml(`<p>a</p><${tag}><img src=x onerror=alert(1)></${tag}>`)).toBe("<p>a</p>");
    }
  });

  test("escapes unfinished and stray tags", () => {
    expect(sanitizeHtml(`<p>hi</p><img src=x onerror=alert(1)`)).toBe(`<p>hi</p>&lt;img src=x onerror=alert(1)`);
    expect(sanitizeHtml(`<p>x</p><a href="/" `)).toBe(`<p>x</p>&lt;a href="/" `);
    expect(sanitizeHtml(`<p>a</p></div><p>b</p>`)).toBe(`<p>a</p>&lt;/div><p>b</p>`);
    expect(sanitizeHtml(`<p>a</p onclick=1>`)).toBe(`<p>a&lt;/p onclick=1>`);
    expect(sanitizeHtml(`<p>1 < 2 and <strong>bold</strong></p>`)).toBe(`<p>1 &lt; 2 and <strong>bold</strong></p>`);
  });

  test("rejects protocol-relative and encoded javascript hrefs", () => {
    expect(sanitizeHtml(`<a href="//evil.com">x</a><a href="java&#115;cript:alert(1)">y</a>`)).toBe("xy");
  });
});

describe("collection schema", () => {
  const ministries = objectSchema(collectionBySlug("ministries")!.fields);

  test("accepts valid data and sanitizes rich text", () => {
    const r = ministries.parse({ name: "Prayer", body: "<p>Doa<script>x</script></p>", image: "/a.jpg", alt: "Dua orang berdoa" });
    expect(r.body).toBe("<p>Doa</p>");
  });

  test("rejects unknown keys, missing fields and javascript: image URLs", () => {
    expect(ministries.safeParse({ name: "P", body: "<p>x</p>", image: "/a.jpg", alt: "a", extra: 1 }).success).toBe(false);
    expect(ministries.safeParse({ name: "", body: "<p>x</p>", image: "/a.jpg", alt: "a" }).success).toBe(false);
    expect(ministries.safeParse({ name: "P", body: "<p>x</p>", image: "javascript:alert(1)", alt: "a" }).success).toBe(false);
  });

  test("rejects backslash protocol-relative links and rich text that sanitizes to empty", () => {
    expect(ministries.safeParse({ name: "P", body: "<p>x</p>", image: "/\\evil.com/a.jpg", alt: "a" }).success).toBe(false);
    expect(ministries.safeParse({ name: "P", body: "<script>x</script>", image: "/a.jpg", alt: "a" }).success).toBe(false);
    expect(sanitizeHtml(`<a href="/\\evil.com">x</a>`)).toBe("x");
  });

  test("validates service times", () => {
    const campuses = objectSchema(collectionBySlug("campuses")!.fields);
    const base = {
      name: "SOHO", slug: "soho", address: ["Jl. X"], mapQuery: "SOHO",
      postal: { street: "Jl. X", locality: "Jakarta", region: "DKI", postalCode: "12810" },
    };
    expect(campuses.safeParse({ ...base, services: [{ type: "Ibadah", day: "Sunday", times: ["10:00"] }] }).success).toBe(true);
    expect(campuses.safeParse({ ...base, services: [{ type: "Ibadah", day: "Sunday", times: ["25:00"] }] }).success).toBe(false);
  });
});

describe("env", () => {
  test("parses durations", async () => {
    const { duration } = await import("./env");
    expect([duration("15m"), duration("7d"), duration("12h"), duration("30s")]).toEqual([900, 604800, 43200, 30]);
    expect(() => duration("7 days")).toThrow();
  });
});

describe("http", () => {
  test("health", async () => {
    expect((await app.request("/health")).status).toBe(200);
  });

  test("admin routes require a session", async () => {
    expect((await app.request("/admin/summary")).status).toBe(401);
    const forged = await app.request("/admin/summary", { headers: { Cookie: "scc_token=eyJhbGciOiJub25lIn0.e30." } });
    expect(forged.status).toBe(401);
  });

  test("contact form rejects invalid input before touching the database", async () => {
    const res = await app.request("/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "A", email: "nope", topic: "constructor", message: "short" }),
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { errors: object };
    expect(Object.keys(body.errors).sort()).toEqual(["email", "message", "name", "topic"]);
  });

  test("contact with a JSON null body is a 400, not a 500", async () => {
    const res = await app.request("/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: "null" });
    expect(res.status).toBe(400);
  });

  test("unknown collection is 404", async () => {
    expect((await app.request("/content/nope")).status).toBe(404);
  });
});
