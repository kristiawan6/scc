import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { pageJsonLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/content/site";
import { wrap } from "@/lib/ui";

const meta = {
  title: "Kontak, Permohonan Doa & Persembahan | GBI Soho City Church",
  crumb: "Kontak",
  description: "Hubungi GBI Soho City Church untuk pertanyaan, permohonan doa, atau informasi persembahan.",
  path: "/contact",
};
export const metadata: Metadata = pageMeta(meta);

export default function ContactPage() {
  return (
    <>
      <JsonLd data={pageJsonLd({ path: meta.path, name: meta.title, crumb: meta.crumb, description: meta.description })} />
      <PageHeader title="Contact">
        <p>Tulis pesanmu, dan tim kami akan membalas secepatnya.</p>
      </PageHeader>
      <section aria-label="Formulir kontak" className="bg-paper py-24 text-ink sm:py-32">
        <div className={`${wrap} grid gap-16 lg:grid-cols-[1fr_2fr]`}>
          <aside className="space-y-10">
            <div>
              <h2 className="display text-3xl">Kantor</h2>
              <address className="mt-4 not-italic leading-relaxed text-stone">
                {site.address.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
                <a href={`tel:${site.phone.tel}`} className="mt-1 block py-2.5 text-ink underline-offset-4 hover:underline">
                  {site.phone.number} ({site.phone.label})
                </a>
                <a href={`mailto:${site.email}`} className="block py-2.5 text-ink underline-offset-4 hover:underline">
                  {site.email}
                </a>
              </address>
            </div>
            <div id="give" className="scroll-mt-24">
              <h2 className="display text-3xl">Give</h2>
              <p className="mt-4 leading-relaxed text-stone">
                Untuk informasi persembahan dan perpuluhan, pilih topik &ldquo;Persembahan&rdquo; di formulir atau
                hubungi kantor gereja.
              </p>
            </div>
          </aside>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
