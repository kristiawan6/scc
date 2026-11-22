import { img } from "@/lib/placeholders";

export type Highlight = { title: string; image: string; alt: string; href: string };

export const highlights: Highlight[] = [
  {
    title: "Worship Night, setiap Rabu pukul 19.00 (live YouTube & Instagram)",
    image: img.worshipNight,
    alt: "Jemaat mengangkat tangan saat Worship Night",
    href: "/jadwal-ibadah#jadwal",
  },
  {
    title: "Doa Fajar via Zoom, setiap Sabtu pukul 05.00",
    image: img.dawnPrayer,
    alt: "Jemaat menundukkan kepala dan berdoa",
    href: "/jadwal-ibadah#jadwal",
  },
  {
    title: "COOL: temukan komunitas di dekatmu",
    image: img.cool,
    alt: "Foto bersama jemaat SCC setelah ibadah",
    href: "/next-steps#cool",
  },
  {
    title: "Kelas Growth in Christ angkatan baru",
    image: img.gic,
    alt: "Jemaat duduk menyimak firman",
    href: "/next-steps#gic",
  },
  {
    title: "Sekolah Minggu, setiap Minggu pukul 10.00",
    image: img.kids,
    alt: "Anak-anak memuji Tuhan",
    href: "/jadwal-ibadah#jadwal",
  },
  {
    title: "Berbagi kasih: bakti sosial bulan ini",
    image: img.hospitality,
    alt: "Tim penyambut membagikan roti kepada jemaat dan anak-anak",
    href: "/#ministries",
  },
];
