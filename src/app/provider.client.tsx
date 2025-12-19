"use client";

import * as React from "react";
import {NextIntlClientProvider} from "next-intl";
import {ThemeProvider} from "@/components/theme-provider.client";
import {ConsentManager} from "@/components/consent-manager.client";
import {useRouter} from "next/navigation";
import {Toaster} from "@/components/ui/sonner.client";
import {SessionProvider} from "next-auth/react";

export default function Provider({
                                     children,
                                     locale: initialLocale,
                                     messages: initialMessages,
                                 }: Readonly<{
    children: React.ReactNode;
    locale: string;
    messages: any;
}>) {
    const router = useRouter();
    const [locale, setLocale] = React.useState(initialLocale);
    const [messages, setMessages] = React.useState(initialMessages);

    const changeLocale = React.useCallback(async (newLocale: string) => {
        document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;

        const newMessages = (await import(`../../messages/${newLocale}.json`)).default;

        setLocale(newLocale);
        setMessages(newMessages);
        router.refresh();
    }, [router]);

    React.useEffect(() => {
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

const LocaleContext = React.createContext<{
    locale: string;
    changeLocale: (locale: string) => Promise<void>;
}>({
    locale: 'sv',
    changeLocale: async () => {
    },
})

export const useLocaleContext = () => React.useContext(LocaleContext)