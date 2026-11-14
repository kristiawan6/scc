"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { PageTitle, primaryBtn } from "@/components/admin/AdminShell";
import { IconButton } from "@/components/admin/Fields";
import { api, type Entry } from "@/lib/admin-api";
import { collectionBySlug } from "@/lib/cms";

export default function CollectionPage() {
  const { collection } = useParams<{ collection: string }>();
  const col = collectionBySlug(collection);
  const [items, setItems] = useState<Entry[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    api<Entry[]>(`/admin/content/${collection}`).then(setItems, (e) => setError(e.message));
  }, [collection]);
  useEffect(load, [load]);

  if (!col) notFound();

  const run = async (fn: () => Promise<unknown>) => {
    setError("");
    try {
      await fn();
    } catch (e) {
      setError((e as Error).message);
    }
    load();
  };

  const move = (i: number, d: -1 | 1) => {
    if (!items) return;
    const next = [...items];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setItems(next); // optimistic
    run(() => api(`/admin/content/${collection}/order`, { method: "PUT", json: { ids: next.map((x) => x.id) } }));
  };

  const togglePublished = (e: Entry) =>
    run(() => api(`/admin/content/${collection}/${e.id}`, { method: "PUT", json: { data: e.data, published: !e.published } }));

  const remove = (e: Entry) => {
    if (!window.confirm(`Hapus "${String(e.data[col.titleKey])}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    run(() => api(`/admin/content/${collection}/${e.id}`, { method: "DELETE" }));
  };

  return (
    <>
      <PageTitle
        actions={
          <Link href={`/admin/${collection}/new`} className={primaryBtn}>
            <Plus aria-hidden="true" className="size-4" /> Tambah
          </Link>
        }
      >
        {col.label}
      </PageTitle>
      {error && <p role="alert" className="mb-6 text-red-600">{error}</p>}
      {!items ? (
        <p className="text-stone">Memuat…</p>
      ) : items.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-stone ring-1 ring-ink/10">
          Belum ada konten. Klik <strong>Tambah</strong> untuk membuat yang pertama.
        </p>
      ) : (
        <ol className="grid gap-3">
          {items.map((e, i) => {
            const title = String(e.data[col.titleKey] ?? "Tanpa judul");
            const image = typeof e.data.image === "string" ? e.data.image : "";
            return (
              <li key={e.id} className="flex items-center gap-4 rounded-2xl bg-white p-3 pr-4 ring-1 ring-ink/10">
                <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary CMS URLs */}
                  {image && <img src={image} alt="" className="size-full object-cover" />}
                </div>
                <Link href={`/admin/${collection}/${e.id}`} className="min-w-0 flex-1 font-semibold underline-offset-4 hover:underline">
                  <span className="block truncate">{title}</span>
                  <span className="block text-sm font-normal text-stone">Diubah {new Date(e.updated_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => togglePublished(e)}
                  aria-pressed={e.published}
                  aria-label={`${e.published ? "Sembunyikan" : "Tampilkan"} "${title}" di website`}
                  className="rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-ink/15 aria-pressed:bg-gold/20 aria-pressed:text-gold-deep aria-pressed:ring-gold/40"
                >
                  {e.published ? "Tayang" : "Draf"}
                </button>
                <span className="flex">
                  <IconButton label={`Naikkan "${title}"`} icon={ArrowUp} disabled={i === 0} onClick={() => move(i, -1)} />
                  <IconButton label={`Turunkan "${title}"`} icon={ArrowDown} disabled={i === items.length - 1} onClick={() => move(i, 1)} />
                  <IconButton label={`Hapus "${title}"`} icon={Trash2} onClick={() => remove(e)} />
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </>
  );
}
