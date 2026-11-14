import { img } from "@/lib/placeholders";

export type Highlight = { title: string; image: string; alt: string; href: string };

export const highlights: Highlight[] = [
  {
    title: "Worship Night, setiap Rabu pukul 19.00",
    image: img.worshipNight,
    alt: "Jemaat mengangkat tangan saat penyembahan",
    href: "/campuses#jadwal",
  },
  {
    title: "Doa Fajar bersama, Sabtu pukul 05.00",
    image: img.dawnPrayer,
    alt: "Tangan terlipat berdoa di atas Alkitab terbuka",
    href: "/campuses#jadwal",
  },
  {
    title: "COOL: temukan komunitas di dekatmu",
    image: img.cool,
    alt: "Sekelompok teman tertawa bersama",
    href: "/next-steps#cool",
  },
  {
    title: "Kelas Growth in Christ angkatan baru",
    image: img.gic,
    alt: "Peserta kelas mencatat di buku",
    href: "/next-steps#gic",
  },
  {
    title: "Junior Church untuk remaja, Minggu 13.30",
    image: img.juniorChurch,
    alt: "Remaja berangkulan menatap matahari terbenam",
    href: "/campuses#jadwal",
  },
  {
    title: "Berbagi kasih: bakti sosial bulan ini",
    image: img.outreach,
    alt: "Tangan-tangan bertumpuk sebagai tanda kebersamaan",
    href: "/#ministries",
  },
];
