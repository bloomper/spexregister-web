"use client";

import * as React from "react";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {useTranslations} from "next-intl";
import {
    Clapperboard,
    ClipboardList,
    Command as CommandIcon,
    History,
    House,
    ListTodo,
    type LucideIcon,
    Newspaper,
    Plus,
    Shapes,
    Tag,
    UserRound,
    Users
} from "lucide-react";

import {Command, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Dialog, DialogContent, DialogDescription, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useRoles} from "@/components/roles-provider.client";
import {isAdmin, isAdminOrEditor} from "@/utils/auth";
import {getMineAction} from "@/app/(app)/spexare/actions.server";
import {Spexare} from "@/gql/schema";

type PaletteEntry = {
    id: string;
    label: string;
    href: string;
    icon: LucideIcon;
};

const normalize = (value: string) => value.trim().toLowerCase();

export function CommandPalette() {
    const t = useTranslations();
    const router = useRouter();
    const roles = useRoles();

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [spexare, setSpexare] = useState<Spexare | null>(null);
    const requestedRef = useRef(false);

    useEffect(() => {
        if (!open || requestedRef.current) {
            return;
        }
        requestedRef.current = true;

        getMineAction()
            .then((mine) => setSpexare(mine))
            .catch(() => setSpexare(null));
    }, [open]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                setOpen((previous) => !previous);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    const {navigation, actions} = useMemo(() => {
        const canManage = isAdminOrEditor(roles);
        const isCurrentUserAdmin = isAdmin(roles);

        const navigationEntries: PaletteEntry[] = [
            ...(spexare ? [{
                id: "my-profile",
                label: t("Common.myProfile"),
                href: "/my-profile",
                icon: UserRound
            }] : []),
            {id: "home", label: t("Home.heading"), href: "/", icon: House},
            {id: "news", label: t("News.heading"), href: "/news", icon: Newspaper},
            {id: "spexare", label: t("Spexare.heading"), href: "/spexare", icon: UserRound},
            {id: "spex", label: t("Spex.heading"), href: "/spex", icon: Clapperboard},
            {id: "spex-categories", label: t("Spex.Category.heading"), href: "/spex/categories", icon: Shapes},
            {id: "tasks", label: t("Task.heading"), href: "/tasks", icon: ClipboardList},
            {id: "task-categories", label: t("Task.Category.heading"), href: "/tasks/categories", icon: Shapes},
            {id: "tags", label: t("Tag.heading"), href: "/tags", icon: Tag},
        ];

        if (isCurrentUserAdmin) {
            navigationEntries.push(
                {id: "users", label: t("User.heading"), href: "/users/manage", icon: Users},
                {id: "change-log", label: t("Audit.title"), href: "/change-log", icon: History},
            );
        }

        if (canManage) {
            navigationEntries.push({id: "impex", label: t("Impex.heading"), href: "/impex/manage", icon: ListTodo});
        }

        const actionEntries: PaletteEntry[] = [];

        if (canManage) {
            actionEntries.push(
                {id: "create-spexare", label: t("Spexare.createHeading"), href: "/spexare/create", icon: Plus},
                {id: "create-news", label: t("News.createHeading"), href: "/news/create", icon: Plus},
                {id: "create-tag", label: t("Tag.createHeading"), href: "/tags/create", icon: Plus},
            );
        }

        if (isCurrentUserAdmin) {
            actionEntries.push(
                {id: "create-spex", label: t("Spex.createHeading"), href: "/spex/create", icon: Plus},
                {id: "create-task", label: t("Task.createHeading"), href: "/tasks/create", icon: Plus},
                {id: "create-user", label: t("User.createHeading"), href: "/users/create", icon: Plus},
            );
        }

        return {navigation: navigationEntries, actions: actionEntries};
    }, [roles, spexare, t]);

    const term = normalize(query);
    const matching = useCallback(
        (entries: PaletteEntry[]) => (term ? entries.filter((entry) => normalize(entry.label).includes(term)) : entries),
        [term],
    );
    const matchingNavigation = matching(navigation);
    const matchingActions = matching(actions);

    const go = useCallback((href: string) => {
        setOpen(false);
        setQuery("");
        router.push(href);
    }, [router]);

    const hasResults = matchingNavigation.length > 0 || matchingActions.length > 0;

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-2"
                onClick={() => setOpen(true)}
                aria-label={t("CommandPalette.open")}
            >
                <CommandIcon className="h-4 w-4"/>
                <span className="hidden text-xs text-muted-foreground lg:inline">{t("CommandPalette.hint")}</span>
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="overflow-hidden p-0" showCloseButton={false}>
                    <DialogTitle className="sr-only">{t("CommandPalette.title")}</DialogTitle>
                    <DialogDescription className="sr-only">{t("CommandPalette.description")}</DialogDescription>
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder={t("CommandPalette.placeholder")}
                            value={query}
                            onValueChange={setQuery}
                        />
                        <CommandList>
                            {matchingNavigation.length > 0 && (
                                <CommandGroup heading={t("CommandPalette.navigation")}>
                                    {matchingNavigation.map((entry) => (
                                        <CommandItem key={entry.id} value={entry.id} onSelect={() => go(entry.href)}>
                                            <entry.icon/>
                                            <span>{entry.label}</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}

                            {matchingActions.length > 0 && (
                                <CommandGroup heading={t("CommandPalette.create")}>
                                    {matchingActions.map((entry) => (
                                        <CommandItem key={entry.id} value={entry.id} onSelect={() => go(entry.href)}>
                                            <entry.icon/>
                                            <span>{entry.label}</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}

                            {!hasResults && (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                    {t("CommandPalette.empty")}
                                </div>
                            )}
                        </CommandList>
                    </Command>
                </DialogContent>
            </Dialog>
        </>
    );
}
