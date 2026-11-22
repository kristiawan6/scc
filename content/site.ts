export type Social = {
  name: "X" | "Facebook" | "YouTube" | "Instagram" | "Threads" | "TikTok";
  href: string; // empty = hidden until the account exists
};

export const site = {
  name: "GBI Soho City Church",
  shortName: "Soho City Church",
  url: "https://gbiscc.org",
  tagline: ["See what God", "can do through you."],
  description:
    "GBI Soho City Church (SCC) di SOHO Pancoran, Jakarta Selatan. Ibadah setiap Minggu, Worship Night setiap Rabu, dan komunitas untuk bertumbuh bersama.",
  email: "info@gbiscc.org",
  phone: { label: "Pdt. Danny Setiawan", number: "0812 1056 030", tel: "+628121056030" },
  address: [
    "Gedung SOHO Pancoran, Lt. UG",
    "Jl. Letjen M.T. Haryono Kav. 2",
    "Tebet Barat, Pancoran",
    "Jakarta Selatan 12810",
  ],
  socials: [
    { name: "X", href: "" },
    { name: "Facebook", href: "" },
    { name: "YouTube", href: "https://www.youtube.com/@gbisohopancoran-rayon1i174" },
    { name: "Instagram", href: "https://www.instagram.com/soho.citychurch/" },
    { name: "Threads", href: "https://www.threads.net/@soho.citychurch" },
    { name: "TikTok", href: "https://www.tiktok.com/@gbiscc" },
  ] satisfies Social[],
  links: {
    member: "/contact", // TODO: member portal URL
    devotional: "https://www.bible.com/id",
    give: "/contact#give",
  },
  seasonal: { snow: true }, // Christmas snowfall; set false after the season
  partners: [
    { name: "GBI Jl. Gatot Subroto", href: "" },
    { name: "GBI Rayon 1i", href: "" },
  ],
  founded: "2018",
  // First publish date of this website (fixed). Used as datePublished in structured data.
  launched: "2026-11-22",
  // Last content review; shown on pages and used as dateModified in structured data. Bump when content changes.
  updated: "2026-11-22",
  vision: "Menjadi saksi Kristus di era pentakosta ketiga.",
  mission:
    "Berlandaskan 5 pesan Tuhan dalam pelayanan rohani, kami membangun karakter jemaat agar bertumbuh serupa Kristus dan hidup dalam kasih.",
  story:
    "GBI SCC mulai melayani pada tahun 2018 di gedung SOHO Pancoran, Jakarta Selatan. Kami adalah bagian dari GBI Rayon 1i, di bawah naungan GBI Jl. Gatot Subroto yang digembalakan Pdt. Dr. Ir. Niko Njotorahardjo.",
  outreach:
    "Lebih dari 7 tahun, pelayanan GBI SCC bergerak dari ibadah raya setiap minggu ke pelayanan sosial: berbagi makanan bagi yang membutuhkan, pelayanan panti asuhan, dan bakti sosial potong rambut gratis.",
  pastors: [
    { name: "Ps. Herron Dollf Anton", role: "Senior Pastor" },
    { name: "Ps. Danny Setiawan", role: "Associate Pastor" },
  ],
  nav: [
    { label: "About", href: "/about" },
    { label: "Jadwal Ibadah", href: "/jadwal-ibadah" },
    { label: "Next Steps", href: "/next-steps" },
    { label: "Ministries", href: "/#ministries" },
    { label: "Give", href: "/contact#give" },
    { label: "Contact", href: "/contact" },
  ],
};
