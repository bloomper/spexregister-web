"use client";

import * as React from "react";
import {useMemo} from "react";
import {
    Clapperboard,
    ClipboardList,
    Drama,
    House,
    ListTodo,
    Newspaper,
    Shapes,
    Tag,
    UserRound,
    Users,
    Wrench,
    type LucideIcon
} from "lucide-react";

import {NavMain} from "@/components/nav-main.client";
import {NavSecondary} from "@/components/nav-secondary.client";
import {NavUser} from "@/components/nav-user.client";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";
import {Logo} from "@/components/logo";
import {LogoText} from "@/components/logo-text";
import {Role} from "@/types/auth";
import {isAdmin, isAdminOrEditor} from "@/utils/auth";
import {usePathname} from "next/navigation";
import {useTranslations} from "next-intl";
import {Spexare} from "@/gql/graphql";
import {useIsClient} from "@/hooks/use-is-client";

interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: NavItem[];
}
interface NavSecondaryItem extends Omit<NavItem, "icon"> {
    icon: LucideIcon;
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    roles: Role[];
    spexare?: Spexare | null;
}

export function AppSidebar({roles, spexare, ...props}: AppSidebarProps) {
    const pathname = usePathname();
    const t = useTranslations();
    const isClient = useIsClient();

    const navigation = useMemo((): { main: NavItem[]; secondary: NavSecondaryItem[] } => {
        const isCurrentUserAdmin = isAdmin(roles);
        const isCurrentUserAdminOrEditor = isAdminOrEditor(roles);

        const mainItems: NavItem[] = [
            {
                title: t("Home.heading"),
                url: "/",
                icon: House,
                isActive: pathname === "/",
            },
            {
                title: t("News.heading"),
                url: "/news",
                icon: Newspaper,
                isActive: pathname.startsWith("/news"),
                items: isCurrentUserAdminOrEditor ? [
                    {title: t("Common.manage"), url: "/news/manage"},
                    {title: t("Common.create"), url: "/news/create"},
                ] : undefined,
            },
            {
                title: t("Spexare.heading"),
                url: "/spexare",
                icon: UserRound,
                isActive: pathname.startsWith("/spexare"),
                items: isCurrentUserAdminOrEditor ? [
                    {title: t("Common.manage"), url: "/spexare/manage"},
                    {title: t("Common.create"), url: "/spexare/create"},
                ] : undefined,
            },
            {
                title: t("Spex.heading"),
                url: "/spex",
                icon: Clapperboard,
                isActive: pathname === "/spex" || pathname.startsWith("/spex/"),
                items: isCurrentUserAdmin ? [
                    {title: t("Common.manage"), url: "/spex/manage"},
                    {title: t("Common.create"), url: "/spex/create"},
                    {
                        title: t("Spex.Category.heading"),
                        url: "/spex/categories",
                        icon: Shapes,
                        isActive: pathname.startsWith("/spex/categories"),
                        items: [
                            {title: t("Common.manage"), url: "/spex/categories/manage"},
                            {title: t("Common.create"), url: "/spex/categories/create"},
                        ]
                    },
                ] : [
                    {
                        title: t("Spex.Category.heading"),
                        url: "/spex/categories",
                        icon: Shapes,
                        isActive: pathname.startsWith("/spex/categories"),
                    }
                ],
            },
            {
                title: t("Task.heading"),
                url: "/tasks",
                icon: ClipboardList,
                isActive: pathname.startsWith("/tasks"),
                items: isCurrentUserAdmin ? [
                    {title: t("Common.manage"), url: "/tasks/manage"},
                    {title: t("Common.create"), url: "/tasks/create"},
                    {
                        title: t("Task.Category.heading"),
                        url: "/tasks/categories",
                        icon: Shapes,
                        isActive: pathname.startsWith("/tasks/categories"),
                        items: [
                            {title: t("Common.manage"), url: "/tasks/categories/manage"},
                            {title: t("Common.create"), url: "/tasks/categories/create"},
                        ]
                    },
                ] : [
                    {
                        title: t("Task.Category.heading"),
                        url: "/tasks/categories",
                        icon: Shapes,
                        isActive: pathname.startsWith("/tasks/categories"),
                    }
                ],
            },
            {
                title: t("Tag.heading"),
                url: "/tags",
                icon: Tag,
                isActive: pathname.startsWith("/tags"),
                items: isCurrentUserAdminOrEditor ? [
                    {title: t("Common.manage"), url: "/tags/manage"},
                    {title: t("Common.create"), url: "/tags/create"},
                ] : undefined,
            },
        ];

        if (isCurrentUserAdmin) {
            mainItems.push({
                title: t("User.heading"),
                url: "/users/manage",
                icon: Users,
                isActive: pathname.startsWith("/users"),
                items: [
                    {title: t("Common.manage"), url: "/users/manage"},
                    {title: t("Common.create"), url: "/users/create"},
                ],
            });
        }

        if (isCurrentUserAdminOrEditor) {
            mainItems.push({
                title: t("Impex.heading"),
                url: "/impex/manage",
                icon: ListTodo,
                isActive: pathname.startsWith("/impex"),
                items: [
                    {title: t("Common.manage"), url: "/impex/manage"},
                ],
            });
        }

        return {
            main: mainItems,
            secondary: [
                {
                    title: t("Support.title"),
                    url: "/support",
                    icon: Wrench,
                },
                {
                    title: t("About.title"),
                    url: "/about",
                    icon: Drama,
                },
            ]
        };
    }, [roles, pathname, t]);

    return (
        <Sidebar collapsible="icon"
                 className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
                 {...props}
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a
                                href="https://www.fgv.nu"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 flex-nowrap bg-transparent! hover:bg-transparent! active:bg-transparent! focus:bg-transparent!"
                            >
                                <div className="flex aspect-square size-10 items-center justify-center rounded-lg">
                                    <Logo/>
                                </div>
                                <div className="min-w-0 flex-1 overflow-hidden">
                                    <LogoText className="h-10 w-auto text-foreground"/>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {isClient ? (
                    <>
                        <NavMain items={navigation.main}/>
                        <NavSecondary items={navigation.secondary} className="mt-auto"/>
                    </>
                ) : (
                    <div className="flex flex-col gap-2 p-4">
                        {Array.from({length: 6}).map((_, i) => (
                            <div key={i} className="flex items-center gap-3 px-2 py-1.5">
                                <div className="size-4 shrink-0 animate-pulse rounded bg-sidebar-accent/50"/>
                                <div
                                    className="h-3 w-24 animate-pulse rounded bg-sidebar-accent/50 group-data-[collapsible=icon]:hidden"/>
                            </div>
                        ))}
                    </div>
                )}
            </SidebarContent>
            <SidebarFooter>
                {isClient && <NavUser spexare={spexare}/>}
            </SidebarFooter>
        </Sidebar>
    );
}
