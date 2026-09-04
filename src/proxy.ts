import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Route guard. Named `proxy.ts` because `middleware.ts` is deprecated in
 * Next 16 — same behaviour, different filename.
 *
 * Runs before the page, so it reads cookies rather than localStorage. It is a
 * signpost, not the security boundary: the API rejects the requests anyway.
 * It stops someone simply typing /dashboard and landing in the app.
 */

const SESSION_COOKIE = "sp_session";
const SCOPE_COOKIE = "sp_scope";

/**
 * Back-office areas. A till-only account is sent to /pos instead. Decided by
 * `dashboard.view` at sign-in and written to a cookie, since this cannot read
 * permissions itself.
 */
const BACK_OFFICE = [
  "/dashboard",
  "/ceo-overview",
  "/customers",
  "/inventory",
  "/purchases",
  "/hrm",
  "/roles-permissions",
  "/settings",
  "/sales-pos",
];

/** Pages a signed-out person may see. Everything else needs a session. */
const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/verify-code",
  "/set-password",
  "/forgot-password",
  "/platform/forgot-password",
  "/accept-invitation",
];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const signedIn = request.cookies.get(SESSION_COOKIE)?.value === "1";

  // Signed in and heading for the login page — send them where they meant to go.
  if (signedIn && isPublic(pathname)) {
    const next = request.nextUrl.searchParams.get("next");
    const home = request.cookies.get(SCOPE_COOKIE)?.value === "pos" ? "/pos" : "/dashboard";
    return NextResponse.redirect(new URL(next || home, request.url));
  }

  if (signedIn) {
    // A till-only account has no back office to go to.
    const posOnly = request.cookies.get(SCOPE_COOKIE)?.value === "pos";
    const wantsBackOffice = BACK_OFFICE.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`)
    );
    if (posOnly && wantsBackOffice) {
      return NextResponse.redirect(new URL("/pos", request.url));
    }
    return NextResponse.next();
  }

  if (isPublic(pathname)) return NextResponse.next();

  // Remember where they were headed, so signing in returns them there rather
  // than dumping everyone on the dashboard.
  const login = new URL("/login", request.url);
  if (pathname !== "/") login.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(login);
}

export const config = {
  /**
   * Everything except Next's own assets and files with an extension. Without a
   * matcher this runs on every request including CSS and images, and the
   * redirect above would stop them loading.
   */
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
