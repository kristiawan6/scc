// Browser-side client for the Hono API. The session is an httpOnly cookie set
// by the API, so every request just sends credentials.

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001").replace(/\/$/, "");

export type Issue = { path: string; message: string };

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public issues: Issue[] = [],
  ) {
    super(message);
  }
}

// One refresh at a time: parallel 401s share it, since each refresh token is single-use.
// ponytail: two tabs refreshing at the same instant can log one out; add a BroadcastChannel lock if that bites.
let refreshing: Promise<boolean> | null = null;
const refresh = () =>
  (refreshing ??= fetch(`${API_URL}/auth/refresh`, { method: "POST", credentials: "include" })
    .then((r) => r.ok, () => false)
    .finally(() => setTimeout(() => (refreshing = null), 0)));

export async function api<T = unknown>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const { json, ...rest } = init;
  const send = () =>
    fetch(`${API_URL}${path}`, {
      credentials: "include",
      ...rest,
      headers: json === undefined ? rest.headers : { "Content-Type": "application/json", ...rest.headers },
      body: json === undefined ? rest.body : JSON.stringify(json),
    });
  let res: Response;
  try {
    res = await send();
    // Access token expired: renew it with the refresh cookie, then retry once.
    if (res.status === 401 && !/^\/auth\/(login|refresh|logout)/.test(path) && (await refresh())) res = await send();
  } catch {
    throw new ApiError(0, `Tidak bisa terhubung ke API di ${API_URL}. Pastikan server API berjalan.`);
  }
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, body.error ?? `Permintaan gagal (${res.status}).`, body.issues);
  return body as T;
}

export type Entry = { id: string; position: number; published: boolean; data: Record<string, unknown>; updated_at: string };
export type Message = { id: string; name: string; email: string; phone: string; topic: string; message: string; read: boolean; created_at: string };
export type User = { id: string; email: string; name: string };
