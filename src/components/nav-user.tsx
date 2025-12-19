"use client";

import {ChevronsUpDown, ExternalLink, LogOut, UserCog} from "lucide-react";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar} from "@/components/ui/sidebar";
import * as React from "react";
import {useMemo} from "react";
import {useTranslations} from "next-intl";
import {signOut} from "next-auth/react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

function getInitials(name: string, email: string) {
    const base = (name?.trim() || email?.trim() || "").trim();
    if (!base) {
        return "?";
    }

    const parts = base.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? "";
    const last = (parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1]) ?? "";

    return (first + last).toUpperCase();
}

export function NavUser({
                            user,
                        }: {
    user: {
        name: string
        email: string
        avatar: string
    }
}) {
    const {isMobile} = useSidebar();
    const t = useTranslations();
    const router = useRouter();

    const initials = useMemo(() => getInitials(user.name, user.email), [user.name, user.email]);
    const [avatarFailed, setAvatarFailed] = React.useState(false);
    const avatarSrc = !avatarFailed && user.avatar ? user.avatar : undefined;

    const accountUrl = `${process.env.NEXT_PUBLIC_AUTH_KEYCLOAK_ISSUER}/account`;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={avatarSrc} alt={user.name} onError={() => setAvatarFailed(true)}/>
                                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user.name}</span>
                                <span className="truncate text-xs">{user.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4"/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={avatarSrc} alt={user.name} onError={() => setAvatarFailed(true)}/>
                                    <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{user.name}</span>
                                    <span className="truncate text-xs">{user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <a
                                    href={accountUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex w-full items-center gap-2"
                                >
                                    <UserCog className="size-4" />
                                    <span className="flex-1">{t("Common.myFgvAccount")}</span>
                                    <ExternalLink className="ml-auto size-3 opacity-50" />
                                </a>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem
                            className="flex items-center gap-2"
                            onSelect={async (e) => {
                                e.preventDefault();

                                toast.message(t("Common.loggedOut"));

                                await signOut({redirect: false});
                                router.push("/");
                                router.refresh();
                            }}
                        >
                            <LogOut className="h-4 w-4"/>
                            <span className="whitespace-nowrap">{t("Common.logout")}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
