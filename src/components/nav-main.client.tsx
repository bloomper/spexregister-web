"use client";

import Link from "next/link";
import {ChevronRight, type LucideIcon} from "lucide-react";

import {Collapsible, CollapsibleContent, CollapsibleTrigger,} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem
} from "@/components/ui/sidebar";
import {usePathname} from "next/navigation";

export function NavMain({
                            items,
                        }: {
    items: {
        title: string
        url: string
        icon: LucideIcon
        isActive?: boolean
        items?: {
            title: string
            url: string
        }[]
    }[]
}) {
    const pathname = usePathname();

    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => {
                    const isInternal = item.url.startsWith("/")
                    const hasSubItems = !!item.items?.length

                    const LinkComponent = isInternal ? Link : "a"
                    const linkProps = isInternal ? {href: item.url} : {href: item.url}

                    return (
                        <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
                            <SidebarMenuItem>
                                {hasSubItems ? (
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip={item.title} asChild>
                                            <LinkComponent {...linkProps}>
                                                <item.icon/>
                                                <span>{item.title}</span>
                                                <ChevronRight
                                                    className="ml-auto transition-transform duration-200 group-data-[state=open]/menu-item:rotate-90"/>
                                            </LinkComponent>
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                ) : (
                                    <SidebarMenuButton tooltip={item.title} asChild>
                                        <LinkComponent {...linkProps}>
                                            <item.icon/>
                                            <span>{item.title}</span>
                                        </LinkComponent>
                                    </SidebarMenuButton>
                                )}

                                {hasSubItems && (
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map((subItem) => {
                                                const isSubInternal = subItem.url.startsWith("/")
                                                const isSubActive = pathname === subItem.url;

                                                return (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton asChild isActive={isSubActive}>
                                                            {isSubInternal ? (
                                                                <Link href={subItem.url}>
                                                                    <span>{subItem.title}</span>
                                                                </Link>
                                                            ) : (
                                                                <a href={subItem.url}>
                                                                    <span>{subItem.title}</span>
                                                                </a>
                                                            )}
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                )
                                            })}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                )}
                            </SidebarMenuItem>
                        </Collapsible>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}