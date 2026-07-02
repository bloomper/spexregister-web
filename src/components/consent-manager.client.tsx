"use client";

import type {ReactNode} from "react";
import {ConsentManagerDialog, ConsentManagerProvider, CookieBanner} from "@c15t/nextjs";
import {ConsentManagerClient} from "./consent-manager-client.client";
import {useLocaleContext} from "@/app/provider.client";
import {baseTranslations} from "@c15t/translations";


export function ConsentManager({children}: { children: ReactNode }) {
    const {locale} = useLocaleContext();

    return (
        <ConsentManagerProvider
            key={locale}
            options={{
                mode: "offline",
                consentCategories: ["necessary"],
                translations: {
                    defaultLanguage: locale,
                    disableAutoLanguageSwitch: true,
                    translations: baseTranslations,
                },
            }}
        >
            <CookieBanner
                theme={{
                    "banner.root": [
                        "!fixed !bottom-4 !right-1 !left-auto",
                        "!translate-x-0 !inset-x-auto",
                        "!mx-0 !ml-0 !mr-0",
                        "!w-auto !max-w-[28rem]",
                    ].join(" ")
                }}
            />
            <ConsentManagerDialog/>
            <ConsentManagerClient>{children}</ConsentManagerClient>
        </ConsentManagerProvider>
    );
}
