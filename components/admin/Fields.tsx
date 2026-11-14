"use client";

import { ArrowDown, ArrowUp, ImageUp, Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { api, ApiError } from "@/lib/admin-api";
import type { Field } from "@/lib/cms";
import { RichText } from "./RichText";

type Obj = Record<string, unknown>;
export type Errors = Record<string, string>;
type Tone = "ink" | "paper";

/** A blank document for a set of field definitions. */
export function emptyValue(fields: Field[]): Obj {
  return Object.fromEntries(
    fields.map((f) => {
      switch (f.type) {
        case "boolean":
          return [f.key, false];
        case "list":
        case "repeater":
          return [f.key, []];
        case "group":
          return [f.key, emptyValue(f.fields)];
        case "select":
          return [f.key, f.required ? f.options[0] : undefined];
        default:
          return [f.key, ""];
      }
    }),
  );
}

/** Fields edited directly on the WYSIWYG canvas; everything else goes in the side panel. */
export const onCanvas = (f: Field) => f.type === "image" || f.type === "richtext" || (f.type === "text" && !!f.variant);

const input =
  "w-full rounded-xl bg-white px-4 py-3 text-ink ring-1 ring-ink/15 outline-none transition focus:ring-2 focus:ring-gold aria-invalid:ring-2 aria-invalid:ring-red-600";
const idOf = (path: string) => `f-${path.replace(/\./g, "-")}`;

function Hint({ path, hint, errors }: { path: string; hint?: string; errors: Errors }) {
  return (
    <>
      {hint && <p className="mt-1.5 text-sm text-stone">{hint}</p>}
      {errors[path] && (
        <p id={`${idOf(path)}-err`} className="mt-1.5 text-sm font-medium text-red-600">
          {errors[path]}
        </p>
      )}
    </>
  );
}

const a11y = (path: string, errors: Errors) => ({
  id: idOf(path),
  "aria-invalid": errors[path] ? true : undefined,
  "aria-describedby": errors[path] ? `${idOf(path)}-err` : undefined,
});

export function Fields({ fields, value, onChange, errors, path = "", tone = "paper" }: { fields: Field[]; value: Obj; onChange: (v: Obj) => void; errors: Errors; path?: string; tone?: Tone }) {
  return (
    <div className="grid gap-6">
      {fields.map((f) => (
        <FieldInput
          key={f.key}
          field={f}
          value={value[f.key]}
          onChange={(v) => onChange({ ...value, [f.key]: v })}
          errors={errors}
          path={path ? `${path}.${f.key}` : f.key}
          tone={tone}
        />
      ))}
    </div>
  );
}

export function FieldInput({ field: f, value, onChange, errors, path, tone }: { field: Field; value: unknown; onChange: (v: unknown) => void; errors: Errors; path: string; tone: Tone }) {
  const label = (
    <label htmlFor={idOf(path)} className="mb-2 block text-sm font-semibold">
      {f.label}
      {"required" in f && f.required && <span className="text-red-600"> *</span>}
    </label>
  );

  switch (f.type) {
    case "text":
    case "url":
      return (
        <div>
          {label}
          <input type="text" value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} maxLength={"max" in f ? f.max : undefined} className={input} {...a11y(path, errors)} />
          <Hint path={path} hint={f.hint} errors={errors} />
        </div>
      );
    case "textarea":
      return (
        <div>
          {label}
          <textarea rows={4} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} maxLength={f.max} className={input} {...a11y(path, errors)} />
          <Hint path={path} hint={f.hint} errors={errors} />
        </div>
      );
    case "richtext":
      return (
        <div>
          <span className="mb-2 block text-sm font-semibold">{f.label}</span>
          <RichText value={(value as string) ?? ""} onChange={onChange} label={f.label} tone={tone} />
          <Hint path={path} hint={f.hint} errors={errors} />
        </div>
      );
    case "boolean":
      return (
        <div>
          <label className="flex cursor-pointer items-center gap-3 font-semibold">
            <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="size-5 accent-gold" />
            {f.label}
          </label>
          <Hint path={path} hint={f.hint} errors={errors} />
        </div>
      );
    case "select":
      return (
        <div>
          {label}
          <select value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value || undefined)} className={input} {...a11y(path, errors)}>
            {!f.required && <option value="">—</option>}
            {f.options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <Hint path={path} errors={errors} />
        </div>
      );
    case "list":
      return <ListInput label={label} value={(value as string[]) ?? []} onChange={onChange} path={path} errors={errors} hint={f.hint} />;
    case "image":
      return <ImageInput label={f.label} value={(value as string) ?? ""} onChange={onChange} aspect={f.aspect} path={path} errors={errors} />;
    case "group":
      return (
        <fieldset className="rounded-2xl p-5 ring-1 ring-ink/10">
          <legend className="px-2 text-sm font-semibold">{f.label}</legend>
          <Fields fields={f.fields} value={(value as Obj) ?? emptyValue(f.fields)} onChange={onChange} errors={errors} path={path} tone={tone} />
        </fieldset>
      );
    case "repeater":
      return <Repeater field={f} value={(value as Obj[]) ?? []} onChange={onChange} errors={errors} path={path} tone={tone} />;
  }
}

// One item per line. Keeps its own text so blank lines survive while typing.
function ListInput({ label, value, onChange, path, errors, hint }: { label: React.ReactNode; value: string[]; onChange: (v: string[]) => void; path: string; errors: Errors; hint?: string }) {
  const [text, setText] = useState(value.join("\n"));
  const itemError = Object.entries(errors).find(([k]) => k.startsWith(`${path}.`))?.[1];
  return (
    <div>
      {label}
      <textarea
        rows={Math.max(2, value.length + 1)}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean));
        }}
        className={input}
        {...a11y(path, itemError ? { [path]: itemError } : errors)}
      />
      <Hint path={path} hint={hint ?? "Satu item per baris."} errors={itemError ? { [path]: itemError } : errors} />
    </div>
  );
}

function Repeater({ field: f, value, onChange, errors, path, tone }: { field: Extract<Field, { type: "repeater" }>; value: Obj[]; onChange: (v: Obj[]) => void; errors: Errors; path: string; tone: Tone }) {
  // Stable React keys that follow items through add/remove/reorder, so inputs with
  // their own state (ListInput) stay attached to the right item.
  const [keys, setKeys] = useState(() => value.map(() => crypto.randomUUID()));
  if (keys.length !== value.length) setKeys(value.map(() => crypto.randomUUID()));
  const update = (next: Obj[], nextKeys: string[]) => {
    setKeys(nextKeys);
    onChange(next);
  };
  const swap = <T,>(a: T[], i: number, j: number) => {
    const b = [...a];
    [b[i], b[j]] = [b[j], b[i]];
    return b;
  };
  const move = (i: number, d: -1 | 1) => update(swap(value, i, i + d), swap(keys, i, i + d));
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold">{f.label}</legend>
      <ol className="grid gap-4">
        {value.map((item, i) => (
          <li key={keys[i] ?? i} className="rounded-2xl p-5 ring-1 ring-ink/10">
            <div className="mb-4 flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-stone">
                {f.itemLabel} {i + 1}
              </span>
              <span className="flex gap-1">
                <IconButton label={`Naikkan ${f.itemLabel} ${i + 1}`} disabled={i === 0} onClick={() => move(i, -1)} icon={ArrowUp} />
                <IconButton label={`Turunkan ${f.itemLabel} ${i + 1}`} disabled={i === value.length - 1} onClick={() => move(i, 1)} icon={ArrowDown} />
                <IconButton label={`Hapus ${f.itemLabel} ${i + 1}`} onClick={() => update(value.filter((_, j) => j !== i), keys.filter((_, j) => j !== i))} icon={Trash2} />
              </span>
            </div>
            <Fields fields={f.fields} value={item} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} errors={errors} path={`${path}.${i}`} tone={tone} />
          </li>
        ))}
      </ol>
      <button type="button" onClick={() => update([...value, emptyValue(f.fields)], [...keys, crypto.randomUUID()])} className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-ink/20 hover:bg-black/5">
        <Plus aria-hidden="true" className="size-4" /> Tambah {f.itemLabel.toLowerCase()}
      </button>
    </fieldset>
  );
}

export function IconButton({ label, icon: Icon, ...rest }: { label: string; icon: typeof Plus } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" title={label} aria-label={label} className="grid size-9 place-items-center rounded-lg hover:bg-black/5 disabled:opacity-30" {...rest}>
      <Icon aria-hidden="true" className="size-4" />
    </button>
  );
}

function ImageInput({ label, value, onChange, aspect, path, errors }: { label: string; value: string; onChange: (v: string) => void; aspect: string; path: string; errors: Errors }) {
  const file = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const upload = async (f: File) => {
    setBusy(true);
    setUploadError("");
    const body = new FormData();
    body.append("file", f);
    try {
      onChange((await api<{ url: string }>("/admin/uploads", { method: "POST", body })).url);
    } catch (e) {
      setUploadError(e instanceof ApiError ? e.message : "Gagal mengunggah gambar.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => file.current?.click()}
        style={{ aspectRatio: aspect }}
        className="group relative block w-full overflow-hidden rounded-2xl bg-black/10 outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary CMS URLs, not known to next/image
          <img src={value} alt="" className="size-full object-cover" />
        ) : (
          <span className="absolute inset-0 grid place-items-center text-sm text-stone">Belum ada gambar</span>
        )}
        <span className="absolute inset-0 grid place-items-center bg-ink/60 text-paper opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="inline-flex items-center gap-2 font-semibold">
            <ImageUp aria-hidden="true" className="size-5" /> {busy ? "Mengunggah…" : `Ganti ${label.toLowerCase()}`}
          </span>
        </span>
      </button>
      <input ref={file} type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      <label htmlFor={idOf(path)} className="mt-3 block text-sm font-semibold">
        URL {label.toLowerCase()}
      </label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://… atau unggah dengan klik gambar" className={`${input} mt-2 text-sm`} {...a11y(path, errors)} />
      {uploadError && <p role="alert" className="mt-1.5 text-sm font-medium text-red-600">{uploadError}</p>}
      <Hint path={path} errors={errors} />
    </div>
  );
}
