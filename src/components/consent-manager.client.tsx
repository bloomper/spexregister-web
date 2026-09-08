"use client";

import type {ReactNode} from "react";
import {ConsentBanner, ConsentManagerProvider} from "@c15t/nextjs";
import {useLocaleContext} from "@/app/provider.client";
import {baseTranslations} from "@c15t/translations/all";

const messages = {
    en: {
        ...baseTranslations.en,
        common: {
            ...baseTranslations.en.common,
            acceptAll: "Got it",
        },
        cookieBanner: {
            ...baseTranslations.en.cookieBanner,
            title: "Cookies on this site",
            description: "This site uses only strictly necessary cookies. They keep you signed in and remember your language and display preferences. No cookies are used for analytics, tracking or advertising.",
        },
    },
    sv: {
        ...baseTranslations.sv,
        common: {
            ...baseTranslations.sv.common,
            acceptAll: "Jag förstår",
        },
        cookieBanner: {
            ...baseTranslations.sv.cookieBanner,
            title: "Cookies på den här webbplatsen",
            description: "Den här webbplatsen använder endast nödvändiga cookies. De håller dig inloggad och kommer ihåg ditt språk och dina visningsinställningar. Inga cookies används för analys, spårning eller annonsering.",
        },
    },
};

export function ConsentManager({children}: { children: ReactNode }) {
    const {locale} = useLocaleContext();

    return (
        <ConsentManagerProvider
            key={locale}
            options={{
                mode: "offline",
                consentCategories: ["necessary"],
                i18n: {
                    locale,
                    detectBrowserLanguage: false,
                    messages,
                },
                theme: {
                    slots: {
                        consentBanner: [
                            "!fixed !bottom-4 !right-1 !left-auto",
                            "!translate-x-0 !inset-x-auto",
                            "!mx-0 !ml-0 !mr-0",
                            "!w-auto !max-w-[28rem]",
                        ].join(" "),
                    },
                },
            }}
        >
            <ConsentBanner hideBranding layout={[["accept"]]}/>
            {children}
        </ConsentManagerProvider>
    );
}
