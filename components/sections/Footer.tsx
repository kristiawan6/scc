import Link from "next/link";
import { site } from "@/content/site";
import { btn, wrap } from "@/lib/ui";
import { RevealLines } from "../Scroll";

const heading = "text-sm font-semibold text-paper";

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

        <div className="mt-20 grid gap-10 border-t border-white/10 pt-12 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className={heading}>Office</h3>
            <address className="mt-4 space-y-1 not-italic leading-relaxed">
              {site.address.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
              <a href={`tel:${site.phone.tel}`} className="mt-1 block py-2.5 hover:text-gold">
                {site.phone.number} ({site.phone.label})
              </a>
              <a href={`mailto:${site.email}`} className="block py-2.5 hover:text-gold">
                {site.email}
              </a>
            </address>
          </div>
          <nav aria-labelledby="footer-links">
            <h3 id="footer-links" className={heading}>
              Quick links
            </h3>
            <ul className="mt-2">
              {site.nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="inline-block py-2.5 hover:text-gold">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h3 className={heading}>Partners</h3>
            <ul className="mt-2">
              {site.partners.map((p) => (
                <li key={p.name}>
                  {p.href ? (
                    <a href={p.href} target="_blank" rel="noopener noreferrer" className="inline-block py-2.5 hover:text-gold">
                      {p.name}
                    </a>
                  ) : (
                    <span className="inline-block py-2.5">{p.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pb-36 pt-6 text-sm lg:pb-8">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <Link href="/privacy" className="inline-block py-3 hover:text-gold">
            Privacy policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
