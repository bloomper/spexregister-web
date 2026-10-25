import {NextRequest} from "next/server";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

const RETRY_COOKIE = "login_retry";
const RETRYABLE_ERRORS = new Set(["state_mismatch"]);

/**
 * Where Better Auth sends failed sign-ins. A state mismatch, as when signing in from an old tab, is retried once;
 * anything else, or a second failure, goes to `/login-error`.
 */
export const GET = async (req: NextRequest) => {
    const error = req.nextUrl.searchParams.get("error") ?? "unknown";
    const store = await cookies();
    const alreadyRetried = store.has(RETRY_COOKIE);

    if (RETRYABLE_ERRORS.has(error) && !alreadyRetried) {
        store.set(RETRY_COOKIE, "1", {
            httpOnly: true,
            sameSite: "lax",
            secure: req.nextUrl.protocol === "https:",
            path: "/api/auth",
            maxAge: 60,
        });

        redirect("/api/auth/login");
    }

    console.warn("Login failed", {error, alreadyRetried});

    if (alreadyRetried) {
        store.set(RETRY_COOKIE, "", {path: "/api/auth", maxAge: 0});
    }

    redirect("/login-error");
};
