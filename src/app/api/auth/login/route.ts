import {signIn} from "@/auth";
import {NextRequest} from "next/server";
import {normalizeLocale} from "@/utils/utils.server";
import {normalizeTheme} from "@/utils/auth";

export const GET = async (req: NextRequest) => {
    const cookieLocale = req.cookies.get("locale")?.value;
    const locale = normalizeLocale(cookieLocale);

    const cookieTheme = req.cookies.get("theme")?.value;
    const theme = normalizeTheme(cookieTheme);

    return signIn("keycloak", undefined, {
        ui_locales: locale,
        ...(theme ? {theme} : {}),
    });
};
