import {NextRequest} from "next/server";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {auth} from "@/auth";
import {normalizeLocale} from "@/utils/utils.server";
import {normalizeTheme, SSO_CHECKED_COOKIE} from "@/utils/auth";

/**
 * Starts signing in with Keycloak, showing its pages in the user's language and theme. With `silent=1` it only asks
 * Keycloak whether the user is already logged in to another FGV application (`prompt=none`), and remembers for a
 * minute that it asked, so a visitor without a Keycloak session gets the start page instead of a redirect loop.
 */
export const GET = async (req: NextRequest) => {
    const silent = req.nextUrl.searchParams.get("silent") === "1";

    const cookieLocale = req.cookies.get("locale")?.value;
    const locale = normalizeLocale(cookieLocale);

    const cookieTheme = req.cookies.get("theme")?.value;
    const theme = normalizeTheme(cookieTheme);

    if (silent) {
        (await cookies()).set(SSO_CHECKED_COOKIE, "1", {
            httpOnly: true,
            sameSite: "lax",
            secure: req.nextUrl.protocol === "https:",
            path: "/",
            maxAge: 60,
        });
    }

    const {url} = await auth.api.signInSocial({
        body: {
            provider: "keycloak",
            callbackURL: "/",
            ...(silent ? {errorCallbackURL: "/api/auth/login-error?silent=1"} : {}),
            additionalParams: {
                ui_locales: locale,
                ...(theme ? {theme} : {}),
                ...(silent ? {prompt: "none"} : {}),
            },
        },
    });

    if (!url) {
        throw new Error("Keycloak did not return an authorization URL");
    }

    redirect(url);
};
