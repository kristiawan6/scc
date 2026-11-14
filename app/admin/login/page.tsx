"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { primaryBtn } from "@/components/admin/AdminShell";
import { api, ApiError } from "@/lib/admin-api";

const input = "w-full rounded-xl bg-white px-4 py-3 text-ink ring-1 ring-ink/15 outline-none focus:ring-2 focus:ring-gold";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      await api("/auth/login", { method: "POST", json: { email: form.get("email"), password: form.get("password") } });
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal masuk.");
      setBusy(false);
    }
  };

  return (
    <main id="main" className="grid min-h-dvh place-items-center bg-ink p-4 text-paper">
      <form onSubmit={submit} className="w-full max-w-sm">
        <Image src="/scc-mark.png" alt="" width={44} height={44} />
        <h1 className="display mt-6 text-5xl">Masuk ke CMS</h1>
        <p className="mt-3 text-smoke">Kelola konten website GBI Soho City Church.</p>
        <label htmlFor="email" className="mt-8 mb-2 block text-sm font-semibold">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className={input} />
        <label htmlFor="password" className="mt-5 mb-2 block text-sm font-semibold">
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={input} />
        {error && (
          <p role="alert" className="mt-4 text-sm font-medium text-red-400">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className={`${primaryBtn} mt-8 w-full justify-center bg-gold text-ink hover:bg-paper`}>
          {busy ? "Memeriksa…" : "Masuk"}
        </button>
      </form>
    </main>
  );
}
