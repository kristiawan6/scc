import { site } from "./site";

export type Day = "Sunday" | "Wednesday" | "Saturday";

export type ServiceGroup = {
  type: string; // "Ibadah Raya 1", "Sekolah Minggu", ...
  note?: string;
  day: Day;
  times: string[]; // "HH:MM", WIB
  online?: boolean; // online-only: kept out of the building's opening hours
};

export type Campus = {
  slug: string;
  name: string;
  address: string[];
  postal: { street: string; locality: string; region: string; postalCode: string }; // for JSON-LD
  mapQuery: string;
  services: ServiceGroup[];
};

export const campuses: Campus[] = [
  {
    slug: "soho-pancoran",
    name: "SOHO Pancoran",
    address: site.address,
    postal: {
      street: "Gedung SOHO Pancoran Lt. UG, Jl. Letjen M.T. Haryono Kav. 2",
      locality: "Jakarta Selatan",
      region: "DKI Jakarta",
      postalCode: "12810",
    },
    mapQuery: "Gedung SOHO Pancoran, Jl. Letjen M.T. Haryono Kav. 2, Jakarta Selatan",
    services: [
      { type: "Ibadah Raya 1", note: "Minggu", day: "Sunday", times: ["10:00"] },
      { type: "Ibadah Raya 2", note: "Minggu", day: "Sunday", times: ["16:30"] },
      { type: "Sekolah Minggu", note: "Minggu", day: "Sunday", times: ["10:00"] },
      { type: "Worship Night", note: "Rabu · Offline + live YouTube & Instagram", day: "Wednesday", times: ["19:00"] },
      { type: "Doa Fajar", note: "Sabtu · Online via Zoom", day: "Saturday", times: ["05:00"], online: true },
    ],
  },
];

export const onlineService = {
  name: "Ikuti Online",
  body: "Worship Night setiap Rabu disiarkan langsung di YouTube dan Instagram. Doa Fajar setiap Sabtu pukul 05.00 lewat Zoom.",
  links: [
    { label: "YOUTUBE", href: "https://www.youtube.com/@gbisohopancoran-rayon1i174", external: true },
    { label: "INSTAGRAM", href: "https://www.instagram.com/soho.citychurch/", external: true },
    // ponytail: no public Zoom link yet; visitors ask for it via the contact form.
    { label: "MINTA LINK ZOOM", href: "/contact", external: false },
  ],
};

export const mapEmbed = (q: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
