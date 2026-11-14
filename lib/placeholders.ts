// Every stock image/video URL lives here. Swap these for SCC's own photos
// (Bunny CDN / Cloudinary are already allowed in next.config.ts).

const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export const img = {
  // TODO: replace with a real photo of the senior pastor(s)
  pastor: unsplash("1542042179-03efeb269b35", 1200),
  worshipNight: unsplash("1508829040592-72f179f8a73f"),
  dawnPrayer: unsplash("1437603568260-1950d3ca6eab"),
  cool: unsplash("1491438590914-bc09fcaaf77a"),
  gic: unsplash("1529070538774-1843cb3265df"),
  juniorChurch: unsplash("1511632765486-a01980e01a18"),
  outreach: unsplash("1582213782179-e0d53f98f2ca"),
  worship: unsplash("1580243152089-98da42694285"),
  prayer: unsplash("1519915734606-32d972e3b9b7"),
  creative: unsplash("1507692049790-de58290a4334"),
  welcome: unsplash("1565813086292-604790c8a97b"),
  smallGroup: unsplash("1550096141-7263640aa48c"),
  newToFaith: unsplash("1520857014576-2c4f4c972b57"),
  campus: unsplash("1442504028989-ab58b5f29a4a"),
  og: unsplash("1477281765962-ef34e8bb0967", 1200),
};

// ponytail: free Mixkit clip (family praying) until SCC has its own service footage.
// Replace both together; the poster is a frame of the video so the swap is seamless.
export const heroVideo = "https://assets.mixkit.co/videos/24119/24119-720.mp4";
export const heroPoster = "/hero-poster.jpg";
