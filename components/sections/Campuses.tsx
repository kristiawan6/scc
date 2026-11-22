import Link from "next/link";
import { type Campus, campuses, onlineService } from "@/content/campuses";
import { btn, wrap } from "@/lib/ui";
import { Reveal } from "../Reveal";
import { RevealLines } from "../Scroll";

export function CampusCard({ campus }: { campus: Campus }) {
  return (
    <article className="rounded-[1.5rem] p-6 ring-1 ring-ink/12 sm:p-10">
      <h3 className="display text-[clamp(2rem,4vw,3rem)]">{campus.name}</h3>
      <address className="mt-4 not-italic leading-relaxed text-stone">
        {campus.address.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </address>
      <dl className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {campus.services.map((s) => (
          <div key={s.type}>
            <dt className="font-semibold">
              {s.type}
              {s.note && <span className="block text-sm font-normal text-stone">{s.note}</span>}
            </dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {s.times.map((t) => (
                <time
                  key={t}
                  dateTime={t}
                  className="rounded-full px-3.5 py-1.5 text-sm font-medium tabular-nums ring-1 ring-ink/20"
                >
                  {t}
                </time>
              ))}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 text-sm text-stone">Semua waktu dalam WIB.</p>
    </article>
  );
}

export function OnlineCard() {
  return (
    <article className="flex flex-col justify-between gap-10 rounded-[1.5rem] bg-ink p-6 text-paper sm:p-10">
      <div>
        <h3 className="display text-[clamp(2rem,4vw,3rem)]">{onlineService.name.toUpperCase()}</h3>
        <p className="mt-4 max-w-sm leading-relaxed text-smoke">{onlineService.body}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {onlineService.links.map((l) =>
          l.external ? (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={btn}>
              {l.label}
            </a>
          ) : (
            <Link key={l.href} href={l.href} className={btn}>
              {l.label}
            </Link>
          ),
        )}
      </div>
    </article>
  );
}

export function Campuses() {
  return (
    <section id="jadwal" aria-labelledby="jadwal-title" className="bg-paper py-24 text-ink sm:py-32">
      <div className={wrap}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <RevealLines id="jadwal-title" lines={["Jadwal Ibadah"]} className="display text-[clamp(2.5rem,6vw,5.5rem)]" />
          <Link href="/jadwal-ibadah" className="text-sm font-semibold tracking-wide underline-offset-8 hover:underline">
            LIHAT LOKASI & PETA
          </Link>
        </div>
        <Reveal className="mt-12 grid gap-6 lg:grid-cols-[2fr_1fr]">
          {campuses.map((c) => (
            <CampusCard key={c.slug} campus={c} />
          ))}
          <OnlineCard />
        </Reveal>
      </div>
    </section>
  );
}
