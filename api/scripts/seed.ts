// Loads the current website content (/content/*.ts) into an empty database.
// Collections that already have entries are skipped, so it is safe to re-run.
import { SQL } from "bun";
import { dbConfig } from "../src/env";
import { campuses } from "../../content/campuses";
import { highlights } from "../../content/highlights";
import { ministries } from "../../content/ministries";
import { nextSteps } from "../../content/next-steps";
import { site } from "../../content/site";
import { collectionBySlug, siteFields } from "../../lib/cms";
import { objectSchema } from "../src/schema";

const sql = new SQL(dbConfig);
const p = (text: string) => `<p>${text}</p>`;

const seed: Record<string, object[]> = {
  highlights: highlights.map(({ title, image, alt, href }) => ({ title, image, alt, href })),
  ministries: ministries.map(({ name, body, image, alt }) => ({ name, body: p(body), image, alt })),
  "next-steps": nextSteps.map(({ id, title, lead, body, image, alt, featured }) => ({
    slug: id, title, lead, body: p(body), image, alt, featured: !!featured,
  })),
  campuses: campuses.map(({ slug, name, address, postal, mapQuery, services }) => ({ slug, name, address, postal, mapQuery, services })),
};

for (const [slug, items] of Object.entries(seed)) {
  const [{ n }] = await sql`select count(*)::int as n from entries where collection = ${slug}`;
  if (n) {
    console.log(`skip ${slug} (${n} entries exist)`);
    continue;
  }
  const schema = objectSchema(collectionBySlug(slug)!.fields);
  for (const [i, item] of items.entries()) {
    const data = schema.parse(item); // same validation as the API
    await sql`insert into entries (collection, position, data) values (${slug}, ${i}, ${data}::jsonb)`;
  }
  console.log(`seeded ${slug} (${items.length})`);
}

const siteData = objectSchema(siteFields).parse({
  tagline: site.tagline,
  description: site.description,
  story: p(site.story),
  vision: site.vision,
  mission: site.mission,
  email: site.email,
  phone: site.phone,
  address: site.address,
  pastors: site.pastors,
  socials: site.socials,
});
const res = await sql`insert into settings (key, data) values ('site', ${siteData}::jsonb) on conflict (key) do nothing`;
console.log(res.count ? "seeded site settings" : "skip site settings (exists)");
await sql.close();
