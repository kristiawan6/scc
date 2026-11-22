import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { img } from "@/lib/placeholders";
import { btn, wrap } from "@/lib/ui";
import { Reveal } from "../Reveal";
import ShinyText from "../reactbits/ShinyText";
import TiltedCard from "../reactbits/TiltedCard";
import { RevealLines, ScrollMarquee } from "../Scroll";

export function OurStory({ showLink = true }: { showLink?: boolean }) {
  const [senior] = site.pastors;
  return (
    <section aria-labelledby="story-title" className="overflow-hidden bg-ink pt-24 sm:pt-32">
      <h2 id="story-title" className="sr-only">
        Our Story
      </h2>
      <div className="relative">
        <ScrollMarquee
          text="Our Story"
          className="display text-outline absolute inset-x-0 top-[38%] -translate-y-1/2 text-[clamp(7rem,24vw,22rem)]"
        />
        <Reveal className="relative mx-auto w-[min(78vw,26rem)]">
          <TiltedCard
            containerHeight="auto"
            imageWidth="100%"
            imageHeight="100%"
            radius="1.5rem"
            rotateAmplitude={10}
            showTooltip={false}
            gyroscope={false}
            intro={false}
            style={{ aspectRatio: "4 / 5" }}
          >
            <Image
              src={img.pastor}
              alt={`Foto ${senior.name}`}
              fill
              sizes="(min-width: 640px) 26rem, 78vw"
              className="pointer-events-none object-cover grayscale"
            />
          </TiltedCard>
          <div className="relative z-10 -mt-9 text-center">
            <p className="font-script text-[clamp(2.5rem,7vw,3.75rem)] leading-none text-paper">{senior.name}</p>
            <p className="mt-3 text-xs font-medium tracking-[0.25em]">
              <ShinyText text="— SENIOR PASTOR" color="#c9a227" shineColor="#fff4c2" speed={2.5} delay={1.5} />
            </p>
          </div>
        </Reveal>
      </div>

      <div className={`${wrap} grid gap-12 py-24 sm:py-32 md:grid-cols-2 md:gap-16`}>
        <Reveal>
          <RevealLines as="h3" lines={["Our Vision"]} className="display text-[clamp(2.25rem,4.5vw,3.75rem)]" />
          <p className="mt-5 max-w-md text-lg leading-relaxed text-smoke">{site.vision}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <RevealLines as="h3" lines={["Our Mission"]} className="display text-[clamp(2.25rem,4.5vw,3.75rem)]" />
          <p className="mt-5 max-w-md text-lg leading-relaxed text-smoke">{site.mission}</p>
        </Reveal>
        {showLink && (
          <div className="md:col-span-2">
            <Link href="/about" className={btn}>
              MORE ABOUT US
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
