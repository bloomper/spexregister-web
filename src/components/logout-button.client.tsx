"use client";

import {LogOut} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {useTheme} from "next-themes";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {signOut} from "@/lib/auth-client";
import {appendLogoutParams, normalizeTheme} from "@/utils/auth";

export function LogoutButton({variant = "default"}: { variant?: "default" | "outline" | "ghost" }) {
    const t = useTranslations("Common");
    const locale = useLocale();
    const {theme} = useTheme();

    return (
        <Button
            variant={variant}
            onClick={async () => {
                const {data} = await signOut({disableRedirect: true});

                toast.message(t("loggedOut"));
                window.location.assign(data?.url ? appendLogoutParams(data.url, locale, normalizeTheme(theme)) : "/");
            }}
        >
            <LogOut className="size-4"/>
            {t("logout")}
        </Button>
    );
}
