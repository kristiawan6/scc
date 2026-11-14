export const topics = {
  general: "Pertanyaan umum",
  new: "Saya baru mengenal Yesus",
  cool: "Gabung COOL (small group)",
  gic: "Kelas Growth in Christ",
  serve: "Ingin melayani",
  prayer: "Permohonan doa",
  give: "Persembahan",
} as const;

export type Topic = keyof typeof topics;
export type ContactInput = { name: string; email: string; phone: string; topic: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s-]{8,16}$/;

export function validateContact(v: ContactInput): ContactErrors {
  const e: ContactErrors = {};
  if (v.name.trim().length < 2) e.name = "Tulis nama kamu (minimal 2 huruf).";
  else if (v.name.length > 120) e.name = "Nama terlalu panjang (maksimal 120 karakter).";
  if (!EMAIL.test(v.email.trim()) || v.email.length > 200) e.email = "Masukkan alamat email yang valid, misalnya nama@email.com.";
  if (v.phone.trim() && !PHONE.test(v.phone.trim())) e.phone = "Nomor HP hanya boleh berisi angka, spasi, atau tanda +.";
  if (!Object.hasOwn(topics, v.topic)) e.topic = "Pilih salah satu topik.";
  if (v.message.trim().length < 10) e.message = "Ceritakan sedikit lebih banyak (minimal 10 karakter).";
  else if (v.message.length > 5000) e.message = "Pesan terlalu panjang (maksimal 5000 karakter).";
  return e;
}
