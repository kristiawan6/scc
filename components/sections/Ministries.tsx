import Image from "next/image";
import { ministries } from "@/content/ministries";
import { wrap } from "@/lib/ui";
import { Reveal } from "../Reveal";
import { ClipReveal, RevealLines, ScrollMarquee } from "../Scroll";

export function Ministries() {
  return (
    <section id="ministries" aria-labelledby="ministries-title" className="overflow-hidden bg-paper py-24 text-ink sm:py-32">
      <div className="relative">
        <ScrollMarquee
          text="Serve the City"
          className="display text-outline absolute inset-x-0 top-1/2 -translate-y-1/2 text-[clamp(6rem,18vw,16rem)] [--stroke:rgb(15_15_15/0.1)]"
        />
        <RevealLines
          id="ministries-title"
          lines={["Serve", "the City"]}
          className={`${wrap} display relative text-[clamp(3rem,9vw,8rem)]`}
        />
      </div>
      <ul className={`${wrap} mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4`}>
        {ministries.map((m, i) => (
          <li key={m.name}>
            <Reveal delay={i * 0.08}>
              <ClipReveal className="relative aspect-[3/4] rounded-2xl bg-black/5">
                  <Image
                    src={m.image}
                    alt={m.alt}
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                    className="object-cover grayscale transition duration-700 hover:scale-105 hover:grayscale-0"
                  />
              </ClipReveal>
              <h3 className="display mt-5 text-2xl">{m.name}</h3>
              <p className="mt-2 leading-relaxed text-stone">{m.body}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
