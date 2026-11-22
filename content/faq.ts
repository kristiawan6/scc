import { timesOf } from "./campuses";
import { site } from "./site";

// Shown on /jadwal-ibadah and published as FAQPage structured data. Times come from campuses.ts.
export const faqs = [
  {
    q: "Kapan jadwal ibadah Minggu di GBI Soho City Church?",
    a: `Ibadah Raya 1 setiap Minggu pukul ${timesOf("Ibadah Raya 1")} WIB dan Ibadah Raya 2 setiap Minggu pukul ${timesOf("Ibadah Raya 2")} WIB, di Gedung SOHO Pancoran Lt. UG, Jakarta Selatan.`,
  },
  {
    q: "Di mana lokasi GBI Soho City Church?",
    a: `${site.address.join(", ")}.`,
  },
  {
    q: "Apakah ada ibadah untuk anak-anak?",
    a: `Ada. Sekolah Minggu diadakan setiap Minggu pukul ${timesOf("Sekolah Minggu")} WIB.`,
  },
  {
    q: "Apakah bisa ikut ibadah secara online?",
    a: `Bisa. Worship Night setiap Rabu pukul ${timesOf("Worship Night")} WIB diadakan di gereja dan disiarkan langsung di YouTube dan Instagram GBI Soho City Church. Doa Fajar setiap Sabtu pukul ${timesOf("Doa Fajar")} WIB diadakan lewat Zoom; link Zoom bisa diminta lewat halaman Contact.`,
  },
  {
    q: "Saya baru pertama kali datang. Apa yang perlu saya lakukan?",
    a: `Datang saja ke ibadah mana pun. Tim penyambut kami siap membantu. Kalau ada pertanyaan sebelum datang, hubungi kami lewat halaman Contact, email ${site.email}, atau telepon ${site.phone.number} (${site.phone.label}).`,
  },
];

/** One-sentence schedule for the /jadwal-ibadah intro and meta description. */
export const scheduleSentence = () =>
  `Ibadah Raya setiap Minggu pukul ${timesOf("Ibadah Raya 1")} dan ${timesOf("Ibadah Raya 2")}, Sekolah Minggu pukul ${timesOf("Sekolah Minggu")}, Worship Night setiap Rabu pukul ${timesOf("Worship Night")} (juga live YouTube & Instagram), dan Doa Fajar setiap Sabtu pukul ${timesOf("Doa Fajar")} lewat Zoom.`;
