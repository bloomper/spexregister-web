"use client";

import {MenuIcon} from "lucide-react";
import {useTranslations} from "next-intl";
import {SpexareSearchForm} from "@/components/spexare/spexare-search-form.client";
import {Button} from "@/components/ui/button";
import {useSidebar} from "@/components/ui/sidebar";
import {AppSwitcher} from "@/components/app-switcher.client";
import type {Application} from "@/utils/applications";
import {ModeToggle} from "@/components/mode-toggle.client";
import {LanguageToggle} from "@/components/language-toggle.client";
import {useIsClient} from "@/hooks/use-is-client.client";
import {EditQueueButton} from "@/components/edit-queue";
import {CommandPalette} from "@/components/command-palette.client";

export function SiteHeader({applications}: { applications: Application[] }) {
    const isClient = useIsClient();
    const t = useTranslations();

    return (
        <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b print:hidden">
            <div className="flex min-h-(--header-height) w-full items-center gap-2 px-4">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                    <MenuToggle/>
                    <AppSwitcher title={t("Meta.title")} applications={applications}/>
                </div>

                <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                    {isClient ? (
                        <>
                            <SpexareSearchForm className="w-48 md:w-64"/>
                            <CommandPalette/>
                            <EditQueueButton/>
                            <LanguageToggle/>
                            <ModeToggle/>
                        </>
                    ) : (
                        <div className="h-8 w-8 animate-pulse rounded bg-muted"/>
                    )}
                </div>
            </div>
        </header>
    );
}

function MenuToggle() {
    const {toggleSidebar, openMobile} = useSidebar();
    const t = useTranslations("Header");

    return (
        <Button
            className="h-8 w-8 md:hidden"
            variant="ghost"
            size="icon"
            aria-label={t("showMenu")}
            aria-expanded={openMobile}
            onClick={toggleSidebar}
        >
            <MenuIcon/>
        </Button>
    );
}
