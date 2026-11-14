"use client";

import { useEffect, useState } from "react";
import type { Field } from "@/lib/cms";
import { type Errors, FieldInput, Fields, onCanvas } from "./Fields";

type Obj = Record<string, unknown>;

/**
 * WYSIWYG layout: the left canvas shows the item the way the website renders it
 * (same background, fonts and image ratio) and is edited in place; the right
 * column holds details that are not visible as such (links, alt text, slugs).
 */
export function EntryEditor({ fields, value, onChange, errors, tone }: { fields: Field[]; value: Obj; onChange: (v: Obj) => void; errors: Errors; tone: "ink" | "paper" }) {
  const canvas = fields.filter(onCanvas);
  const side = fields.filter((f) => !onCanvas(f));
  // Two columns only when the canvas has something visual (image or rich text); otherwise stack.
  const split = canvas.some((f) => f.type !== "text") && side.length > 0;
  const set = (key: string) => (v: unknown) => onChange({ ...value, [key]: v });

  return (
    <div className={`grid items-start gap-8 ${split ? "xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]" : "max-w-3xl"}`}>
      {canvas.length > 0 && (
        <section aria-label="Pratinjau dan edit langsung" className={`rounded-3xl p-5 sm:p-8 ${tone === "ink" ? "bg-ink text-paper" : "bg-paper text-ink ring-1 ring-ink/10"}`}>
          <p className={`mb-5 text-xs font-semibold ${tone === "ink" ? "text-smoke" : "text-stone"}`}>Tampilan di website. Klik teks atau gambar untuk mengubahnya.</p>
          <div className="grid gap-6">
            {canvas.map((f) =>
              f.type === "text" ? (
                <CanvasText key={f.key} field={f} value={(value[f.key] as string) ?? ""} onChange={set(f.key)} error={errors[f.key]} />
              ) : (
                <FieldInput key={f.key} field={f} value={value[f.key]} onChange={set(f.key)} errors={errors} path={f.key} tone={tone} />
              ),
            )}
          </div>
        </section>
      )}
      {side.length > 0 && (
        <section aria-label="Detail" className="h-fit rounded-3xl bg-white p-5 ring-1 ring-ink/10 sm:p-8">
          <Fields fields={side} value={value} onChange={onChange} errors={errors} />
        </section>
      )}
    </div>
  );
}

function CanvasText({ field: f, value, onChange, error }: { field: Extract<Field, { type: "text" }>; value: string; onChange: (v: string) => void; error?: string }) {
  const id = `f-${f.key}`;
  const style = f.variant === "title" ? "display text-[clamp(2rem,4vw,3.25rem)]" : "text-lg font-semibold leading-snug";
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {f.label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        placeholder={f.label}
        maxLength={f.max}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`${style} w-full rounded-lg border-b border-dashed border-current/25 bg-transparent px-1 pb-1 outline-none placeholder:opacity-30 focus:border-gold aria-invalid:border-red-500`}
      />
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

/** Warns before leaving with unsaved changes: closing/reloading the tab and in-app links. */
export function useUnsavedWarning(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    // Capture phase on document runs before React/Next <Link> handlers.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!a || a.getAttribute("target") === "_blank" || e.metaKey || e.ctrlKey) return;
      if (!window.confirm("Ada perubahan yang belum disimpan. Tinggalkan halaman ini?")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", warn);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", warn);
      document.removeEventListener("click", onClick, true);
    };
  }, [dirty]);
}

/** Turns API validation issues into a path → message map and focuses the first field. */
export function useIssues() {
  const [errors, setErrors] = useState<Errors>({});
  const show = (issues: { path: string; message: string }[]) => {
    const map = Object.fromEntries(issues.map((i) => [i.path, i.message]));
    setErrors(map);
    const first = issues[0]?.path;
    if (first) requestAnimationFrame(() => document.getElementById(`f-${first.replace(/\./g, "-")}`)?.focus());
  };
  return { errors, show, clear: () => setErrors({}) };
}
