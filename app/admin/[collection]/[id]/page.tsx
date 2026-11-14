"use client";

import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageTitle, primaryBtn } from "@/components/admin/AdminShell";
import { EntryEditor, useIssues, useUnsavedWarning } from "@/components/admin/EntryEditor";
import { emptyValue } from "@/components/admin/Fields";
import { api, ApiError, type Entry } from "@/lib/admin-api";
import { collectionBySlug } from "@/lib/cms";

export default function EditEntryPage() {
  const { collection, id } = useParams<{ collection: string; id: string }>();
  const router = useRouter();
  const col = collectionBySlug(collection);
  const isNew = id === "new";

  const [data, setData] = useState<Record<string, unknown> | null>(isNew && col ? emptyValue(col.fields) : null);
  const [published, setPublished] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const issues = useIssues();
  useUnsavedWarning(dirty);

  useEffect(() => {
    if (isNew) return;
    api<Entry>(`/admin/content/${collection}/${id}`).then(
      (e) => {
        setData(e.data);
        setPublished(e.published);
      },
      (e) => setError(e.message),
    );
  }, [collection, id, isNew]);

  if (!col) notFound();

  const save = async () => {
    setBusy(true);
    setStatus("");
    setError("");
    issues.clear();
    try {
      const body = { data, published };
      const saved = isNew
        ? await api<Entry>(`/admin/content/${collection}`, { method: "POST", json: body })
        : await api<Entry>(`/admin/content/${collection}/${id}`, { method: "PUT", json: body });
      setDirty(false);
      setData(saved.data);
      setStatus(published ? "Tersimpan dan tayang di website." : "Tersimpan sebagai draf.");
      if (isNew) router.replace(`/admin/${collection}/${saved.id}`);
    } catch (e) {
      if (e instanceof ApiError && e.issues.length) issues.show(e.issues);
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const title = data ? String(data[col.titleKey] || "") : "";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <Link href={`/admin/${collection}`} className="text-sm font-semibold text-stone underline-offset-4 hover:underline">
        ← {col.label}
      </Link>
      <PageTitle
        actions={
          <div className="flex items-center gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => {
                  setPublished(e.target.checked);
                  setDirty(true);
                }}
                className="size-5 accent-gold"
              />
              Tayang di website
            </label>
            <button type="submit" disabled={busy || !data} className={primaryBtn}>
              {busy ? "Menyimpan…" : "Simpan"}
            </button>
          </div>
        }
      >
        {isNew ? `${col.label} baru` : title || "Tanpa judul"}
      </PageTitle>

      <div aria-live="polite" className="mb-6 empty:hidden">
        {error ? <p className="font-medium text-red-600">{error}</p> : status && <p className="font-medium text-gold-deep">{status}</p>}
      </div>

      {data ? (
        <EntryEditor
          fields={col.fields}
          value={data}
          tone={col.tone}
          errors={issues.errors}
          onChange={(v) => {
            setData(v);
            setDirty(true);
            setStatus("");
          }}
        />
      ) : (
        !error && <p className="text-stone">Memuat…</p>
      )}
    </form>
  );
}
