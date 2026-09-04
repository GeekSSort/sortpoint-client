import { apiFetch, tokenStore, ApiError, resolveRealm } from "./apiClient";

export interface UserSession {
  id: string;
  /** Flat permission codes, as the server resolved them for this branch. */
  permissions: string[];
  /** The screen this person should land on, and be kept inside. */
  home: "/pos" | "/dashboard";
  /** Full name where there is room for one. */
  name: string;
  /** First name only — for "Welcome, ___". Never an email address. */
  greeting: string;
  email: string;
  avatar: string;
  role: string;
  token?: string;
}

export interface LoginPayload {
  email: string;
  pin?: string;
  password?: string;
}

interface TokenPair {
  access?: string;
  refresh?: string;
}

/**
 * The console and a shop have SEPARATE sign-ins, and a token from one is
 * refused by the other. Which endpoints this page uses is decided by the
 * address it is open on — see `resolveRealm`.
 *
 *   localhost:3500         → console  → /platform/auth/*
 *   rahman.localhost:3500  → Rahman's → /auth/*
 */
const ROUTES = {
  tenant: { login: "/auth/login", me: "/auth/me", logout: "/auth/logout" },
  platform: {
    login: "/platform/auth/login",
    me: "/platform/auth/me",
    logout: "/platform/auth/logout",
  },
} as const;

interface MeResponse {
  id?: string;
  email?: string;
  fullName?: string;
  roles?: string[];
  activeBranch?: { id?: string } | null;
  organization?: { id?: string; name?: string } | null;
  permissions?: string[];
}

/**
 * Where this account belongs.
 *
 * Decided by PERMISSION, not by role name: a shop can rename "Cashier" to
 * anything, and the back office is gated on `dashboard.view` server-side
 * anyway. Somebody without it has no business on those screens — every panel
 * would come back empty or refused.
 */
export function homeFor(permissions: string[] | undefined): "/pos" | "/dashboard" {
  return permissions?.includes("dashboard.view") ? "/dashboard" : "/pos";
}

/**
 * What to call somebody in a greeting.
 *
 * Never the raw email address. "Welcome, owner@nusrat.test" reads like a
 * system message, not a greeting, and it puts an address on screen in an office
 * where other people can see it.
 *
 * In order of preference: their own first name, then the company's first word,
 * then the part of the address before the @. An account provisioned without a
 * name — which is every account created by `provision_tenant` without
 * `--owner-name` — falls to the company, so "Nusrat Traders" greets as
 * "Nusrat".
 */
function greetingName(me: MeResponse): string {
  const full = (me.fullName || "").trim();
  if (full) return full.split(/\s+/)[0];

  const company = (me.organization?.name || "").trim();
  if (company) return company.split(/\s+/)[0];

  const local = (me.email || "").split("@")[0];
  if (!local) return "there";
  return local.charAt(0).toUpperCase() + local.slice(1);
}

/** The full name where there is room for one — menus, profile, account lists. */
function displayName(me: MeResponse): string {
  return (me.fullName || "").trim() || greetingName(me);
}

export class AuthService {
  /**
   * Sign in.
   *
   * THROWS when the credentials are wrong. That sounds obvious, but the old
   * version returned a fake "Zayn Malik" session on every failure, so the login
   * page redirected to the dashboard whatever you typed — which is why the app
   * could be entered without an account.
   */
  static async login(payload: LoginPayload): Promise<UserSession> {
    const password = payload.password || payload.pin || "";

    const pair = await apiFetch<TokenPair>(
      ROUTES[resolveRealm()].login,
      {
        method: "POST",
        anonymous: true,
        body: JSON.stringify({ email: payload.email.trim(), password }),
      }
      // No fallback on purpose. A login that cannot reach the server has not
      // succeeded, and pretending otherwise is the bug above.
    );

    if (!pair?.access) {
      throw new ApiError(401, "INVALID_CREDENTIALS", "Email or password is incorrect.");
    }

    tokenStore.set(pair.access, pair.refresh);
    const session = await AuthService.getCurrentUser();
    // The route guard runs on the server and cannot read permissions, so the
    // answer is written where it can see it.
    tokenStore.setScope(session.home === "/pos" ? "pos" : "full");
    return session;
  }

  /** The signed-in user. Throws if the token is missing or rejected. */
  static async getCurrentUser(): Promise<UserSession> {
    const me = await apiFetch<MeResponse>(ROUTES[resolveRealm()].me, { method: "GET" });

    if (!me?.id && !me?.email) {
      throw new ApiError(401, "TOKEN_INVALID", "Your session has ended. Please sign in again.");
    }

    // The server decides which branch you are standing in; remember it so every
    // later request is scoped the same way the token already is.
    if (me.activeBranch?.id) tokenStore.setBranch(me.activeBranch.id);

    return {
      id: me.id || "",
      name: displayName(me),
      greeting: greetingName(me),
      email: me.email || "",
      avatar: "/image.png",
      role: me.roles?.[0] || (resolveRealm() === "platform" ? "Platform staff" : "Staff"),
      token: tokenStore.access() || undefined,
      permissions: me.permissions ?? [],
      home: homeFor(me.permissions),
    };
  }

  static isSignedIn(): boolean {
    return Boolean(tokenStore.access());
  }

  /**
   * Sign out. Clears local state FIRST, so a failure to reach the server still
   * ends the session on this device.
   */
  static async logout(): Promise<void> {
    const refresh = tokenStore.refresh();
    tokenStore.clear();

    if (!refresh) return;
    try {
      await apiFetch<unknown>(ROUTES[resolveRealm()].logout, {
        method: "POST",
        body: JSON.stringify({ refresh }),
      });
    } catch {
      // The tokens are already gone locally; the server-side blacklist is a
      // best effort and must not keep someone signed in on a dead network.
    }
  }

  /** Wording a person can act on, for the login form. */
  static describeError(error: unknown): string {
    if (error instanceof ApiError) {
      switch (error.code) {
        case "INVALID_CREDENTIALS":
          return "Email or password is incorrect.";
        case "ACCOUNT_LOCKED":
          return "Too many attempts. This account is locked for a while.";
        case "ACCOUNT_DISABLED":
          return "This account has been deactivated. Contact your administrator.";
        case "SUBSCRIPTION_INACTIVE":
          return "This company's subscription is not active. Contact support.";
        case "TENANT_MISMATCH":
          return "This account does not belong to this address.";
        case "REALM_MISMATCH":
          return resolveRealm() === "platform"
            ? "That is a shop account. Sign in at your company address instead."
            : "That is a SORTPoint staff account. Use the console sign-in.";
        case "NETWORK_ERROR":
          return "Cannot reach the server. Check it is running and try again.";
        case "THROTTLED":
          return "Too many attempts. Please wait a moment and try again.";
        default:
          return error.message || "Could not sign in. Please try again.";
      }
    }
    return "Could not sign in. Please try again.";
  }
}
