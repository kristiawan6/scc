"use client";

import { useEffect, useRef } from "react";

// Autoplays muted; stays on the poster frame for people who prefer reduced motion.
export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) ref.current?.pause();
  }, []);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-hidden="true"
      className="absolute inset-0 size-full object-cover grayscale contrast-[1.15]"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
