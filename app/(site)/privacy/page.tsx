import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { pageJsonLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { privacy } from "@/content/privacy";
import { wrap } from "@/lib/ui";

const meta = {
  title: "Kebijakan Privasi & Data Jemaat | GBI Soho City Church",
  description: "Bagaimana GBI Soho City Church mengelola data yang kamu kirim lewat website gbiscc.org, termasuk formulir kontak dan permohonan doa.",
  path: "/privacy",
};
export const metadata: Metadata = pageMeta(meta);

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={pageJsonLd({ path: meta.path, name: meta.title, description: meta.description })} />
      <PageHeader title="Privacy" />
      <section className="bg-paper py-24 text-ink">
        <div className={`${wrap} max-w-3xl space-y-4 leading-relaxed text-stone`}>
          {privacy.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
      </section>
    </>
  );
}
