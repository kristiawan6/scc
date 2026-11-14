import { site } from "./site";

export type Day = "Sunday" | "Wednesday" | "Saturday";

export type ServiceGroup = {
  type: string; // "Sunday Service", "Youth", "Kids", ...
  note?: string;
  day: Day;
  times: string[]; // "HH:MM", WIB
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
      { type: "Sunday Service", note: "Ibadah Raya 1 & 2", day: "Sunday", times: ["10:00", "16:30"] },
      { type: "Kids", note: "Sekolah Minggu", day: "Sunday", times: ["10:00"] },
      { type: "Youth", note: "Junior Church", day: "Sunday", times: ["13:30"] },
      { type: "Worship Night", note: "Rabu", day: "Wednesday", times: ["19:00"] },
      { type: "Doa Fajar", note: "Sabtu", day: "Saturday", times: ["05:00"] },
    ],
  },
];

export const onlineService = {
  name: "Online Service",
  body: "Tidak bisa hadir? Ikuti ibadah dan khotbah SCC lewat kanal YouTube kami.",
  href: "https://www.youtube.com/@gbisohopancoran-rayon1i174",
};

export const mapEmbed = (q: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
