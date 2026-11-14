import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/content/site";
import { wrap } from "@/lib/ui";

export const metadata: Metadata = { title: "Privacy policy", alternates: { canonical: "/privacy" } };

// TODO: have church leadership review this text.
export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacy" />
      <section className="bg-paper py-24 text-ink">
        <div className={`${wrap} max-w-3xl space-y-4 leading-relaxed text-stone`}>
          <p>
            Situs ini tidak menyimpan data pribadi di server. Formulir kontak membuka aplikasi email kamu, sehingga
            pesan dikirim langsung dari email kamu ke {site.email}.
          </p>
          <p>Data yang kamu kirim hanya dipakai untuk membalas pesanmu dan tidak dibagikan ke pihak lain.</p>
          <p>Pertanyaan tentang privasi bisa dikirim ke {site.email}.</p>
        </div>
      </section>
    </>
  );
}
