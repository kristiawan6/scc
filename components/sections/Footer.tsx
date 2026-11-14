import Link from "next/link";
import { siAppstore, siGoogleplay } from "simple-icons";
import { site } from "@/content/site";
import { btn, wrap } from "@/lib/ui";
import { RevealLines } from "../Scroll";

const heading = "text-sm font-semibold text-paper";

function StoreBadge({ label, href, path }: { label: string; href: string; path: string }) {
  const inner = (
    <>
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="currentColor">
        <path d={path} />
      </svg>
      <span className="leading-tight">
        <span className="block text-[0.7rem] text-smoke">{href ? "Download di" : "Segera hadir di"}</span>
        <span className="block font-semibold">{label}</span>
      </span>
    </>
  );
  const cls = "inline-flex items-center gap-3 rounded-xl px-4 py-2.5 ring-1";
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${cls} ring-white/20 hover:ring-gold`}>
      {inner}
    </a>
  ) : (
    <span className={`${cls} ring-white/10`}>{inner}</span>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink pt-24 text-smoke sm:pt-32">
      <div className={wrap}>
        <div className="max-w-5xl">
          <RevealLines lines={["How can we", "help you?"]} className="display text-[clamp(2.75rem,7vw,6rem)] text-paper" />
          <p className="mt-6 max-w-xl text-lg leading-relaxed">
            Punya pertanyaan, butuh didoakan, atau ingin mulai melayani? Tim kami senang mendengar dari kamu.
          </p>
          <Link href="/contact" className={`${btn} mt-8`}>
            CONTACT US
          </Link>
        </div>

        <div className="mt-20 grid gap-10 border-t border-white/10 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className={heading}>Office</h3>
            <address className="mt-4 space-y-1 not-italic leading-relaxed">
              {site.address.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
              <a href={`tel:${site.phone.tel}`} className="mt-3 block hover:text-gold">
                {site.phone.number} ({site.phone.label})
              </a>
              <a href={`mailto:${site.email}`} className="block hover:text-gold">
                {site.email}
              </a>
            </address>
          </div>
          <nav aria-labelledby="footer-links">
            <h3 id="footer-links" className={heading}>
              Quick links
            </h3>
            <ul className="mt-4 space-y-2">
              {site.nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-gold">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h3 className={heading}>Partners</h3>
            <ul className="mt-4 space-y-2">
              {site.partners.map((p) => (
                <li key={p.name}>
                  {p.href ? (
                    <a href={p.href} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                      {p.name}
                    </a>
                  ) : (
                    p.name
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={heading}>Download our app</h3>
            <div className="mt-4 flex flex-col items-start gap-3">
              <StoreBadge label="App Store" href={site.apps.appStore} path={siAppstore.path} />
              <StoreBadge label="Google Play" href={site.apps.playStore} path={siGoogleplay.path} />
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap justify-between gap-4 border-t border-white/10 py-8 text-sm">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <Link href="/privacy" className="hover:text-gold">
            Privacy policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
