import {NextRequest} from "next/server";
import {redirect} from "next/navigation";
import {auth} from "@/auth";
import {normalizeLocale} from "@/utils/utils.server";
import {normalizeTheme} from "@/utils/auth";

export const GET = async (req: NextRequest) => {
    const cookieLocale = req.cookies.get("locale")?.value;
    const locale = normalizeLocale(cookieLocale);

    const cookieTheme = req.cookies.get("theme")?.value;
    const theme = normalizeTheme(cookieTheme);

    const {url} = await auth.api.signInSocial({
        body: {
            provider: "keycloak",
            callbackURL: "/",
            additionalParams: {
                ui_locales: locale,
                ...(theme ? {theme} : {}),
            },
        },
    });

    if (!url) {
        throw new Error("Keycloak did not return an authorization URL");
    }

    redirect(url);
};
