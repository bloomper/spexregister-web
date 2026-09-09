import {type NextRequest, NextResponse} from "next/server";
import {auth} from "@/auth";

const AUTH_BASE_PATH = "/api/auth";
const ACCOUNT_COOKIE = "account_data";

/**
 * Keeps the Keycloak token in the encrypted `account_data` cookie fresh.
 *
 * Better Auth only refreshes when the access token is within five seconds of expiry, so on a
 * normal request this just decrypts a cookie. It runs here rather than in a page because RSC
 * renders cannot write cookies — without this, a token rotated during a plain navigation would
 * be recomputed on every render and never persisted.
 *
 * It never blocks or redirects; authorization stays in `(app)/layout.tsx` and the
 * `withPolicyPage` / `withPolicyAction` / `withPolicyRoute` wrappers.
 */
export async function proxy(request: NextRequest) {
    const response = NextResponse.next();

    // Better Auth owns the cookies on its own routes — sign-in, the OAuth callback and sign-out
    // all rewrite the session and account cookies. Running here too would emit a second,
    // independently-computed `Set-Cookie` set for the same chunked cookie on the same response,
    // with nothing to reconcile the two: sign-out gets partly undone and a callback can end up
    // pairing the new session with the previous user's tokens. `nextCookies()` already persists
    // refreshes that happen inside route handlers and server actions.
    const {pathname} = request.nextUrl;

    if (pathname === AUTH_BASE_PATH || pathname.startsWith(`${AUTH_BASE_PATH}/`)) {
        return response;
    }

    // Prefetches are speculative and fan out widely. Refreshing from them multiplies the number
    // of requests that could hit the refresh window at once, and Keycloak rotates refresh tokens.
    if (request.headers.get("next-router-prefetch") === "1") {
        return response;
    }

    // Nothing to refresh for an anonymous visitor; skipping keeps this off the logged-out paths
    // entirely rather than relying on the catch below.
    const hasAccountCookie = request.cookies
        .getAll()
        .some(({name}) => name.includes(ACCOUNT_COOKIE));

    if (!hasAccountCookie) {
        return response;
    }

    try {
        const {headers} = await auth.api.getAccessToken({
            body: {useAccountCookie: true},
            headers: request.headers,
            returnHeaders: true,
        });

        for (const cookie of headers.getSetCookie()) {
            response.headers.append("set-cookie", cookie);
        }
    } catch {
        // Refresh failed — `getSessionContext()` renders this as logged out on the page itself.
    }

    return response;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|static/).*)"],
};
