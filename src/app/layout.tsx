import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {cookies} from "next/headers";
import Provider from "@/app/provider.client";
import React, {Suspense} from "react";
import {normalizeLocale} from "@/utils/utils.server";
import {Spinner} from "@/components/ui/spinner";
import {Umami} from "@/components/umami";
import enMessages from "../../messages/en.json";
import svMessages from "../../messages/sv.json";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

/**
 * Provides the messages of the locale in the `locale` cookie, or of the default locale.
 */
async function RootProvider({children}: { children: React.ReactNode }) {
    const store = await cookies();
    const cookieLocale = store.get("locale")?.value;
    const locale = normalizeLocale(cookieLocale);
    const messages = (await import(`../../messages/${locale}.json`)).default;

    return (
        <Provider locale={locale} messages={messages}>
            {children}
        </Provider>
    );
}

const metaByLocale: Record<string, { title: string; description: string }> = {
    en: enMessages.Meta,
    sv: svMessages.Meta,
};

const defaultLocale = normalizeLocale(undefined);

/**
 * Static, in the default locale, so that no route waits for cookies to render its metadata. The title in the user's
 * language is set in the browser.
 */
export const metadata: Metadata = metaByLocale[defaultLocale] ?? metaByLocale.sv;

/**
 * The document with its fonts, the messages of the user's locale and the Umami tracking script.
 */
export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang={defaultLocale} suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Suspense
            fallback={
                <div className="fixed inset-0 flex items-center justify-center">
                    <Spinner className="size-8"/>
                </div>
            }
        >
            <RootProvider>
                {children}
            </RootProvider>
        </Suspense>
        <Suspense>
            <Umami/>
        </Suspense>
        </body>
        </html>
    );
}
