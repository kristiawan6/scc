"use client";

import { type MotionValue, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { type ReactNode, useRef } from "react";

const ease = [0.2, 0.7, 0.2, 1] as const;

/** Decorative background word that slides sideways as the section scrolls past. */
export function ScrollMarquee({ text, className = "", distance = 55 }: { text: string; className?: string; distance?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${distance}%`]);
  return (
    <div ref={ref} aria-hidden="true" className={`pointer-events-none select-none overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div style={reduce ? undefined : { x }} className="inline-block">
        {Array.from({ length: 4 }, () => text).join("  ")}
      </motion.div>
    </div>
  );
}

// The trigger sits on the heading, not the hidden lines: a line pushed out of its
// overflow mask is fully clipped, so IntersectionObserver would never see it.
const line = {
  hidden: { y: "110%" },
  show: (i: number) => ({ y: "0%", transition: { duration: 0.9, delay: i * 0.1, ease } }),
};

/** Heading whose lines rise out of a mask when it scrolls into view. */
export function RevealLines({
  lines,
  id,
  className,
  as = "h2",
}: {
  lines: string[];
  id?: string;
  className?: string;
  as?: "h2" | "h3";
}) {
  const Tag = as === "h3" ? motion.h3 : motion.h2;
  return (
    <Tag
      id={id}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px" }}
    >
      {lines.map((text, i) => (
        <span key={text} className="block -mx-[0.1em] -mb-[0.12em] -mt-[0.1em] overflow-hidden px-[0.1em] pb-[0.18em] pt-[0.1em]">
          <motion.span className="block" variants={line} custom={i}>
            {text}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

function SlideWord({ word, i, progress, className }: { word: string; i: number; progress: MotionValue<number>; className?: string }) {
  const x = useTransform(progress, [i * 0.12, 0.55 + i * 0.12], ["-35%", "0%"]);
  const opacity = useTransform(progress, [i * 0.12, 0.4 + i * 0.12], [0, 1]);
  return (
    <motion.span style={{ x, opacity }} className={`block ${className ?? ""}`}>
      {word}
    </motion.span>
  );
}

/** Stacked giant words that slide in one after another, driven by scroll position. */
export function ScrollWords({ words, id, className }: { words: { text: string; className?: string }[]; id?: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  return (
    <h2 ref={ref} id={id} className={className}>
      {words.map((w, i) =>
        reduce ? (
          <span key={w.text} className={`block ${w.className ?? ""}`}>
            {w.text}
          </span>
        ) : (
          <SlideWord key={w.text} word={w.text} i={i} progress={scrollYProgress} className={w.className} />
        ),
      )}
    </h2>
  );
}

/** Fades + slides an item in when it enters view; `i` staggers siblings. */
export function Stagger({ children, i = 0, className }: { children: ReactNode; i?: number; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: 140 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, delay: (i % 3) * 0.12, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Image frame that opens from a small inset window to full size while the image
 *  zooms out, scrubbed to scroll. Children should fill the frame (next/image `fill`). */
export function ClipReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.3"] });
  const clipPath = useTransform(scrollYProgress, [0, 1], ["inset(22% 16% 22% 16% round 24px)", "inset(0% 0% 0% 0% round 24px)"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.4, 1]);
  return (
    <motion.div ref={ref} style={reduce ? undefined : { clipPath }} className={`overflow-hidden ${className}`}>
      <motion.div style={reduce ? undefined : { scale }} className="absolute inset-0">
        {children}
      </motion.div>
    </motion.div>
  );
}
