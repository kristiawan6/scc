"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import BlurText from "../reactbits/BlurText";
import LightRays from "../reactbits/LightRays";
import { HeroVideo } from "./HeroVideo";

// Pinned hero: while the visitor scrolls through ~1.5 screens, the video grows
// from a wide card just under the headline to a full-screen frame that covers it.
const GAP = 40;
export function HeroScroll({ lines, src, poster }: { lines: string[]; src: string; poster: string }) {
  const ref = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  // Where the video starts: the headline's bottom edge + GAP, measured because
  // the headline wraps to 2-3 lines depending on width. -1 = not measured yet.
  const start = useMotionValue(-1);
  const reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const titleScale = useTransform(p, [0, 0.7], [1, 0.82]);
  const titleOpacity = useTransform(p, [0.05, 0.3], [1, 0]);
  const titleY = useTransform(p, [0, 0.3], [0, -120]);
  const width = useTransform(p, [0, 0.75], ["84%", "100%"]);
  const top = useTransform([p, start], ([v, s]: number[]) =>
    // Before hydration: estimate for a two-line headline at mt-[16vh].
    s < 0 ? `calc(16vh + 1.9 * clamp(2.75rem, 7.8vw, 9rem) + ${GAP}px)` : `${s * (1 - Math.min(v / 0.75, 1))}px`,
  );

  useEffect(() => {
    const measure = () => {
      const h = title.current;
      if (h) start.set(h.offsetTop + h.offsetHeight + GAP);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [start]);
  const radius = useTransform(p, [0, 0.75], [28, 0]);
  const shade = useTransform(p, [0.5, 1], [0, 0.35]);

  if (reduce) {
    return (
      <section aria-labelledby="hero-title" className="bg-ink pt-32 sm:pt-40">
        <h1 id="hero-title" className="display px-4 text-center text-[clamp(2.75rem,7.8vw,9rem)]">
          {lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <div className="relative mt-12 aspect-[4/5] overflow-hidden bg-ink-2 sm:aspect-[16/9]">
          <HeroVideo src={src} poster={poster} />
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative h-[250vh] bg-ink">
      <div className="sticky top-0 flex h-dvh flex-col items-center overflow-hidden">
        <LightRays
          className="!absolute inset-0"
          raysColor="#e8c766"
          raysSpeed={0.6}
          lightSpread={0.9}
          rayLength={1.6}
          glow={0.5}
          atmosphere={0.3}
          mouseInfluence={0.08}
          cursorShadow={false}
          clickPulse={false}
          opacity={0.8}
        />
        <motion.h1
          ref={title}
          id="hero-title"
          style={{ scale: titleScale, opacity: titleOpacity, y: titleY }}
          className="display relative mt-[18vh] px-4 text-center text-[clamp(2.75rem,7.8vw,9rem)] sm:mt-[16vh]"
        >
          {lines.map((line) => (
            <BlurText
              key={line}
              text={line}
              trigger="load"
              direction="bottom"
              delay={140}
              stepDuration={0.45}
              className="justify-center pb-[0.08em]"
            />
          ))}
        </motion.h1>
        <motion.div
          style={{ width, top, borderRadius: radius }}
          className="absolute bottom-0 overflow-hidden bg-ink-2 max-sm:!w-full"
        >
          <HeroVideo src={src} poster={poster} />
          <motion.span style={{ opacity: shade }} className="absolute inset-0 bg-ink" />
        </motion.div>
      </div>
    </section>
  );
}
