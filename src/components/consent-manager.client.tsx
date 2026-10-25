"use client";

import type {ReactNode} from "react";
import {ConsentBanner, ConsentDialog, ConsentProvider} from "c15t/next";
import {useLocaleContext} from "@/app/provider.client";
import {baseTranslations} from "@c15t/translations/all";
import {offline} from "c15t/react";

const messages = {
    en: {
        ...baseTranslations.en,
        common: {
            ...baseTranslations.en.common,
            acknowledge: "Got it",
        },
        cookieBanner: {
            ...baseTranslations.en.cookieBanner,
            noticeTitle: "Cookies on this site",
            noticeDescription: "This site uses only strictly necessary cookies. They keep you signed in and remember your language and display preferences. No cookies are used for analytics, tracking or advertising. Anonymous visitor statistics are collected without cookies.",
        },
    },
    sv: {
        ...baseTranslations.sv,
        common: {
            ...baseTranslations.sv.common,
            acknowledge: "Jag förstår",
        },
        cookieBanner: {
            ...baseTranslations.sv.cookieBanner,
            noticeTitle: "Cookies på den här webbplatsen",
            noticeDescription: "Den här webbplatsen använder endast nödvändiga cookies. De håller dig inloggad och kommer ihåg ditt språk och dina visningsinställningar. Inga cookies används för analys, spårning eller annonsering. Anonym besöksstatistik samlas in utan cookies.",
        },
    },
};

const mode = offline({
    policyRules: [{
        id: "necessary_only",
        match: {isDefault: true, fallback: true},
        model: "opt-out",
        prompt: "notice",
        categories: [],
        scopeMode: "strict",
        i18n: {messageProfile: "preferences"},
    }],
});

/**
 * The cookie banner, in the user's language. Only necessary cookies are used, so it informs rather than asks.
 */
export function ConsentManager({children}: { children: ReactNode }) {
    const {locale} = useLocaleContext();

    return (
        <ConsentProvider
            key={locale}
            options={{
                mode,
                consentCategories: ["necessary"],
                i18n: {
                    locale,
                    detectBrowserLanguage: false,
                    messages,
                },
            }}
        >
            <ConsentBanner hideBranding position="bottom-right"/>
            <ConsentDialog hideBranding/>
            {children}
        </ConsentProvider>
    );
}
