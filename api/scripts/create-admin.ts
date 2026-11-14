// Creates or resets a CMS admin.
// Usage: bun run admin:create <email> "<name>"   (password is asked interactively)
import { SQL } from "bun";
import { dbConfig } from "../src/env";

const [email, name] = process.argv.slice(2);
if (!email || !name) {
  console.error('Usage: bun run admin:create <email> "<name>"');
  process.exit(1);
}

const password = prompt("Password (min 12 karakter):") ?? "";
if (password.length < 12) {
  console.error("Password minimal 12 karakter.");
  process.exit(1);
}

const sql = new SQL(dbConfig);
const hash = await Bun.password.hash(password); // argon2id
await sql`
  insert into users (email, name, password_hash) values (${email.toLowerCase()}, ${name}, ${hash})
  on conflict (email) do update set name = excluded.name, password_hash = excluded.password_hash`;
console.log(`admin ${email} siap.`);
await sql.close();
