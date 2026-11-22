import type { ReactNode } from "react";
import { wrap } from "@/lib/ui";

export function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className={`${wrap} bg-ink pb-16 pt-36 sm:pb-24 sm:pt-44`}>
      <h1 className="display text-[clamp(3.5rem,12vw,10rem)]">
        <span className="block -mx-[0.1em] -mb-[0.12em] -mt-[0.1em] overflow-hidden px-[0.1em] pb-[0.18em] pt-[0.1em]">
          <span className="rise block">{title}</span>
        </span>
      </h1>
      {children && <div className="mt-8 max-w-2xl text-lg leading-relaxed text-smoke">{children}</div>}
    </header>
  );
}
