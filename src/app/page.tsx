import {AppSidebar} from "@/components/app-sidebar"
import {SiteHeader} from "@/components/site-header"
import {SidebarInset, SidebarProvider,} from "@/components/ui/sidebar"
import {auth} from "@/auth";
import {Logo} from "@/components/logo";
import {LogoText} from "@/components/logo-text";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import * as React from "react";
import {getTranslations} from "next-intl/server";
import {ModeToggle} from "@/components/mode-toggle";
import {LanguageToggle} from "@/components/language-toggle";

export default async function HomePage() {
    const session = await auth();
    const t = await getTranslations();

    if (!session || session?.error === "RefreshTokenError") {
        return (
            <div className="min-h-dvh bg-background flex flex-col">
                <header className="px-4 py-2">
                    <div className="flex w-full flex-nowrap items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center justify-start gap-3">
                            <a
                                href="https://www.fgv.nu"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 flex-nowrap"
                            >
                                <div className="flex aspect-square size-10 items-center justify-center rounded-lg">
                                    <Logo/>
                                </div>
                                <div className="min-w-0 overflow-hidden">
                                    <LogoText className="h-10 w-auto text-foreground"/>
                                </div>
                            </a>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                            <LanguageToggle/>
                            <ModeToggle/>
                        </div>
                    </div>
                </header>

                <main className="flex-1 flex items-center">
                    <div className="mx-auto w-full max-w-5xl px-4 py-10">
                        <div className="space-y-4 text-center">
                            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
                                {t("Metadata.title")}
                            </h1>

                            <p className="mx-auto text-balance text-muted-foreground">
                                {t("Home.mustBeLoggedIn")}
                            </p>

                            <div className="pt-2">
                                <Button asChild>
                                    <Link href="/api/auth/login">{t("Common.login")}</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="[--header-height:calc(--spacing(14))]">
            <SidebarProvider className="flex flex-col">
                <SiteHeader/>
                <div className="flex flex-1">
                    <AppSidebar/>
                    <SidebarInset>
                        <div className="flex flex-1 flex-col gap-4 p-4">
                            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                                <div className="bg-muted/50 aspect-video rounded-xl"/>
                                <div className="bg-muted/50 aspect-video rounded-xl"/>
                                <div className="bg-muted/50 aspect-video rounded-xl"/>
                            </div>
                            <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min"/>
                        </div>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    )
}
