import {NextRequest} from "next/server";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

const RETRY_COOKIE = "login_retry";
const RETRYABLE_ERRORS = new Set(["state_mismatch"]);

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
