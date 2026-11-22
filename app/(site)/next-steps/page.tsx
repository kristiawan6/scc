import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { pageJsonLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { nextSteps } from "@/content/next-steps";
import { btnDark, wrap } from "@/lib/ui";

const meta = {
  title: "Next Steps: COOL & Growth in Christ | GBI Soho City Church",
  description: "Baru di GBI Soho City Church? Mulai dari sini: kenal Yesus, gabung COOL, kelas Growth in Christ, dan melayani.",
  path: "/next-steps",
};
export const metadata: Metadata = pageMeta(meta);

export default function NextStepsPage() {
  return (
    <>
      <JsonLd data={pageJsonLd({ path: meta.path, name: meta.title, description: meta.description })} />
      <PageHeader title="Next Steps">
        <p>Di mana pun kamu sekarang dalam perjalanan iman, selalu ada langkah berikutnya. Kami jalan bersamamu.</p>
      </PageHeader>
      <div className="bg-paper py-24 text-ink sm:py-32">
        <ul className={`${wrap} space-y-24`}>
          {nextSteps.map((s, i) => (
            <li key={s.id} id={s.id} className="scroll-mt-24">
              <Reveal className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
                <div className={`relative aspect-[4/3] overflow-hidden rounded-[1.5rem] ${i % 2 ? "md:order-2" : ""}`}>
                  <Image src={s.image} alt={s.alt} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
                </div>
                <div>
                  <h2 className="display text-[clamp(2.5rem,5vw,4.5rem)]">{s.title}</h2>
                  <p className="mt-3 text-xl font-medium">{s.lead}</p>
                  <p className="mt-4 max-w-md leading-relaxed text-stone">{s.body}</p>
                  <Link href={`/contact?topic=${s.id}`} className={`${btnDark} mt-8`}>
                    Hubungi kami
                  </Link>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
