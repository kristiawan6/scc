import { site } from "./site";

// Shown on /jadwal-ibadah and published as FAQPage structured data. Facts only; keep in sync with campuses.ts.
export const faqs = [
  {
    q: "Kapan jadwal ibadah Minggu di GBI Soho City Church?",
    a: "Ibadah Raya 1 setiap Minggu pukul 10.00 WIB dan Ibadah Raya 2 setiap Minggu pukul 16.30 WIB, di Gedung SOHO Pancoran Lt. UG, Jakarta Selatan.",
  },
  {
    q: "Di mana lokasi GBI Soho City Church?",
    a: `${site.address.join(", ")}.`,
  },
  {
    q: "Apakah ada ibadah untuk anak-anak?",
    a: "Ada. Sekolah Minggu diadakan setiap Minggu pukul 10.00 WIB, bersamaan dengan Ibadah Raya 1.",
  },
  {
    q: "Apakah bisa ikut ibadah secara online?",
    a: "Bisa. Worship Night setiap Rabu pukul 19.00 WIB diadakan di gereja dan disiarkan langsung di YouTube dan Instagram GBI Soho City Church. Doa Fajar setiap Sabtu pukul 05.00 WIB diadakan lewat Zoom; link Zoom bisa diminta lewat halaman Contact.",
  },
  {
    q: "Saya baru pertama kali datang. Apa yang perlu saya lakukan?",
    a: `Datang saja ke ibadah mana pun. Tim penyambut kami siap membantu. Kalau ada pertanyaan sebelum datang, hubungi kami lewat halaman Contact, email ${site.email}, atau telepon ${site.phone.number} (${site.phone.label}).`,
  },
];
