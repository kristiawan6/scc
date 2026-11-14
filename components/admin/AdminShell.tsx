"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { api, ApiError, type User } from "@/lib/admin-api";
import { collections } from "@/lib/cms";

const UserContext = createContext<User | null>(null);
export const useUser = () => useContext(UserContext);

const nav = [
  { href: "/admin", label: "Ringkasan" },
  ...collections.map((c) => ({ href: `/admin/${c.slug}`, label: c.label })),
  { href: "/admin/site", label: "Pengaturan situs" },
  { href: "/admin/messages", label: "Pesan masuk" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const onLogin = path === "/admin/login";

  useEffect(() => {
    if (onLogin) return;
    api<{ user: User }>("/auth/me")
      .then((r) => setUser(r.user))
      .catch((e) => (e instanceof ApiError && e.status === 401 ? router.replace("/admin/login") : setError(e.message)));
  }, [onLogin, router]);

  if (onLogin) return <>{children}</>;
  if (error) return <p role="alert" className="p-10 text-red-600">{error}</p>;
  if (!user) return <p className="p-10 text-stone">Memuat…</p>;

  const logout = async () => {
    await api("/auth/logout", { method: "POST" }).catch(() => {});
    router.replace("/admin/login");
  };

  return (
    <UserContext.Provider value={user}>
      <div className="min-h-dvh bg-[#f4f4f2] text-ink lg:grid lg:grid-cols-[16rem_1fr]">
        <aside className="bg-ink text-paper lg:sticky lg:top-0 lg:h-dvh">
          <div className="flex items-center justify-between gap-4 p-5 lg:block">
            <Link href="/admin" className="flex items-center gap-3">
              <Image src="/scc-mark.png" alt="" width={28} height={28} />
              <span className="font-display text-lg font-extrabold tracking-tight">SCC CMS</span>
            </Link>
            <button type="button" onClick={logout} className="text-sm text-smoke underline-offset-4 hover:text-paper hover:underline lg:hidden">
              Keluar
            </button>
          </div>
          <nav aria-label="Menu CMS" className="overflow-x-auto px-3 pb-3 lg:pb-0">
            <ul className="flex gap-1 lg:block lg:space-y-1">
              {nav.map((n) => {
                const current = n.href === "/admin" ? path === "/admin" : path.startsWith(n.href);
                return (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      aria-current={current ? "page" : undefined}
                      className="block whitespace-nowrap rounded-lg px-3 py-2 text-sm text-smoke hover:bg-ink-2 hover:text-paper aria-[current=page]:bg-gold aria-[current=page]:font-semibold aria-[current=page]:text-ink"
                    >
                      {n.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="absolute bottom-0 hidden w-64 border-t border-white/10 p-5 text-sm lg:block">
            <p className="truncate font-semibold">{user.name}</p>
            <p className="truncate text-smoke">{user.email}</p>
            <div className="mt-3 flex gap-4">
              <Link href="/" target="_blank" className="text-smoke underline-offset-4 hover:text-paper hover:underline">
                Lihat situs
              </Link>
              <button type="button" onClick={logout} className="text-smoke underline-offset-4 hover:text-paper hover:underline">
                Keluar
              </button>
            </div>
          </div>
        </aside>
        <main id="main" className="min-w-0 p-4 sm:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </UserContext.Provider>
  );
}

export function PageTitle({ children, actions }: { children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <h1 className="display text-[clamp(2rem,4vw,3rem)]">{children}</h1>
      {actions}
    </div>
  );
}

export const primaryBtn =
  "inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-gold hover:text-ink disabled:opacity-50";
