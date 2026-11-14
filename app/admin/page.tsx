"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageTitle, useUser } from "@/components/admin/AdminShell";
import { api } from "@/lib/admin-api";
import { collections } from "@/lib/cms";

type Summary = { collections: Record<string, number>; unread: number };

export default function Dashboard() {
  const user = useUser();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Summary>("/admin/summary").then(setSummary, (e) => setError(e.message));
  }, []);

  const cards = [
    ...collections.map((c) => ({ href: `/admin/${c.slug}`, label: c.label, value: summary?.collections[c.slug] ?? 0, unit: "item" })),
    { href: "/admin/messages", label: "Pesan belum dibaca", value: summary?.unread ?? 0, unit: "pesan" },
  ];

  return (
    <>
      <PageTitle>Halo, {user?.name.split(" ")[0]}</PageTitle>
      {error && <p role="alert" className="mb-6 text-red-600">{error}</p>}
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <li key={c.href}>
            <Link href={c.href} className="block rounded-2xl bg-white p-6 ring-1 ring-ink/10 transition hover:ring-ink/30">
              <span className="block text-sm font-semibold text-stone">{c.label}</span>
              <span className="display mt-3 block text-5xl tabular-nums">{summary ? c.value : "–"}</span>
              <span className="mt-1 block text-sm text-stone">{c.unit}</span>
            </Link>
          </li>
        ))}
        <li>
          <Link href="/admin/site" className="flex h-full flex-col justify-between rounded-2xl bg-ink p-6 text-paper transition hover:bg-ink-2">
            <span className="text-sm font-semibold text-smoke">Pengaturan situs</span>
            <span className="mt-3 block text-lg">Visi, misi, cerita, kontak, gembala, dan media sosial.</span>
          </Link>
        </li>
      </ul>
    </>
  );
}
