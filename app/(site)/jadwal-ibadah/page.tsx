import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { faqs } from "@/content/faq";
import { site } from "@/content/site";
import { faqJsonLd, pageJsonLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { CampusCard, OnlineCard } from "@/components/sections/Campuses";
import { campuses, mapEmbed } from "@/content/campuses";
import { wrap } from "@/lib/ui";

const meta = {
  title: "Jadwal Ibadah Minggu & Worship Night | GBI Soho City Church",
  description: "Jadwal ibadah GBI Soho City Church di SOHO Pancoran: Ibadah Raya Minggu 10.00 & 16.30, Sekolah Minggu 10.00, Worship Night Rabu 19.00 (juga live YouTube & Instagram), Doa Fajar Sabtu 05.00 via Zoom.",
  path: "/jadwal-ibadah",
};
export const metadata: Metadata = pageMeta(meta);

const updatedLabel = new Date(site.updated).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

export default function JadwalPage() {
  return (
    <>
      <JsonLd data={pageJsonLd({ path: meta.path, name: meta.title, description: meta.description }, faqJsonLd(meta.path, faqs))} />
      <PageHeader title="Jadwal Ibadah">
        <p>
          Ibadah Raya setiap Minggu pukul 10.00 dan 16.30, Sekolah Minggu pukul 10.00, Worship Night setiap Rabu pukul
          19.00, dan Doa Fajar setiap Sabtu pukul 05.00 lewat Zoom. Semua waktu dalam WIB.
        </p>
        <p className="mt-4 text-sm">
          Terakhir diperbarui <time dateTime={site.updated}>{updatedLabel}</time>
        </p>
      </PageHeader>
      <section id="jadwal" aria-label="Lokasi dan jadwal" className="scroll-mt-24 bg-paper py-24 text-ink sm:py-32">
        <div className={`${wrap} space-y-6`}>
          {campuses.map((c) => (
            <div key={c.slug} className="grid gap-6 lg:grid-cols-2">
              <CampusCard campus={c} />
              <iframe
                src={mapEmbed(c.mapQuery)}
                title={`Peta lokasi ${c.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-[22rem] w-full rounded-[1.5rem] grayscale"
              />
            </div>
          ))}
          <OnlineCard />
        </div>
      </section>
      <section aria-labelledby="faq-title" className="bg-paper pb-24 text-ink sm:pb-32">
        <div className={wrap}>
          <h2 id="faq-title" className="display text-[clamp(2.25rem,5vw,4rem)]">
            Pertanyaan Umum
          </h2>
          <dl className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
            {faqs.map((f) => (
              <div key={f.q} className="grid gap-3 py-6 md:grid-cols-[2fr_3fr] md:gap-10">
                <dt className="text-lg font-semibold">{f.q}</dt>
                <dd className="leading-relaxed text-stone">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
