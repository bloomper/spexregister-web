"use client";

import {SidebarIcon} from "lucide-react";
import {useTranslations} from "next-intl";
import {SearchForm} from "@/components/search-form";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {useSidebar} from "@/components/ui/sidebar";
import {ModeToggle} from "@/components/mode-toggle.client";
import {LanguageToggle} from "@/components/language-toggle.client";
import {useEffect, useState} from "react";

export function SiteHeader() {
    const {toggleSidebar} = useSidebar();
    const [mounted, setMounted] = useState(false);
    const t = useTranslations();

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
            <div
                className="flex min-h-(--header-height) w-full flex-wrap items-center gap-2 px-4 py-2 sm:flex-nowrap sm:py-0">
                <div className="flex flex-1 items-center gap-2 sm:flex-none">
                    <Button
                        className="h-8 w-8"
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                    >
                        <SidebarIcon/>
                    </Button>
                    <Separator orientation="vertical" className="mr-2 h-4"/>
                    <h1 className="text-lg font-semibold whitespace-nowrap">
                        {t('Meta.title')}
                    </h1>
                </div>

                <div className="flex items-center gap-2 sm:order-3">
                    <Separator orientation="vertical" className="hidden h-4 sm:block"/>
                    {mounted ? (
                        <>
                            <LanguageToggle/>
                            <ModeToggle/>
                        </>
                    ) : (
                        <div className="h-8 w-8 animate-pulse rounded bg-muted"/>
                    )}
                </div>

                <div className="mt-1 w-full sm:mt-0 sm:ml-auto sm:w-auto sm:order-2">
                    <SearchForm className="w-full sm:w-64"/>
                </div>
            </div>
        </header>
    );
}
