import * as React from "react";
import {Suspense} from "react";
import {redirect} from "next/navigation";
import {getTranslations} from "next-intl/server";
import {AppSidebar} from "@/components/app-sidebar.client";
import {RolesProvider} from "@/components/roles-provider.client";
import {SiteHeader} from "@/components/site-header.client";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {Button} from "@/components/ui/button";
import {Logo} from "@/components/logo";
import {LogoText} from "@/components/logo-text";
import {ModeToggle} from "@/components/mode-toggle.client";
import {LanguageToggle} from "@/components/language-toggle.client";
import {requireUser} from "@/utils/auth.server";
import {getMine} from "@/lib/spexare";
import {LogoHome} from "@/components/logo-home";
import {Role} from "@/types/auth";

export const instant = false;

/**
 * The application's frame: the sidebar by role, the header and the page. Signed out, a landing page with a sign-in
 * button takes the place of every page, which is why this tree cannot prerender a static shell.
 */
export default async function AppLayout({children}: { children: React.ReactNode }) {
    const {session, roles} = await requireUser();
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
                                <Button nativeButton={false}
                                        render={<a href="/api/auth/login"/>}>{t("Common.login")}</Button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (roles.length === 0) {
        redirect("/no-access");
    }

    const accountUrl = `${(process.env.KEYCLOAK_ISSUER ?? "").replace(/\/$/, "")}/account`;

    return (
        <div className="[--header-height:calc(--spacing(14))]">
            <RolesProvider roles={roles}>
                <SidebarProvider className="flex flex-col">
                    <SiteHeader/>
                    <div className="flex flex-1">
                        <Suspense fallback={<AppSidebar roles={roles} spexare={undefined} accountUrl={accountUrl}/>}>
                            <SidebarWithUser roles={roles} accountUrl={accountUrl}/>
                        </Suspense>
                        <SidebarInset className="min-w-0">
                            {children}
                        </SidebarInset>
                    </div>
                </SidebarProvider>
            </RolesProvider>
        </div>
    );
}

async function SidebarWithUser({roles, accountUrl}: { roles: Role[]; accountUrl: string }) {
    const mySpexare = await getMine();

    return (
        <AppSidebar
            roles={roles}
            spexare={mySpexare}
            accountUrl={accountUrl}
        />
    );
}
