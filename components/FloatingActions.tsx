import Link from "next/link";
import { BookOpen, UserRound } from "lucide-react";
import { site } from "@/content/site";

const btn =
  "group relative grid size-12 place-items-center rounded-full bg-paper text-ink shadow-lg ring-1 ring-black/10 transition-colors hover:bg-gold";
const tip =
  "pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-xs text-paper opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100";

export function FloatingActions() {
  return (
    <div className="fixed bottom-4 right-4 z-30 flex flex-col gap-2 sm:bottom-6 sm:right-6">
      <Link href={site.links.member} className={btn}>
        <UserRound aria-hidden="true" className="size-5" />
        <span className={tip}>Member</span>
        <span className="sr-only">Member</span>
      </Link>
      <a href={site.links.devotional} target="_blank" rel="noopener noreferrer" className={btn}>
        <BookOpen aria-hidden="true" className="size-5" />
        <span className={tip}>Alkitab & renungan</span>
        <span className="sr-only">Alkitab dan renungan (tab baru)</span>
      </a>
    </div>
  );
}
