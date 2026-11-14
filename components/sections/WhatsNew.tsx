"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { highlights } from "@/content/highlights";
import { wrap } from "@/lib/ui";
import { RevealLines, Stagger } from "../Scroll";

const arrow =
  "grid size-12 place-items-center rounded-full bg-ink text-paper transition-colors hover:bg-gold hover:text-ink";

export function WhatsNew() {
  const track = useRef<HTMLUListElement>(null);

  const move = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * (card.clientWidth + 24), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section aria-labelledby="new-title" className="bg-paper py-24 text-ink sm:py-32">
      <div className={`${wrap} flex items-end justify-between gap-6`}>
        <RevealLines id="new-title" lines={["What’s New"]} className="display text-[clamp(2.5rem,6vw,5.5rem)]" />
        <div className="hidden gap-2 sm:flex">
          <button type="button" onClick={() => move(-1)} className={arrow}>
            <ArrowLeft aria-hidden="true" className="size-5" />
            <span className="sr-only">Sebelumnya</span>
          </button>
          <button type="button" onClick={() => move(1)} className={arrow}>
            <ArrowRight aria-hidden="true" className="size-5" />
            <span className="sr-only">Berikutnya</span>
          </button>
        </div>
      </div>

      {/* Native scroll-snap: swipe on touch, arrow keys once focused. */}
      <ul
        ref={track}
        tabIndex={0}
        aria-label="Kabar terbaru. Geser untuk melihat lainnya."
        className="mt-10 flex snap-x snap-mandatory scroll-px-4 gap-6 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:scroll-px-8 sm:px-8 lg:scroll-px-24 lg:px-24 [&::-webkit-scrollbar]:hidden"
      >
        {highlights.map((h, i) => (
          <li key={h.title} className="w-[80vw] shrink-0 snap-start sm:w-[44vw] lg:w-[30vw] lg:max-w-[28rem]">
            <Stagger i={i}>
              <Link href={h.href} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-black/5">
                  <Image
                    src={h.image}
                    alt={h.alt}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 44vw, 80vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold leading-snug">{h.title}</h3>
              </Link>
            </Stagger>
          </li>
        ))}
      </ul>
    </section>
  );
}
