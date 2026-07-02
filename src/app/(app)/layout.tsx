import * as React from "react";
import {Suspense} from "react";
import {getTranslations} from "next-intl/server";
import {AppSidebar} from "@/components/app-sidebar.client";
import {SiteHeader} from "@/components/site-header.client";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {Button} from "@/components/ui/button";
import {Logo} from "@/components/logo";
import {LogoText} from "@/components/logo-text";
import {ModeToggle} from "@/components/mode-toggle.client";
import {LanguageToggle} from "@/components/language-toggle.client";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {me} from "@/lib/user";
import {LogoHome} from "@/components/logo-home";
import Link from "next/link";
import {Role} from "@/types/auth";

export default async function AppLayout({children}: { children: React.ReactNode }) {
    const session = await auth();

    if (session?.error === "RefreshTokenError") {
        redirect("/api/auth/login");
    }

    const roles = session?.roles ?? [];
    const t = await getTranslations();

    if (!session) {
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
                            <div className="mx-auto flex justify-center">
                                <div className="h-20 w-20 text-foreground sm:h-24 sm:w-24">
                                    <LogoHome/>
                                </div>
                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
                                {t("Home.title")}
                            </h1>

                            <p className="mx-auto mt-3 max-w-prose text-sm text-muted-foreground">
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
                    <Suspense fallback={<AppSidebar roles={roles} spexare={undefined}/>}>
                        <SidebarWithUser roles={roles}/>
                    </Suspense>
                    <SidebarInset>
                        {children}
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    );
}

async function SidebarWithUser({roles}: { roles: Role[] }) {
    const currentUser = await me();

    return (
        <AppSidebar
            roles={roles}
            spexare={currentUser?.spexare ?? null}
        />
    );
}
