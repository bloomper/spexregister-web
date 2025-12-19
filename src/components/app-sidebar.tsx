"use client";

import * as React from "react";
import {BookOpen, Bot, House, LifeBuoy, Send, Settings2, SquareTerminal} from "lucide-react";

import {NavMain} from "@/components/nav-main";
import {NavSecondary} from "@/components/nav-secondary";
import {NavUser} from "@/components/nav-user";
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
import {useSession} from "next-auth/react";
import {Role} from "@/types/auth";
import {AuthUtils} from "@/utils/auth";
import {useMemo} from "react";

function getNavigation(roles: Role[]) {
    const isAdmin = AuthUtils.isAdmin(roles);
    const isAdminOrEditor = AuthUtils.isAdminOrEditor(roles);

    return {
        main: [
            {
                title: "Home",
                url: "/",
                icon: House,
                isActive: false,
            },
            {
                title: "News",
                url: "/news",
                icon: BookOpen,
                isActive: false,
                items: isAdminOrEditor ? [
                    { title: "Manage", url: "/news/manage" },
                    { title: "Create", url: "/news/create" },
                ] : undefined,
            },
            {
                title: "Playground",
                url: "#",
                icon: SquareTerminal,
                isActive: true,
                items: [
                    {
                        title: "History",
                        url: "#",
                    },
                    {
                        title: "Starred",
                        url: "#",
                    },
                    {
                        title: "Settings",
                        url: "#",
                    },
                ],
            },
            {
                title: "Models",
                url: "#",
                icon: Bot,
                items: [
                    {
                        title: "Genesis",
                        url: "#",
                    },
                    {
                        title: "Explorer",
                        url: "#",
                    },
                    {
                        title: "Quantum",
                        url: "#",
                    },
                ],
            },
            {
                title: "Documentation",
                url: "#",
                icon: BookOpen,
                items: [
                    {
                        title: "Introduction",
                        url: "#",
                    },
                    {
                        title: "Get Started",
                        url: "#",
                    },
                    {
                        title: "Tutorials",
                        url: "#",
                    },
                    {
                        title: "Changelog",
                        url: "#",
                    },
                ],
            },
            {
                title: "Settings",
                url: "#",
                icon: Settings2,
                items: [
                    {
                        title: "General",
                        url: "#",
                    },
                    {
                        title: "Team",
                        url: "#",
                    },
                    {
                        title: "Billing",
                        url: "#",
                    },
                    {
                        title: "Limits",
                        url: "#",
                    },
                ],
            },
        ],
        secondary: [
            {
                title: "Support",
                url: "#",
                icon: LifeBuoy,
            },
            {
                title: "Feedback",
                url: "#",
                icon: Send,
            },
        ]
    };
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    roles: Role[];
}

export function AppSidebar({roles, ...props}: AppSidebarProps) {
    const {data: session} = useSession();
    const navigation = useMemo(() => getNavigation(roles), [roles]);

    const user = {
        name: session?.user?.name ?? "",
        email: session?.user?.email ?? "",
        avatar: session?.user?.image ?? "",
    };

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
                <NavMain items={navigation.main}/>
                <NavSecondary items={navigation.secondary} className="mt-auto"/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user}/>
            </SidebarFooter>
        </Sidebar>
    );
}
