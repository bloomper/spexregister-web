"use client";

import * as React from "react"
import {Moon, Sun} from "lucide-react"
import {useTheme} from "next-themes"

import {Button} from "@/components/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {useTranslations} from "next-intl";

export function ModeToggle() {
    const {setTheme} = useTheme();
    const t = useTranslations();

    if (!setTheme) {
        return null;
    }

    const persistThemeCookie = (value: "light" | "dark" | "system") => {
        document.cookie = `theme=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax`;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                    <Sun
                        className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"/>
                    <Moon
                        className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"/>
                    <span className="sr-only">{t("Header.toggleTheme")}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {
                    setTheme("light");
                    persistThemeCookie("light");
                }}>
                    {t("Common.themeLight")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                    setTheme("dark");
                    persistThemeCookie("dark");
                }}>
                    {t("Common.themeDark")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                    setTheme("system");
                    persistThemeCookie("system");
                }}>
                    {t("Common.themeSystem")}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
