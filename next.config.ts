import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "scc-storage.b-cdn.net" },
    ],
  },
  // Old Indonesian URLs keep working (and keep their search ranking).
  async redirects() {
    return [
      { source: "/tentang", destination: "/about", permanent: true },
      { source: "/jadwal-ibadah", destination: "/campuses", permanent: true },
      { source: "/komunitas", destination: "/next-steps", permanent: true },
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
    ];
  },
};

export default nextConfig;
