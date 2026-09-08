"use client";

import * as React from "react"
import Link from "next/link"
import {type LucideIcon} from "lucide-react"
import {usePathname} from "next/navigation"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
                                 items,
                                 ...props
                             }: {
    items: {
        title: string
        url: string
        icon: LucideIcon
    }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
    const pathname = usePathname();

    return (
        <SidebarGroup {...props}>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => {
                        const isInternal = item.url.startsWith("/");
                        const LinkComponent = isInternal ? Link : "a";

                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild size="sm" isActive={pathname === item.url}>
                                    <LinkComponent href={item.url}>
                                        <item.icon/>
                                        <span>{item.title}</span>
                                    </LinkComponent>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
