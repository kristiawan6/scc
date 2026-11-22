import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Docker image runs .next/standalone/server.js (see Dockerfile)
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
      { source: "/komunitas", destination: "/next-steps", permanent: true },
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
    ];
  },
  // /campuses is served (not redirected) because an earlier build 308'd /jadwal-ibadah -> /campuses;
  // browsers that cached that would loop if /campuses redirected back. Canonical is /jadwal-ibadah.
  async rewrites() {
    return [
      { source: "/campuses", destination: "/jadwal-ibadah" },
      // Markdown copies for AI agents: /index.md, /about.md, /jadwal-ibadah.md, ...
      { source: "/:slug.md", destination: "/md/:slug" },
    ];
  },
};

export default nextConfig;
