import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CampusCard, OnlineCard } from "@/components/sections/Campuses";
import { campuses, mapEmbed } from "@/content/campuses";
import { wrap } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Jadwal Ibadah",
  description: "Jadwal ibadah GBI Soho City Church di SOHO Pancoran: Ibadah Raya Minggu 10.00 & 16.30, Sekolah Minggu 10.00, Worship Night Rabu 19.00 (juga live YouTube & Instagram), Doa Fajar Sabtu 05.00 via Zoom.",
  alternates: { canonical: "/jadwal-ibadah" },
};

export default function JadwalPage() {
  return (
    <>
      <PageHeader title="Jadwal Ibadah">
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
