"use client";

import { Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { PageTitle } from "@/components/admin/AdminShell";
import { IconButton } from "@/components/admin/Fields";
import { api, type Message } from "@/lib/admin-api";
import { topics } from "@/lib/contact";

export default function MessagesPage() {
  const [items, setItems] = useState<Message[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    api<Message[]>("/admin/messages").then(setItems, (e) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  const run = (fn: () => Promise<unknown>) =>
    fn()
      .catch((e: Error) => setError(e.message))
      .finally(load);

  return (
    <>
      <PageTitle>Pesan masuk</PageTitle>
      {error && <p role="alert" className="mb-6 text-red-600">{error}</p>}
      {!items ? (
        <p className="text-stone">Memuat…</p>
      ) : items.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-stone ring-1 ring-ink/10">Belum ada pesan dari form kontak.</p>
      ) : (
        <ul className="grid gap-3">
          {items.map((m) => (
            <li key={m.id} className={`rounded-2xl bg-white p-5 ring-1 ${m.read ? "ring-ink/10" : "ring-2 ring-gold"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {m.name} {!m.read && <span className="ml-2 rounded-full bg-gold px-2 py-0.5 text-xs text-ink">Baru</span>}
                  </p>
                  <p className="text-sm text-stone">
                    <a href={`mailto:${m.email}`} className="underline-offset-4 hover:underline">{m.email}</a>
                    {m.phone && <> · <a href={`tel:${m.phone.replace(/\s/g, "")}`} className="underline-offset-4 hover:underline">{m.phone}</a></>}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-ink/15">
                    {topics[m.topic as keyof typeof topics] ?? m.topic}
                  </span>
                  <time dateTime={m.created_at} className="text-sm text-stone">
                    {new Date(m.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                  </time>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-line leading-relaxed">{m.message}</p>
              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => run(() => api(`/admin/messages/${m.id}`, { method: "PATCH", json: { read: !m.read } }))}
                  className="rounded-full px-4 py-1.5 text-sm font-semibold ring-1 ring-ink/15 hover:bg-black/5"
                >
                  Tandai {m.read ? "belum dibaca" : "sudah dibaca"}
                </button>
                <IconButton
                  label={`Hapus pesan dari ${m.name}`}
                  icon={Trash2}
                  onClick={() => window.confirm(`Hapus pesan dari ${m.name}?`) && run(() => api(`/admin/messages/${m.id}`, { method: "DELETE" }))}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
