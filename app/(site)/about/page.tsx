import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { pageJsonLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { Ministries } from "@/components/sections/Ministries";
import { OurStory } from "@/components/sections/OurStory";
import { site } from "@/content/site";
import { wrap } from "@/lib/ui";

const meta = {
  title: "Tentang Kami: Visi, Misi & Gembala | GBI Soho City Church",
  crumb: "Tentang Kami",
  description: "Cerita, visi, misi, dan para gembala GBI Soho City Church, gereja GBI Rayon 1i yang melayani sejak 2018 di SOHO Pancoran, Jakarta Selatan.",
  path: "/about",
};
export const metadata: Metadata = pageMeta(meta);

export default function AboutPage() {
  return (
    <>
      <JsonLd data={pageJsonLd({ path: meta.path, name: meta.title, crumb: meta.crumb, description: meta.description })} />
      <PageHeader title="About">
        <p>
          Shalom, selamat datang di {site.name}, yang juga dikenal sebagai {site.alternateNames[0]}.
        </p>
        <p className="mt-4">{site.story}</p>
      </PageHeader>
      <OurStory showLink={false} />
      <section aria-labelledby="leaders-title" className="bg-paper py-24 text-ink sm:py-32">
        <div className={wrap}>
          <h2 id="leaders-title" className="display text-[clamp(2.5rem,6vw,5.5rem)]">
            Leadership
          </h2>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2">
            {site.pastors.map((p) => (
              <li key={p.name} id={p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")} className="rounded-[1.5rem] p-8 ring-1 ring-ink/12">
                <p className="font-script text-4xl leading-none">{p.name}</p>
                <p className="mt-3 text-sm text-stone">{p.role}</p>
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-2xl leading-relaxed text-stone">{site.outreach}</p>
        </div>
      </section>
      <Ministries />
    </>
  );
}
