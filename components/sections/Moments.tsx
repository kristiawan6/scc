"use client";

import CircularGallery from "@/components/reactbits/CircularGallery";
import { moments } from "@/lib/placeholders";
import { wrap } from "@/lib/ui";
import { RevealLines } from "../Scroll";

// WebGL textures skip next/image, so request the optimizer directly (828px webp, not the 1600px jpg).
const items = moments.map((m) => ({
  image: `/_next/image?url=${encodeURIComponent(m.src)}&w=828&q=70`,
  text: m.title,
  alt: m.alt,
}));

// ponytail: no fallback for browsers without WebGL2 (~3%); they see the heading only.
export function Moments() {
  return (
    <section aria-labelledby="moments-title" className="overflow-hidden bg-ink py-24 sm:py-32">
      <RevealLines
        id="moments-title"
        lines={["Life at", "Soho City"]}
        className={`${wrap} display text-[clamp(3rem,9vw,8rem)]`}
      />
      <p className={`${wrap} mt-6 text-sm tracking-[0.2em] text-smoke`}>GESER UNTUK MELIHAT · KLIK UNTUK MEMPERBESAR</p>
      <div className="mt-6 h-[clamp(24rem,62vw,40rem)]">
        <CircularGallery
          items={items}
          aria-label="Galeri foto jemaat SCC"
          bend={2}
          grayscale
          textColor="#ffffff"
          font="700 26px var(--font-epilogue)"
          borderRadius={0.06}
          autoScroll={0.6}
        />
      </div>
    </section>
  );
}
