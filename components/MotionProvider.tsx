"use client";

import { MotionConfig, useReducedMotion } from "framer-motion";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import type { ReactNode } from "react";

// Smooth (eased) page scrolling makes the scroll-linked effects read as one motion.
// Visitors with "reduce motion" on get native scrolling and every Framer animation applied instantly.
export function MotionProvider({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <MotionConfig reducedMotion="user">
      {reduce ? children : <ReactLenis root options={{ lerp: 0.09 }}>{children}</ReactLenis>}
    </MotionConfig>
  );
}
