"use client"

import * as React from "react"
import {NextIntlClientProvider} from "next-intl";
import {ThemeProvider} from "@/components/theme-provider";

export default function Providers({
                                      children,
                                  }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <NextIntlClientProvider locale={'en'}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
        </NextIntlClientProvider>
    );
}