import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {getTranslations} from "next-intl/server";
import {cookies} from "next/headers";
import Provider from "@/app/provider.client";
import {AuthCheck} from "@/components/auth-check.client";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

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
    const store = await cookies();
    const locale = store.get('locale')?.value || 'sv';
    const messages = (await import(`../../messages/${locale}.json`)).default;

    return (
        <html lang={locale} suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider locale={locale} messages={messages}>
            <AuthCheck>
                {children}
            </AuthCheck>
        </Provider>
        </body>
        </html>
    );
}
