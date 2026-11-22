"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { site } from "@/content/site";
import { SocialIcon } from "./SocialIcon";

export function Header() {
  // Native <dialog>: focus trap, Esc to close and inert background for free.
  const menu = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => menu.current?.close(), [pathname]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 py-4 sm:px-8">
        <Link href="/" className="pointer-events-auto flex items-center gap-3" aria-label={`${site.name}, beranda`}>
          <Image src="/scc-mark.png" alt="" width={40} height={45} priority className="h-11 w-auto" />
        </Link>
        <button
          type="button"
          onClick={() => menu.current?.showModal()}
          aria-haspopup="dialog"
          className="pointer-events-auto grid size-12 place-items-center rounded-full bg-paper text-ink shadow-lg ring-1 ring-black/10 transition-transform hover:scale-105"
        >
          <span className="sr-only">Buka menu</span>
          <span aria-hidden="true" className="flex w-5 flex-col gap-1.5">
            <span className="h-0.5 bg-current" />
            <span className="h-0.5 w-3 bg-current" />
          </span>
        </button>
      </header>

      <dialog
        ref={menu}
        aria-label="Menu utama"
        data-lenis-prevent
        className="menu m-0 h-dvh max-h-none w-screen max-w-none bg-ink text-paper"
        onClick={(e) => e.target === e.currentTarget && menu.current?.close()}
      >
        <div className="mx-auto flex min-h-full max-w-7xl flex-col px-4 py-4 sm:px-8">
          <div className="flex justify-end">
            <button
              type="button"
              autoFocus
              onClick={() => menu.current?.close()}
              className="grid size-12 place-items-center rounded-full bg-paper text-ink"
            >
              <span className="sr-only">Tutup menu</span>
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>
          <nav aria-label="Utama" className="flex flex-1 items-center">
            <ul className="space-y-3 sm:space-y-4">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => menu.current?.close()}
                    className="display block py-1 text-[clamp(2.25rem,min(8vw,8.5vh),5.5rem)] leading-[1.05] text-paper/90 transition-colors hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-wrap items-end justify-between gap-6 border-t border-white/10 pt-6 text-sm text-smoke">
            <p>{site.address.join(", ")}</p>
            <ul className="flex gap-4">
              {site.socials
                .filter((s) => s.href)
                .map((s) => (
                  <li key={s.name}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                      <SocialIcon name={s.name} className="size-5" />
                      <span className="sr-only">{s.name}</span>
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </dialog>
    </>
  );
}
