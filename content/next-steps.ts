import { img } from "@/lib/placeholders";

export type NextStep = {
  id: string;
  title: string;
  lead: string;
  body: string;
  image: string;
  alt: string;
  featured?: boolean; // shown on the homepage
};

export const nextSteps: NextStep[] = [
  {
    id: "new",
    title: "New to Faith",
    lead: "We're here to help.",
    body: "Baru mengenal Yesus atau baru pertama kali datang? Ngobrol dengan tim kami setelah ibadah, atau kirim pesan dan kami hubungi kamu.",
    image: img.newToFaith,
    alt: "Pendeta mendoakan jemaat satu per satu",
    featured: true,
  },
  {
    id: "cool",
    title: "Join a Small Group",
    lead: "Grow in faith together.",
    body: "COOL (Community of Love) adalah kelompok kecil yang bertemu rutin untuk berbagi firman, berdoa, dan saling menjaga.",
    image: img.smallGroup,
    alt: "Sekelompok anak muda tersenyum bersama",
    featured: true,
  },
  {
    id: "gic",
    title: "Growth in Christ",
    lead: "Bangun dasar iman yang kuat.",
    body: "Kelas pemuridan bertahap untuk mengenal dasar-dasar iman Kristen dan menemukan panggilanmu.",
    image: img.gic,
    alt: "Jemaat duduk menyimak firman",
  },
  {
    id: "serve",
    title: "Serve",
    lead: "Pakai talentamu untuk Tuhan.",
    body: "Bergabung dengan tim pemuji, penari, media & sound, pendoa, atau hospitality & usher.",
    image: img.serve,
    alt: "Pemain bass dan gitar melayani di tim musik",
  },
];
