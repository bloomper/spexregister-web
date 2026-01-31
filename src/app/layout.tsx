import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {getTranslations} from "next-intl/server";
import {cookies} from "next/headers";
import Provider from "@/app/provider.client";
import {AuthCheck} from "@/components/auth-check.client";
import {Suspense} from "react";
import {normalizeLocale} from "@/utils/utils.server";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

async function RootProvider({children}: { children: React.ReactNode }) {
    const store = await cookies();
    const cookieLocale = store.get('locale')?.value;
    const locale = normalizeLocale(cookieLocale);
    const messages = (await import(`../../messages/${locale}.json`)).default;

    return (
        <Provider locale={locale} messages={messages}>
            <AuthCheck>
                {children}
            </AuthCheck>
        </Provider>
    );
}

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('Meta');

    return {
        title: t('title'),
        description: t('description'),
    };
}

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    const t = await getTranslations();
    const initialHtmlLang = normalizeLocale(undefined);

    return (
        <html lang={initialHtmlLang} suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Suspense fallback={<div className="fixed inset-0 flex items-center justify-center">{t("Common.loading")}</div>}>
            <RootProvider>
                {children}
            </RootProvider>
        </Suspense>
        </body>
        </html>
    );
}
