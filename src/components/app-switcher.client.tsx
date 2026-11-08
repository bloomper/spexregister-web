"use client";

import Link from "next/link";
import {BookUser, Check, ChevronsUpDown, Clapperboard, Drama, Images, Library, type LucideIcon, Music} from "lucide-react";
import {useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import type {Application, ApplicationId} from "@/utils/applications";
import {track} from "@/utils/umami";

const icons: Record<ApplicationId, LucideIcon> = {
    spexregister: BookUser,
    revival: Drama,
    spexflix: Clapperboard,
    spexify: Music,
    spexgram: Images,
    archive: Library,
};

const titleClassName = "truncate text-base font-bold tracking-tight whitespace-nowrap sm:text-lg";

/**
 * The current application's icon on a tile in the brand colour. It is shown only from the width where the sidebar stays
 * open beside the page and the menu button makes way for it.
 */
function AppIcon({applications}: { applications: Application[] }) {
    const Icon = icons[applications.find(application => application.current)?.id ?? "spexregister"];

    return (
        <span
            className="hidden size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground md:flex"
            aria-hidden="true">
            <Icon className="size-4"/>
        </span>
    );
}

/**
 * The application's name in the header. It opens a menu of the FGV applications the user can switch to, and is just
 * the name when there is no other application to offer.
 */
export function AppSwitcher({title, applications}: { title: string; applications: Application[] }) {
    const t = useTranslations();

    if (applications.length < 2) {
        return (
            <p className="flex min-w-0 items-center gap-2">
                <AppIcon applications={applications}/>
                <span className={titleClassName}>{title}</span>
            </p>
        );
    }

    return (
        <p className="-ml-2 flex min-w-0">
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={<Button variant="ghost" className="h-9 min-w-0 max-w-full gap-2 px-2"/>}>
                    <AppIcon applications={applications}/>
                    <span className={titleClassName}>{title}</span>
                    <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true"/>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-72">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>{t("AppSwitcher.heading")}</DropdownMenuLabel>
                        {applications.map(application => {
                            const Icon = icons[application.id];

                            return (
                                <DropdownMenuItem
                                    key={application.id}
                                    className="gap-3"
                                    render={application.current
                                        ? <Link href="/" aria-current="true"/>
                                        : <a href={application.url}/>}
                                    onClick={application.current
                                        ? undefined
                                        : () => track("app-switch", {to: application.id})}
                                >
                                    <Icon className="size-4 shrink-0" aria-hidden="true"/>
                                    <span className="min-w-0 flex-1 truncate">{t(`AppSwitcher.${application.id}`)}</span>
                                    {application.current && <Check className="size-4 shrink-0" aria-hidden="true"/>}
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </p>
    );
}
