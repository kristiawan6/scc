import { campuses, dayLabel } from "@/content/campuses";
import { alternateNames, site } from "@/content/site";

// https://llmstxt.org — a plain summary for AI assistants, built from the same content as the site.
export const dynamic = "force-static";

const pages = [
  ["Beranda", "/", "kabar terbaru, galeri jemaat, jadwal singkat, dan pelayanan"],
  ["Jadwal Ibadah", "/jadwal-ibadah", "jadwal lengkap, lokasi, peta, ibadah online, dan pertanyaan umum"],
  ["Tentang Kami", "/about", "cerita, visi, misi, dan para gembala"],
  ["Next Steps", "/next-steps", "baru mengenal Yesus, kelompok kecil COOL, kelas Growth in Christ, dan melayani"],
  ["Kontak", "/contact", "pertanyaan, permohonan doa, dan persembahan"],
];

export function GET() {
  const [main] = campuses;
  const body = [
    `# ${site.name}`,
    "",
    `> ${site.name} (dikenal juga sebagai ${alternateNames.join(", ")}) adalah gereja di ${site.address.join(", ")}. ${site.story} ${site.pastors.map((p) => `${p.role}: ${p.name}.`).join(" ")}`,
    "",
    "Jadwal ibadah (WIB):",
    ...main.services.map((s) => `- ${s.type}: ${dayLabel(s.day)} ${s.times.join(" & ").replace(/:/g, ".")}${s.note?.includes("·") ? ` (${s.note.split("·")[1].trim()})` : ""}`),
    "",
    `Kontak: ${site.email}, telepon ${site.phone.number} (${site.phone.label}).`,
    "",
    "## Halaman",
    "",
    ...pages.map(([t, p, d]) => `- [${t}](${site.url}${p === "/" ? "/" : p}): ${d}`),
    "",
    "## Media sosial",
    "",
    ...site.socials.filter((s) => s.href).map((s) => `- [${s.name}](${s.href})`),
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
