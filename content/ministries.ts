import { img } from "@/lib/placeholders";

export type Ministry = { name: string; body: string; image: string; alt: string };

export const ministries: Ministry[] = [
  {
    name: "Worship & Dance",
    body: "Pemuji, penyembah, dan penari yang memimpin jemaat masuk ke hadirat Tuhan.",
    image: img.worship,
    alt: "Penari menari dengan bendera dalam penyembahan",
  },
  {
    name: "Prayer",
    body: "Tim pendoa yang berdiri di celah untuk gereja, kota, dan bangsa.",
    image: img.prayer,
    alt: "Seorang pria berdoa dengan tangan terlipat",
  },
  {
    name: "Media & Hospitality",
    body: "Sound, multimedia, usher, dan penyambut yang membuat setiap orang merasa pulang.",
    image: img.welcome,
    alt: "Tim penyambut menyalami jemaat di pintu masuk",
  },
  {
    name: "Outreach",
    body: "Berbagi makanan, pelayanan panti asuhan, dan potong rambut gratis untuk sesama.",
    image: img.outreach,
    alt: "Jemaat berbagi makanan di meja bersama",
  },
];
