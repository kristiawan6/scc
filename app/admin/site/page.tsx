"use client";

import { useEffect, useState } from "react";
import { PageTitle, primaryBtn } from "@/components/admin/AdminShell";
import { EntryEditor, useIssues, useUnsavedWarning } from "@/components/admin/EntryEditor";
import { emptyValue } from "@/components/admin/Fields";
import { api, ApiError } from "@/lib/admin-api";
import { siteFields } from "@/lib/cms";

export default function SiteSettingsPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const issues = useIssues();
  useUnsavedWarning(dirty);

  useEffect(() => {
    api<{ data: Record<string, unknown> | null }>("/admin/site").then(
      (r) => setData(r.data ?? emptyValue(siteFields)),
      (e) => setError(e.message),
    );
  }, []);

  const save = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    setError("");
    issues.clear();
    try {
      const r = await api<{ data: Record<string, unknown> }>("/admin/site", { method: "PUT", json: { data } });
      setData(r.data);
      setDirty(false);
      setStatus("Pengaturan situs tersimpan.");
    } catch (err) {
      if (err instanceof ApiError && err.issues.length) issues.show(err.issues);
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save}>
      <PageTitle
        actions={
          <button type="submit" disabled={busy || !data} className={primaryBtn}>
            {busy ? "Menyimpan…" : "Simpan"}
          </button>
        }
      >
        Pengaturan situs
      </PageTitle>
      <div aria-live="polite" className="mb-6 empty:hidden">
        {error ? <p className="font-medium text-red-600">{error}</p> : status && <p className="font-medium text-gold-deep">{status}</p>}
      </div>
      {data ? (
        <EntryEditor
          fields={siteFields}
          value={data}
          tone="ink"
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
