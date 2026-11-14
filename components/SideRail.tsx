import { site } from "@/content/site";
import { SocialIcon } from "./SocialIcon";

export function SideRail() {
  return (
    <nav aria-label="Media sosial" className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
      <ul className="flex flex-col gap-2">
        {site.socials
          .filter((s) => s.href)
          .map((s) => (
            <li key={s.name}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="grid size-10 place-items-center rounded-full bg-ink/80 text-paper ring-1 ring-white/15 backdrop-blur transition-colors hover:bg-gold hover:text-ink"
              >
                <SocialIcon name={s.name} />
                <span className="sr-only">{s.name}</span>
              </a>
            </li>
          ))}
      </ul>
    </nav>
  );
}
