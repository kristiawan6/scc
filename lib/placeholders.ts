// SCC's own photos and footage (from the church's Google Drive), resized into /public.
// To swap one, drop a new file in /public/photos and point the key at it.
const photo = (name: string) => `/photos/${name}.jpg`;

export const img = {
  pastor: photo("pastor-herron"),
  worshipNight: photo("worship-night"),
  dawnPrayer: photo("prayer-dawn"),
  cool: photo("community"),
  gic: photo("class"),
  kids: photo("junior-church"),
  hospitality: photo("hospitality"),
  outreach: photo("outreach"),
  worship: photo("worship-dance"),
  prayer: photo("prayer"),
  welcome: photo("welcome"),
  smallGroup: photo("small-group"),
  newToFaith: photo("new-to-faith"),
  serve: photo("serve"),
  og: photo("og"), // 1200x630 social-share crop
};

// Homepage gallery (React Bits CircularGallery).
export const moments = [
  { src: photo("g-worship"), title: "Worship", alt: "Jemaat memuji Tuhan dengan tangan terangkat" },
  { src: photo("g-dance"), title: "Paskah", alt: "Penari menari dengan bendera di depan salib saat Paskah" },
  { src: photo("g-kids"), title: "Sekolah Minggu", alt: "Anak-anak berdoa dengan mata terpejam" },
  { src: photo("g-joy"), title: "Ulang Tahun SCC", alt: "Tim pujian dan jemaat bersukacita di ulang tahun SCC" },
  { src: photo("g-violin"), title: "Musik", alt: "Pemain biola melayani dalam ibadah" },
  { src: photo("g-christmas"), title: "Natal", alt: "Tim pujian memimpin ibadah Natal" },
  { src: photo("g-praise"), title: "Penyembahan", alt: "Seorang jemaat menyembah sambil mengangkat tangan" },
  { src: photo("g-easter"), title: "Keluarga SCC", alt: "Foto bersama jemaat SCC saat Paskah" },
  { src: photo("g-flag"), title: "Tari & Bendera", alt: "Penari bendera dalam penyembahan" },
  { src: photo("g-leader"), title: "Worship Night", alt: "Worship leader memimpin pujian" },
];

// ponytail: 19s montage cut from SCC's own service clips (ffmpeg, 720p, no audio).
// The poster is its first frame so the swap from poster to video is seamless.
export const heroVideo = "/hero.mp4";
export const heroPoster = "/hero-poster.jpg";
