import {Search} from "lucide-react";

import {Label} from "@/components/ui/label";
import {SidebarInput} from "@/components/ui/sidebar";
import {useTranslations} from "next-intl";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";

export function SpexareSearchForm({...props}: React.ComponentProps<"form">) {
    const t = useTranslations();
    const router = useRouter();
    const searchParams = useSearchParams();
    const q = searchParams.get("q") || "";
    const [query, setQuery] = useState(q);

    useEffect(() => {
        setQuery(q);
    }, [q]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/spexare/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <form {...props} onSubmit={handleSubmit}>
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
    )
}
