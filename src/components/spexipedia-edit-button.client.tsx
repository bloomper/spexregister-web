"use client";

import {useTranslations} from "next-intl";
import {ExternalLink} from "lucide-react";
import {Button} from "@/components/ui/button";

/**
 * A card's link to where its base data is changed: Spexipedia, for Spexipedia's editors. Spexregister keeps a copy only.
 */
export function SpexipediaEditButton({href}: { href: string }) {
    const t = useTranslations();

    return (
        <div className="absolute top-2 right-2 z-20">
            <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full shadow-md opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity backdrop-blur-sm bg-background/80 hover:bg-background"
                render={<a href={href} target="_blank" rel="noopener noreferrer"/>}
                aria-label={t("Spex.editInSpexipedia")}
                title={t("Spex.editInSpexipedia")}
                onClick={(e) => e.stopPropagation()}
            >
                <ExternalLink className="h-4 w-4"/>
            </Button>
        </div>
    );
}
