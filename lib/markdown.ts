// Markdown copies of the public pages for AI agents (served at /<page>.md and for
// "Accept: text/markdown"). Built from the same content files as the HTML pages.
import { campuses } from "@/content/campuses";
import { faqs } from "@/content/faq";
import { ministries } from "@/content/ministries";
import { nextSteps } from "@/content/next-steps";
import { privacy } from "@/content/privacy";
import { site } from "@/content/site";

const day: Record<string, string> = { Sunday: "Minggu", Wednesday: "Rabu", Saturday: "Sabtu" };
const [main] = campuses;

const schedule = () =>
  main.services
    .map((s) => `- **${s.type}**: ${day[s.day] ?? s.day} ${s.times.join(" & ").replace(/:/g, ".")} WIB${s.note?.includes("·") ? ` (${s.note.split("·")[1].trim()})` : ""}`)
    .join("\n");
const address = () => site.address.join(", ");
const contact = () => `- Email: ${site.email}\n- Telepon: ${site.phone.number} (${site.phone.label})\n- Alamat: ${address()}`;

/** Markdown body per page, keyed by the .md slug ("index" is the homepage). */
export const markdownPages: Record<string, { path: string; title: string; body: () => string }> = {
  index: {
    path: "/",
    title: site.name,
    body: () => `${site.description}

> ${site.tagline.join(" ")}

## Jadwal ibadah

${schedule()}

Lokasi: ${address()}.

## Langkah berikutnya

${nextSteps.map((s) => `- [${s.title}](${site.url}/next-steps#${s.id}): ${s.lead}`).join("\n")}

## Pelayanan

${ministries.map((m) => `- **${m.name}**: ${m.body}`).join("\n")}

## Kontak

${contact()}`,
  },
  about: {
    path: "/about",
    title: "Tentang Kami",
    body: () => `Shalom, selamat datang di ${site.name}.

${site.story}

## Visi

${site.vision}

## Misi

${site.mission}

## Gembala

${site.pastors.map((p) => `- **${p.name}**, ${p.role}`).join("\n")}

${site.outreach}

## Pelayanan

${ministries.map((m) => `- **${m.name}**: ${m.body}`).join("\n")}`,
  },
  "jadwal-ibadah": {
    path: "/jadwal-ibadah",
    title: "Jadwal Ibadah",
    body: () => `Semua waktu dalam WIB. Terakhir diperbarui ${site.updated}.

## ${main.name}

${address()}

${schedule()}

Peta: https://www.google.com/maps?q=${encodeURIComponent(main.mapQuery)}

## Ikuti online

Worship Night disiarkan langsung di YouTube dan Instagram. Doa Fajar diadakan lewat Zoom; link Zoom bisa diminta lewat ${site.url}/contact.

## Pertanyaan umum

${faqs.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}`,
  },
  "next-steps": {
    path: "/next-steps",
    title: "Next Steps",
    body: () => `Di mana pun kamu sekarang dalam perjalanan iman, selalu ada langkah berikutnya. Kami jalan bersamamu.

${nextSteps.map((s) => `## ${s.title}\n\n${s.lead}\n\n${s.body}\n\nHubungi kami: ${site.url}/contact?topic=${s.id}`).join("\n\n")}`,
  },
  contact: {
    path: "/contact",
    title: "Kontak",
    body: () => `Tulis pesanmu, dan tim kami akan membalas secepatnya. Formulir ada di ${site.url}/contact.

## Kantor

${contact()}

## Persembahan

Untuk informasi persembahan dan perpuluhan, pilih topik "Persembahan" di formulir atau hubungi kantor gereja.`,
  },
  privacy: {
    path: "/privacy",
    title: "Kebijakan Privasi",
    body: () => privacy.join("\n\n"),
  },
};

export function renderMarkdown(slug: string): string | null {
  const page = markdownPages[slug];
  if (!page) return null;
  return `# ${page.title}\n\n${page.body()}\n\n---\n\nHalaman HTML: ${site.url}${page.path === "/" ? "/" : page.path}\n`;
}

/** "/" -> "index", "/about" -> "about"; null when the page has no Markdown copy. */
export const markdownSlug = (path: string) => {
  const slug = path === "/" ? "index" : path.replace(/^\//, "");
  return slug in markdownPages ? slug : null;
};
