// Applies api/migrations/*.sql in name order, each once, inside a transaction.
import { SQL } from "bun";
import { dbConfig } from "../src/env";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

const sql = new SQL(dbConfig);
const dir = join(import.meta.dir, "../migrations");

await sql`create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())`;
const done = new Set((await sql`select name from _migrations`).map((r: { name: string }) => r.name));
const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();

for (const name of files.filter((f) => !done.has(f))) {
  const body = await Bun.file(join(dir, name)).text();
  await sql.begin(async (tx) => {
    await tx.unsafe(body);
    await tx`insert into _migrations (name) values (${name})`;
  });
  console.log(`applied ${name}`);
}
console.log(files.length === done.size ? "database is up to date" : "migrations complete");
await sql.close();
