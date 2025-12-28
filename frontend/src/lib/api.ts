const BACKEND_BASE = "http://localhost:5173";

type ApiError = {
  status: number;
  message: string;
  details?: any;
};

async function parseJsonSafe(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text || null;
  }
}


const DEFAULT_FETCH_INIT: RequestInit = {};

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BACKEND_BASE}${path}`, {
    ...DEFAULT_FETCH_INIT,
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await parseJsonSafe(res);
    const err: ApiError = {
      status: res.status,
      message:
        (body && (body.detail || body.message)) ||
        `Request failed (${res.status})`,
      details: body,
    };
    throw err;
  }

  if (res.status === 204) return null as T;

  return (await res.json()) as T;
}
