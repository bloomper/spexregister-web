"use client";

import * as React from "react";
import {Languages} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {SE, US} from "@/components/flags";

import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {useLocaleContext} from "@/app/provider";

type FlagIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const languages: Array<{ code: string; label: string; icon: FlagIcon }> = [
    {code: "sv", label: "Svenska", icon: SE},
    {code: "en", label: "English", icon: US},
]

export function LanguageToggle() {
    const currentLocale = useLocale();
    const t = useTranslations("Header");
    const {changeLocale} = useLocaleContext();

    const currentLanguage = languages.find((l) => l.code === currentLocale);
    const FlagIcon = currentLanguage?.icon;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                    {FlagIcon ? (
                        <FlagIcon
                            className="h-[1.2rem] w-[1.2rem] rounded-[2px]"
                            aria-hidden="true"
                            focusable="false"
                        />
                    ) : (
                        <Languages className="h-[1.2rem] w-[1.2rem]"/>
                    )}
                    <span className="sr-only">{t("toggleLanguage")}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((language) => {
                    const Icon = language.icon;

                    return (
                        <DropdownMenuItem
                            key={language.code}
                            onClick={() => changeLocale(language.code)}
                            className={currentLocale === language.code ? "bg-accent" : ""}
                        >
                            <Icon className="mr-2 h-4 w-4 rounded-[2px]" aria-hidden="true"/>
                            <span>{language.label}</span>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}