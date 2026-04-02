"use client";

import * as React from "react";
import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {NextIntlClientProvider} from "next-intl";
import {ThemeProvider} from "@/components/theme-provider.client";
import {ConsentManager} from "@/components/consent-manager.client";
import {useRouter} from "next/navigation";
import {Toaster} from "@/components/ui/sonner.client";
import {SessionProvider} from "next-auth/react";
import type {AbstractIntlMessages} from "use-intl/core";

export default function Provider({
                                     children,
                                     locale: initialLocale,
                                     messages: initialMessages,
                                 }: Readonly<{
    children: React.ReactNode;
    locale: string;
    messages: AbstractIntlMessages;
}>) {
    const router = useRouter();
    const [locale, setLocale] = useState(initialLocale);
    const [messages, setMessages] = useState(initialMessages);

    const changeLocale = useCallback(async (newLocale: string) => {
        document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;

        const newMessages = (await import(`../../messages/${newLocale}.json`)).default;

        setLocale(newLocale);
        setMessages(newMessages);
        router.refresh();
    }, [router]);

    useEffect(() => {
        document.documentElement.lang = locale;
    }, [locale]);

    return (
        <NextIntlClientProvider locale={locale} messages={messages} onError={() => {
        }}>
            <LocaleContext.Provider value={{locale, changeLocale}}>
                <SessionProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <ConsentManager>
                            {children}
                            <Toaster/>
                        </ConsentManager>
                    </ThemeProvider>
                </SessionProvider>
            </LocaleContext.Provider>
        </NextIntlClientProvider>
    );
}

type LocaleContextValue = {
    locale: string;
    changeLocale: (locale: string) => Promise<void>;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export const useLocaleContext = () => {
    const ctx = useContext(LocaleContext);
    if (!ctx) {
        throw new Error("useLocaleContext must be used within <Provider />");
    }
    return ctx;
};
