"use client";

import {SidebarIcon} from "lucide-react";
import {useTranslations} from "next-intl";
import {SpexareSearchForm} from "@/components/spexare/spexare-search-form.client";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {useSidebar} from "@/components/ui/sidebar";
import {AppSwitcher} from "@/components/app-switcher.client";
import type {Application} from "@/utils/applications";
import {ModeToggle} from "@/components/mode-toggle.client";
import {LanguageToggle} from "@/components/language-toggle.client";
import {useIsClient} from "@/hooks/use-is-client.client";
import {EditQueueButton} from "@/components/edit-queue";
import {CommandPalette} from "@/components/command-palette.client";

export function SiteHeader({applications}: { applications: Application[] }) {
    const {toggleSidebar} = useSidebar();
    const isClient = useIsClient();
    const t = useTranslations();

    return (
        <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
            {/* Phones: the title on its own row, the search and the controls under it. Tablets: the title and the
                controls, the search under them. Wider: all on one row. */}
            <div
                className="flex min-h-(--header-height) w-full flex-wrap items-center gap-2 px-4 py-2 lg:flex-nowrap lg:py-0">
                <div className="flex min-w-0 flex-1 basis-full items-center gap-2 sm:basis-0 lg:flex-none">
                    <Button
                        className="h-8 w-8"
                        variant="ghost"
                        size="icon"
                        aria-label={t("Common.toggleMenu")}
                        onClick={toggleSidebar}
                    >
                        <SidebarIcon/>
                    </Button>
                    <Separator orientation="vertical" className="mr-2 h-4 max-sm:hidden"/>
                    <AppSwitcher title={t("Meta.title")} applications={applications}/>
                </div>

                <div className="order-3 flex shrink-0 items-center gap-1 sm:order-2 sm:gap-2 lg:order-3">
                    <Separator orientation="vertical" className="hidden h-4 lg:block"/>
                    {isClient ? (
                        <>
                            <CommandPalette/>
                            <EditQueueButton/>
                            <LanguageToggle/>
                            <ModeToggle/>
                        </>
                    ) : (
                        <div className="h-8 w-8 animate-pulse rounded bg-muted"/>
                    )}
                </div>

                <div className="order-2 min-w-0 flex-1 sm:order-3 sm:basis-full lg:order-2 lg:ml-auto lg:flex-none lg:basis-auto">
                    <SpexareSearchForm className="w-full lg:w-64"/>
                </div>
            </div>
        </header>
    );
}
