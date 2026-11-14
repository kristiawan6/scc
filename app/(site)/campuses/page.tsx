import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CampusCard, OnlineCard } from "@/components/sections/Campuses";
import { campuses, mapEmbed } from "@/content/campuses";
import { wrap } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Campuses & Jadwal Ibadah",
  description: "Lokasi dan jadwal ibadah GBI Soho City Church: Ibadah Raya Minggu 10.00 & 16.30, Worship Night Rabu 19.00, Doa Fajar Sabtu 05.00.",
  alternates: { canonical: "/campuses" },
};

export default function CampusesPage() {
  return (
    <>
      <PageHeader title="Campuses">
        <p>Datang dan beribadah bersama kami. Semua waktu dalam WIB.</p>
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
    </>
  );
}
