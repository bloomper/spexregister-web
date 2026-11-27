import * as React from "react";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AppSidebar } from "@/components/app-sidebar.client";
import { RolesProvider } from "@/components/roles-provider.client";
import { SiteHeader } from "@/components/site-header.client";
import { getApplications, getMedlemskap } from "@/utils/applications.server";
import { MedlemskapProvider } from "@/components/medlemskap-provider.client";
import { SidebarInset, SidebarProvider } from "@bloomper/fgv-web-ui/ui/sidebar";
import { Button } from "@bloomper/fgv-web-ui/ui/button";
import { Logo } from "@bloomper/fgv-web-ui/shell/logo";
import { LogoText } from "@bloomper/fgv-web-ui/shell/logo-text";
import { ModeToggle } from "@bloomper/fgv-web-ui/shell/toggles";
import { LanguageToggle } from "@bloomper/fgv-web-ui/shell/toggles";
import { requireUser } from "@/utils/auth.server";
import { SSO_CHECKED_COOKIE } from "@/utils/auth";
import { getMine } from "@/lib/spexare";
import { LogoHome } from "@bloomper/fgv-web-ui/shell/logo-home";
import { Role } from "@/types/auth";

export const instant = false;

/**
 * The application's frame: the sidebar by role, the header and the page. Signed out, a landing page with a sign-in
 * button takes the place of every page, which is why this tree cannot prerender a static shell.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { session, roles } = await requireUser();
  const t = await getTranslations();

  if (!session) {
    // Someone logged in to another FGV application gets in without pressing the login button
    if (!(await cookies()).has(SSO_CHECKED_COOKIE)) {
      redirect("/api/auth/login?silent=1");
    }

    return (
      <div className="bg-background flex min-h-dvh flex-col">
        <header className="px-4 py-2">
          <div className="flex w-full flex-nowrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center justify-start gap-3">
              <a
                href="https://www.fgv.nu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-nowrap items-center gap-3"
              >
                <div className="flex aspect-square size-10 items-center justify-center rounded-lg">
                  <Logo />
                </div>
                <div className="min-w-0 overflow-hidden">
                  <LogoText className="text-foreground h-10 w-auto" />
                </div>
              </a>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <LanguageToggle />
              <ModeToggle />
            </div>
          </div>
        </header>

        <main className="flex flex-1 items-center">
          <div className="mx-auto w-full max-w-5xl px-4 py-10">
            <div className="space-y-4 text-center">
              <div className="mx-auto flex justify-center">
                <div className="text-foreground h-20 w-20 sm:h-24 sm:w-24">
                  <LogoHome />
                </div>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">{t("Home.title")}</h1>

              <p className="text-muted-foreground mx-auto mt-3 max-w-prose text-sm">{t("Home.mustBeLoggedIn")}</p>

              <div className="pt-2">
                <Button
                  nativeButton={false}
                  render={<a href="/api/auth/login" />}
                >
                  {t("Common.login")}
                </Button>
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
  const applications = await getApplications();
  const medlemskap = await getMedlemskap();

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <RolesProvider roles={roles}>
        <MedlemskapProvider medlemskap={medlemskap}>
          <SidebarProvider className="flex flex-col">
            <SiteHeader applications={applications} />
            <div className="flex flex-1">
              <Suspense
                fallback={
                  <AppSidebar
                    roles={roles}
                    spexare={undefined}
                    accountUrl={accountUrl}
                  />
                }
              >
                <SidebarWithUser
                  roles={roles}
                  accountUrl={accountUrl}
                />
              </Suspense>
              <SidebarInset className="min-w-0">{children}</SidebarInset>
            </div>
          </SidebarProvider>
        </MedlemskapProvider>
      </RolesProvider>
    </div>
  );
}

async function SidebarWithUser({ roles, accountUrl }: { roles: Role[]; accountUrl: string }) {
  const mySpexare = await getMine();

  return (
    <AppSidebar
      roles={roles}
      spexare={mySpexare}
      accountUrl={accountUrl}
    />
  );
}
