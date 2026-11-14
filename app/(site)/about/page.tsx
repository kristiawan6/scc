import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Ministries } from "@/components/sections/Ministries";
import { OurStory } from "@/components/sections/OurStory";
import { site } from "@/content/site";
import { wrap } from "@/lib/ui";

export const metadata: Metadata = {
  title: "About",
  description: "Cerita, visi, misi, dan kepemimpinan GBI Soho City Church di SOHO Pancoran, Jakarta Selatan.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader title="About">
        <p>Shalom, selamat datang di {site.name}.</p>
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
              <li key={p.name} className="rounded-[1.5rem] p-8 ring-1 ring-ink/12">
                <p className="font-script text-4xl leading-none">{p.name}</p>
                <p className="mt-3 text-sm text-stone">{p.role}</p>
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-2xl leading-relaxed text-stone">
            Lebih dari 7 tahun, pelayanan GBI SCC bergerak dari ibadah raya setiap minggu ke pelayanan sosial: berbagi
            makanan bagi yang membutuhkan, pelayanan panti asuhan, dan bakti sosial potong rambut gratis.
          </p>
        </div>
      </section>
      <Ministries />
    </>
  );
}
