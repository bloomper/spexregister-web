"use client";

import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import {BookOpen, House, LifeBuoy, Send} from "lucide-react";

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
import {useSession} from "next-auth/react";
import {Role} from "@/types/auth";
import {isAdmin, isAdminOrEditor} from "@/utils/auth";
import {usePathname} from "next/navigation";

function getNavigation(roles: Role[], pathname: string) {
    const isCurrentUserAdmin = isAdmin(roles);
    const isCurrentUserAdminOrEditor = isAdminOrEditor(roles);

    return {
        main: [
            {
                title: "Home",
                url: "/",
                icon: House,
                isActive: pathname === "/",
            },
            {
                title: "News",
                url: "/news",
                icon: BookOpen,
                isActive: pathname.startsWith("/news"),
                items: isCurrentUserAdminOrEditor ? [
                    {title: "Manage", url: "/news/manage"},
                    {title: "Create", url: "/news/create"},
                ] : undefined,
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
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const navigation = useMemo(() =>
        getNavigation(roles, pathname), [roles, pathname]);

    useEffect(() => {
        setMounted(true);
    }, []);

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
                {mounted ? (
                    <>
                        <NavMain items={navigation.main}/>
                        <NavSecondary items={navigation.secondary} className="mt-auto"/>
                    </>
                ) : (
                    <div className="flex flex-col gap-4 p-4">
                        <div className="h-8 w-full animate-pulse rounded bg-sidebar-accent/50"/>
                        <div className="h-8 w-full animate-pulse rounded bg-sidebar-accent/50"/>
                    </div>
                )}
            </SidebarContent>
            <SidebarFooter>
                {mounted && <NavUser user={user}/>}
            </SidebarFooter>
        </Sidebar>
    );
}
