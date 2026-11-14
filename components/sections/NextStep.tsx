import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { nextSteps } from "@/content/next-steps";
import { wrap } from "@/lib/ui";
import { Reveal } from "../Reveal";
import { ClipReveal, ScrollWords } from "../Scroll";

export function NextStep() {
  return (
    <section aria-labelledby="next-title" className="bg-ink py-24 sm:py-32">
      <div className={`${wrap} grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16`}>
        <ScrollWords
          id="next-title"
          words={[{ text: "Your" }, { text: "Next" }, { text: "Step", className: "text-gold" }]}
          className="display text-[clamp(4.5rem,14vw,12rem)] leading-[0.82]"
        />
        <ul className="grid gap-6">
          {nextSteps
            .filter((s) => s.featured)
            .map((s, i) => (
              <li key={s.id}>
                <Reveal delay={i * 0.1}>
                  <Link
                    href={`/next-steps#${s.id}`}
                    className="group relative flex min-h-[15rem] items-end overflow-hidden rounded-[1.5rem] p-6 sm:min-h-[18rem] sm:p-8"
                  >
                    <ClipReveal className="absolute inset-0">
                      <Image
                        src={s.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 45vw, 100vw"
                        className="object-cover opacity-45 grayscale transition duration-700 group-hover:scale-105 group-hover:opacity-60"
                      />
                    </ClipReveal>
                    <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                    <span className="relative">
                      <span className="display block text-[clamp(2rem,4vw,3.25rem)]">{s.title}</span>
                      <span className="mt-2 block text-lg text-smoke">{s.lead}</span>
                    </span>
                    <span className="absolute right-6 top-6 grid size-12 place-items-center rounded-full bg-gold text-ink transition duration-300 sm:right-8 sm:top-8 lg:-translate-x-2 lg:opacity-0 lg:group-hover:translate-x-0 lg:group-hover:opacity-100 lg:group-focus-visible:translate-x-0 lg:group-focus-visible:opacity-100">
                      <ArrowUpRight aria-hidden="true" className="size-5" />
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}
