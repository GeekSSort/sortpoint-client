/**
 * API client. Absorbs three backend conventions so no screen has to know them:
 *
 * 1. Responses are enveloped — `{success, data, ...}`, plus `meta` for a list.
 * 2. Money arrives as a decimal STRING; `toAmount` converts at the boundary.
 * 3. Paths are used exactly as written — see `normalizeEndpoint`.
 */

/** Set when the API answered with an error envelope. Carries the code a screen branches on. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly errors: Record<string, unknown>;
  readonly requestId?: string;

  constructor(
    status: number,
    code: string,
    message: string,
    errors: Record<string, unknown> = {},
    requestId?: string
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.errors = errors;
    this.requestId = requestId;
  }
}

/**
 * Where the API lives. Read from the page's own address, because one bundle
 * serves every tenant and a token is refused on another tenant's host.
 * `NEXT_PUBLIC_API_URL` overrides it when the API lives elsewhere.
 */
export function resolveBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL;
  if (configured) return configured.replace(/\/+$/, "");

  if (typeof window === "undefined") return "";

  const port = process.env.NEXT_PUBLIC_API_PORT || "8000";
  const { protocol, hostname } = window.location;
  const host = port ? `${hostname}:${port}` : hostname;
  return `${protocol}//${host}/api/v1`;
}

/**
 * Which front door this page is — the same rule the server uses.
 *
 *   base domain, or a listed platform host  → platform
 *   <label>.<base domain>                   → that tenant
 *
 * Decides which login endpoint the page uses.
 */
export function resolveRealm(): "tenant" | "platform" {
  if (typeof window === "undefined") return "platform";

  const base = (process.env.NEXT_PUBLIC_PLATFORM_BASE_DOMAIN || "").trim().toLowerCase();
  if (!base) return "platform";

  const host = window.location.hostname.toLowerCase();
  const platformHosts = (process.env.NEXT_PUBLIC_PLATFORM_HOSTS || "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

  if (host === base || platformHosts.includes(host)) return "platform";
  if (host.endsWith(`.${base}`) && host.slice(0, -(base.length + 1)).length > 0) return "tenant";
  return "platform";
}

/** The tenant label in the address, when there is one. */
export function currentSubdomain(): string | null {
  if (resolveRealm() !== "tenant" || typeof window === "undefined") return null;
  const base = (process.env.NEXT_PUBLIC_PLATFORM_BASE_DOMAIN || "").trim().toLowerCase();
  const host = window.location.hostname.toLowerCase();
  return host.slice(0, -(base.length + 1)) || null;
}

/** True when we have somewhere to send requests. */
export function apiConfigured(): boolean {
  return Boolean(resolveBaseUrl());
}

export function snakeToCamelCase<T = any>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map((v) => snakeToCamelCase(v)) as unknown as T;
  }
  if (obj !== null && typeof obj === "object" && !(obj instanceof Date)) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z0-9])/g, (_, g) => g.toUpperCase());
      result[camelKey] = snakeToCamelCase(obj[key]);
      return result;
    }, {} as Record<string, any>) as T;
  }
  return obj;
}

/**
 * Decimal string -> number. Call it on fields you know are money: an invoice
 * number and a barcode are digits too, and neither is a quantity.
 */
export function toAmount(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

const TOKEN_KEY = "access_token";
const REFRESH_KEY = "refresh_token";
const BRANCH_KEY = "active_branch";

/**
 * Markers the route guard can see — it runs before the page and cannot read
 * localStorage. They hold no token: forging one gets an empty page shell,
 * because the API still checks the bearer token.
 */
const SESSION_COOKIE = "sp_session";

/** Which part of the app this person may see: "pos" or "full". */
const SCOPE_COOKIE = "sp_scope";

function writeCookie(name: string, value: string | null) {
  if (typeof document === "undefined") return;
  document.cookie =
    value === null
      ? `${name}=; path=/; SameSite=Lax; max-age=0`
      : `${name}=${value}; path=/; SameSite=Lax; max-age=${60 * 60 * 24 * 7}`;
}

export const tokenStore = {
  access: () => (typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY)),
  refresh: () => (typeof window === "undefined" ? null : localStorage.getItem(REFRESH_KEY)),
  branch: () => (typeof window === "undefined" ? null : localStorage.getItem(BRANCH_KEY)),
  set(access: string, refresh?: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, access);
    // Kept because older code reads "token"; both are written so a half-updated
    // bundle cannot log somebody out.
    localStorage.setItem("token", access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
    writeCookie(SESSION_COOKIE, "1");
  },
  setScope(scope: "pos" | "full") {
    writeCookie(SCOPE_COOKIE, scope);
  },
  setBranch(branchId: string | null) {
    if (typeof window === "undefined") return;
    if (branchId) localStorage.setItem(BRANCH_KEY, branchId);
    else localStorage.removeItem(BRANCH_KEY);
  },
  clear() {
    if (typeof window === "undefined") return;
    [TOKEN_KEY, REFRESH_KEY, BRANCH_KEY, "token"].forEach((k) => localStorage.removeItem(k));
    writeCookie(SESSION_COOKIE, null);
    writeCookie(SCOPE_COOKIE, null);
  },
};

/**
 * The path is used EXACTLY as written — do not add a trailing slash.
 *
 * The API mixes both forms on purpose: `/auth/login` has none, `/products/`
 * does. Appending one turns every sign-in into a 404, because APPEND_SLASH
 * adds a missing slash but never removes a spare one.
 */
function normalizeEndpoint(endpoint: string): string {
  return endpoint;
}

export interface ApiFetchOptions extends RequestInit {
  mapSnakeCase?: boolean;
  /** Sent as `Idempotency-Key`. Required by POST /sales and partner payments. */
  idempotencyKey?: string;
  /** Act in one branch for this request only, without moving the user's cursor. */
  branchId?: string;
  /** Skip the Authorization header (login, refresh, accept-invitation). */
  anonymous?: boolean;
}

interface Envelope<T> {
  success?: boolean;
  data?: T;
  message?: string;
  code?: string;
  errors?: Record<string, unknown>;
  requestId?: string;
  meta?: { page?: number; limit?: number; total?: number; totalPages?: number };
}

export interface PagedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function request<T>(
  endpoint: string,
  options: ApiFetchOptions,
  allowRefresh: boolean
): Promise<Envelope<T>> {
  const { mapSnakeCase = true, idempotencyKey, branchId, anonymous, ...fetchOptions } = options;
  const base = resolveBaseUrl();
  const url = `${base}/${normalizeEndpoint(endpoint).replace(/^\/+/, "")}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  if (!anonymous && !headers["Authorization"]) {
    const token = tokenStore.access();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;

  // Only when a caller explicitly acts in another branch. The active branch is
  // already server-side state, and `X-Branch` is not in the API's allowed CORS
  // headers — sending it always would break every call.
  if (branchId) headers["X-Branch"] = branchId;

  let response: Response;
  try {
    response = await fetch(url, { ...fetchOptions, headers });
  } catch (cause) {
    // The server is unreachable — refused, DNS, CORS preflight, offline. This
    // is not an answer from the API, so it gets its own code: callers can tell
    // "the backend said no" from "there was no backend".
    throw new ApiError(0, "NETWORK_ERROR", `Could not reach the API at ${base}.`, {
      cause: String(cause),
    });
  }

  let body: any = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  if (mapSnakeCase && body) body = snakeToCamelCase(body);

  if (response.ok) return body as Envelope<T>;

  // An expired access token is the one failure worth retrying by itself.
  if (response.status === 401 && allowRefresh && !anonymous && body?.code === "TOKEN_EXPIRED") {
    const refreshed = await tryRefresh();
    if (refreshed) return request<T>(endpoint, options, false);
  }

  throw new ApiError(
    response.status,
    body?.code || "HTTP_ERROR",
    body?.message || `Request to ${endpoint} failed with ${response.status}.`,
    body?.errors || {},
    body?.requestId
  );
}

let refreshInFlight: Promise<boolean> | null = null;

/** Rotate the refresh token. Shared so ten parallel 401s cause one refresh, not ten. */
async function tryRefresh(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;

  const refresh = tokenStore.refresh();
  if (!refresh) return false;

  refreshInFlight = (async () => {
    try {
      const body = await request<{ access: string; refresh?: string }>(
        "/auth/refresh",
        { method: "POST", body: JSON.stringify({ refresh }), anonymous: true },
        false
      );
      const access = body?.data?.access;
      if (!access) return false;
      tokenStore.set(access, body?.data?.refresh);
      return true;
    } catch {
      // Reuse detection kills the whole family server-side, so there is nothing
      // left to retry with — drop the tokens rather than loop.
      tokenStore.clear();
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

/**
 * One request, envelope removed. `fallbackData` applies only when no API is
 * configured — never to paper over a failure, because a till showing invented
 * prices is worse than one saying it is offline.
 */
export async function apiFetch<T>(
  endpoint: string,
  options?: ApiFetchOptions,
  fallbackData?: T | (() => Promise<T> | T),
  mapper?: (data: any) => T
): Promise<T> {
  if (!apiConfigured()) return resolveFallback(fallbackData);

  try {
    const body = await request<T>(endpoint, options || {}, true);
    const payload = (body && "data" in body ? body.data : body) as T;
    return mapper ? mapper(payload) : payload;
  } catch (error) {
    if (shouldFallBack(error, fallbackData)) return resolveFallback(fallbackData);
    throw error;
  }
}

/**
 * Sample data is allowed only when the server could not be reached at all, and
 * never in production. A 4xx or 5xx is the server talking.
 */
function shouldFallBack(error: unknown, fallbackData: unknown): boolean {
  if (fallbackData === undefined) return false;
  if (process.env.NODE_ENV === "production") return false;
  if (!(error instanceof ApiError) || error.code !== "NETWORK_ERROR") return false;
  console.warn(`[api] ${error.message} Falling back to sample data (development only).`);
  return true;
}

/**
 * A paginated collection, flattened for a table. `total` lives in `meta`;
 * reading it from the top level yields undefined and kills the pager.
 */
export type PagedFallback<T> = { data: T[]; total: number } & Partial<PagedResult<T>>;

export async function apiList<T>(
  endpoint: string,
  options?: ApiFetchOptions,
  fallbackData?: PagedFallback<T> | (() => Promise<PagedFallback<T>> | PagedFallback<T>),
  mapItem?: (row: any) => T
): Promise<PagedResult<T>> {
  if (!apiConfigured()) {
    // Mock fallbacks predate pagination and supply only rows and a total.
    const fb = await resolveFallback(fallbackData);
    return {
      data: fb?.data ?? [],
      total: fb?.total ?? fb?.data?.length ?? 0,
      page: fb?.page ?? 1,
      limit: fb?.limit ?? fb?.data?.length ?? 0,
      totalPages: fb?.totalPages ?? 1,
    };
  }

  try {
    const body = await request<T[]>(endpoint, options || {}, true);
    const rows = Array.isArray(body?.data) ? body.data : [];
    const meta = body?.meta || {};

    return {
      data: mapItem ? rows.map(mapItem) : (rows as T[]),
      total: meta.total ?? rows.length,
      page: meta.page ?? 1,
      limit: meta.limit ?? rows.length,
      totalPages: meta.totalPages ?? 1,
    };
  } catch (error) {
    if (shouldFallBack(error, fallbackData)) {
      const fb = await resolveFallback(fallbackData);
      return {
        data: fb?.data ?? [],
        total: fb?.total ?? fb?.data?.length ?? 0,
        page: fb?.page ?? 1,
        limit: fb?.limit ?? fb?.data?.length ?? 0,
        totalPages: fb?.totalPages ?? 1,
      };
    }
    throw error;
  }
}

function resolveFallback<T>(fallbackData?: T | (() => Promise<T> | T)): Promise<T> {
  if (typeof fallbackData === "function") {
    return Promise.resolve((fallbackData as () => Promise<T> | T)());
  }
  return Promise.resolve(fallbackData as T);
}


/**
 * Every page of a list, up to a sane ceiling.
 *
 * The API caps `limit` at 200, so a single call cannot cover a table that
 * joins against the whole collection — asking for 500 stock rows returns 200
 * and the other SKUs silently read as zero.
 */
export async function apiListAll<T>(
  endpoint: string,
  mapItem?: (row: any) => T,
  maxPages = 6
): Promise<T[]> {
  const joiner = endpoint.includes("?") ? "&" : "?";
  const out: T[] = [];
  for (let page = 1; page <= maxPages; page += 1) {
    const res = await apiList<T>(
      `${endpoint}${joiner}limit=200&page=${page}`,
      { method: "GET" },
      { data: [], total: 0 },
      mapItem
    );
    out.push(...res.data);
    if (out.length >= res.total || res.data.length === 0) break;
  }
  return out;
}
