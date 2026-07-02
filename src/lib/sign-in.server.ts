"use server";

import {signIn as rawSignIn} from "@/auth";
import {cookies} from "next/headers";
import {normalizeLocale} from "@/utils/utils.server";
import {normalizeTheme} from "@/utils/auth";

export const signIn = async () => {
    const cookieStore = await cookies();

    const cookieLocale = cookieStore.get("locale")?.value;
    const locale = normalizeLocale(cookieLocale);

    const cookieTheme = cookieStore.get("theme")?.value;
    const theme = normalizeTheme(cookieTheme);

    return rawSignIn("keycloak", undefined, {
        ui_locales: locale,
        ...(theme ? {theme} : {}),
    });
};
