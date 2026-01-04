"use client";

import {useTranslations} from "next-intl";
import {Mail, Wrench} from "lucide-react";
import {useEffect, useState} from "react";

export default function SupportPage() {
    const t = useTranslations("Support");
    const [mounted, setMounted] = useState(false);
    const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL!;

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-var(--header-height))] py-12 px-4">
            <div className="w-full max-w-3xl space-y-16 text-center">

                <section className="space-y-4">
                    <div
                        className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                        <Wrench className="size-10"/>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                        {t("heading")}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t("description")}
                    </p>
                </section>

                <section
                    className="relative overflow-hidden rounded-3xl bg-primary px-8 py-10 text-primary-foreground shadow-xl">
                    <div className="relative z-10 space-y-4">
                        <div
                            className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary-foreground/20">
                            <Mail className="size-6"/>
                        </div>
                        <h2 className="text-2xl font-bold">{t("contact")}</h2>
                        <p className="max-w-md mx-auto opacity-90" suppressHydrationWarning>
                            {t("contactDescription", {email: supportEmail})}
                        </p>
                        {mounted ? (
                            <a
                                href={`mailto:${supportEmail}`}
                                className="inline-flex h-10 items-center justify-center rounded-full bg-primary-foreground px-6 text-sm font-medium text-primary transition-colors hover:bg-primary-foreground/90"
                            >
                                {t("contactAction")}
                            </a>
                        ) : (
                            <div className="h-10 w-48 mx-auto bg-primary-foreground/20 animate-pulse rounded-full"/>
                        )}
                    </div>
                    <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-3xl"/>
                    <div className="absolute -left-10 -bottom-10 size-40 rounded-full bg-black/10 blur-3xl"/>
                </section>
            </div>
        </div>
    );
}