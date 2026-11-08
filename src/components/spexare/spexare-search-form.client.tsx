"use client";

import Link from "next/link";
import {Search} from "lucide-react";

import {Label} from "@/components/ui/label";
import {buttonVariants} from "@/components/ui/button";
import {SidebarInput} from "@/components/ui/sidebar";
import {cn} from "@/utils/utils";
import {useTranslations} from "next-intl";
import {useRouter, useSearchParams} from "next/navigation";
import React, {useState} from "react";

/**
 * The search of the header, going to the spexare search with the text as `q`. On a phone the header has no room for
 * the field next to the application's name, so it is a button to the search page, which has a field of its own.
 */
export function SpexareSearchForm({className, ...props}: React.ComponentProps<"form">) {
    const t = useTranslations();
    const router = useRouter();
    const searchParams = useSearchParams();
    const q = searchParams.get("q") || "";
    const [query, setQuery] = useState(q);
    const [lastQ, setLastQ] = useState(q);

    if (lastQ !== q) {
        setLastQ(q);
        setQuery(q);
    }

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = query.trim();
        const target = trimmed
            ? `/spexare/search?q=${encodeURIComponent(trimmed)}`
            : "/spexare/search";
        router.push(target);
    };

    return (
        <>
            <Link href="/spexare/search" aria-label={t("Common.search")} title={t("Common.search")}
                  className={buttonVariants({variant: "ghost", size: "icon", className: "h-8 w-8 sm:hidden"})}>
                <Search/>
            </Link>
            <form {...props} role="search" className={cn("hidden sm:block", className)} onSubmit={handleSubmit}>
                <div className="relative">
                    <Label htmlFor="search" className="sr-only">
                        {t("Common.search")}
                    </Label>
                    <SidebarInput
                        id="search"
                        placeholder={t("Spexare.searchPlaceholder")}
                        className="h-8 pl-7"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Search
                        className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none"/>
                </div>
            </form>
        </>
    )
}
