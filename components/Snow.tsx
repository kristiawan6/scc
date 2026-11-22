"use client";

import PixelSnow from "./reactbits/PixelSnow";

// Thin Christmas snowfall over the whole site. Toggle with site.seasonal.snow.
export function Snow() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-20 mix-blend-screen">
      <PixelSnow
        variant="snowflake"
        density={0.08}
        speed={0.6}
        wind={0.15}
        flakeSize={0.6}
        pixelSize={2}
        glow={0.4}
        twinkle={0.5}
        opacity={0.55}
        mouseInteraction={false}
        dpr={1}
      />
    </div>
  );
}
