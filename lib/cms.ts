// Single source of truth for CMS content shape. The API builds its validators
// from these definitions and the /admin editor builds its forms from them.

export type Field =
  | { key: string; label: string; type: "text"; required?: boolean; max?: number; variant?: "title" | "lead"; hint?: string }
  | { key: string; label: string; type: "textarea"; required?: boolean; max?: number; hint?: string }
  | { key: string; label: string; type: "richtext"; required?: boolean; hint?: string }
  | { key: string; label: string; type: "url"; required?: boolean; hint?: string } // absolute URL or site path
  | { key: string; label: string; type: "image"; required?: boolean; aspect: string; hint?: string }
  | { key: string; label: string; type: "boolean"; hint?: string }
  | { key: string; label: string; type: "select"; options: readonly string[]; required?: boolean }
  | { key: string; label: string; type: "list"; hint?: string; pattern?: string } // string[]
  | { key: string; label: string; type: "group"; fields: Field[] }
  | { key: string; label: string; type: "repeater"; fields: Field[]; itemLabel: string };

export type Collection = {
  slug: string;
  label: string;
  /** Field shown as the item name in lists. */
  titleKey: string;
  /** Background of the editor canvas, matching the section it renders in. */
  tone: "paper" | "ink";
  fields: Field[];
};

const image = (aspect: string): Field[] => [
  { key: "image", label: "Gambar", type: "image", required: true, aspect },
  { key: "alt", label: "Deskripsi gambar", type: "text", required: true, max: 160, hint: "Untuk pembaca layar. Jelaskan isi gambar dalam satu kalimat." },
];

export const collections: Collection[] = [
  {
    slug: "highlights",
    label: "What's New",
    titleKey: "title",
    tone: "paper",
    fields: [
      ...image("16/10"),
      { key: "title", label: "Judul", type: "text", required: true, max: 90, variant: "lead" },
      { key: "href", label: "Tautan", type: "url", required: true, hint: "Halaman tujuan saat kartu diklik, misalnya /campuses#jadwal." },
    ],
  },
  {
    slug: "ministries",
    label: "Ministries",
    titleKey: "name",
    tone: "paper",
    fields: [
      ...image("3/4"),
      { key: "name", label: "Nama pelayanan", type: "text", required: true, max: 60, variant: "title" },
      { key: "body", label: "Deskripsi", type: "richtext", required: true },
    ],
  },
  {
    slug: "next-steps",
    label: "Next Steps",
    titleKey: "title",
    tone: "ink",
    fields: [
      ...image("16/9"),
      { key: "slug", label: "ID tautan", type: "text", required: true, max: 40, hint: "Huruf kecil tanpa spasi. Dipakai di /next-steps#id dan ?topic=id." },
      { key: "title", label: "Judul", type: "text", required: true, max: 60, variant: "title" },
      { key: "lead", label: "Subjudul", type: "text", required: true, max: 90, variant: "lead" },
      { key: "body", label: "Isi", type: "richtext", required: true },
      { key: "featured", label: "Tampilkan di beranda", type: "boolean" },
    ],
  },
  {
    slug: "campuses",
    label: "Campuses",
    titleKey: "name",
    tone: "paper",
    fields: [
      { key: "name", label: "Nama campus", type: "text", required: true, max: 60, variant: "title" },
      { key: "slug", label: "ID tautan", type: "text", required: true, max: 40 },
      { key: "address", label: "Alamat (satu baris per item)", type: "list" },
      { key: "mapQuery", label: "Kata kunci Google Maps", type: "text", required: true, max: 200 },
      {
        key: "postal",
        label: "Alamat untuk mesin pencari",
        type: "group",
        fields: [
          { key: "street", label: "Jalan", type: "text", required: true, max: 160 },
          { key: "locality", label: "Kota", type: "text", required: true, max: 60 },
          { key: "region", label: "Provinsi", type: "text", required: true, max: 60 },
          { key: "postalCode", label: "Kode pos", type: "text", required: true, max: 10 },
        ],
      },
      {
        key: "services",
        label: "Jadwal ibadah",
        type: "repeater",
        itemLabel: "Ibadah",
        fields: [
          { key: "type", label: "Nama ibadah", type: "text", required: true, max: 60 },
          { key: "note", label: "Keterangan", type: "text", max: 60 },
          { key: "day", label: "Hari", type: "select", required: true, options: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
          { key: "times", label: "Jam (HH:MM, WIB)", type: "list", pattern: "^([01]\\d|2[0-3]):[0-5]\\d$" },
        ],
      },
    ],
  },
];

/** Singleton settings edited at /admin/site. */
export const siteFields: Field[] = [
  { key: "tagline", label: "Headline beranda (2 baris)", type: "list" },
  { key: "description", label: "Deskripsi untuk mesin pencari", type: "textarea", required: true, max: 300 },
  { key: "story", label: "Cerita gereja", type: "richtext", required: true },
  { key: "vision", label: "Visi", type: "textarea", required: true, max: 300 },
  { key: "mission", label: "Misi", type: "textarea", required: true, max: 500 },
  { key: "email", label: "Email", type: "text", required: true, max: 120 },
  {
    key: "phone",
    label: "Kontak telepon",
    type: "group",
    fields: [
      { key: "label", label: "Nama kontak", type: "text", required: true, max: 60 },
      { key: "number", label: "Nomor (tampilan)", type: "text", required: true, max: 30 },
      { key: "tel", label: "Nomor (format +62)", type: "text", required: true, max: 20 },
    ],
  },
  { key: "address", label: "Alamat (satu baris per item)", type: "list" },
  {
    key: "pastors",
    label: "Gembala",
    type: "repeater",
    itemLabel: "Gembala",
    fields: [
      { key: "name", label: "Nama", type: "text", required: true, max: 80 },
      { key: "role", label: "Jabatan", type: "text", required: true, max: 60 },
    ],
  },
  {
    key: "socials",
    label: "Media sosial",
    type: "repeater",
    itemLabel: "Akun",
    fields: [
      { key: "name", label: "Platform", type: "select", required: true, options: ["X", "Facebook", "YouTube", "Instagram", "Threads", "TikTok"] },
      { key: "href", label: "URL (kosong = disembunyikan)", type: "url" },
    ],
  },
];

export const collectionBySlug = (slug: string) => collections.find((c) => c.slug === slug);
