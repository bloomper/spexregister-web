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
import {useTranslations} from "next-intl";

interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: NavItem[];
}

export function NavMain({items}: { items: NavItem[] }) {
    const pathname = usePathname();

    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => (
                    <NavMainItem key={item.title} item={item} pathname={pathname}/>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

function NavMainItem({item, pathname}: { item: NavItem; pathname: string }) {
    const t = useTranslations();
    const isInternal = item.url.startsWith("/");
    const hasSubItems = !!item.items?.length;
    const LinkComponent = isInternal ? Link : "a";
    const linkProps = {href: item.url};

    const isActive = item.isActive || item.items?.some(sub => pathname === sub.url || sub.items?.some(inner => pathname === inner.url));

    return (
        <Collapsible asChild defaultOpen={isActive} className="group/menu-item">
            <SidebarMenuItem>
                {hasSubItems ? (
                    <div
                        className={`flex items-center rounded-md transition-colors hover:bg-sidebar-accent ${isActive ? "bg-sidebar-accent" : ""}`}>
                        <SidebarMenuButton tooltip={item.title} asChild isActive={isActive}
                                           className="hover:bg-transparent! active:bg-transparent!">
                            <LinkComponent {...linkProps}>
                                {item.icon && <item.icon/>}
                                <span>{item.title}</span>
                            </LinkComponent>
                        </SidebarMenuButton>
                        <CollapsibleTrigger asChild>
                            <button
                                className="mr-1 flex size-7 items-center justify-center rounded-md hover:bg-sidebar-accent-foreground/10 transition-transform group-data-[collapsible=icon]:hidden">
                                <ChevronRight
                                    className="size-4 transition-transform duration-200 group-data-[state=open]/menu-item:rotate-90"/>
                                <span className="sr-only">{t("Common.toggle")}</span>
                            </button>
                        </CollapsibleTrigger>
                    </div>
                ) : (
                    <SidebarMenuButton tooltip={item.title} asChild isActive={pathname === item.url}>
                        <LinkComponent {...linkProps}>
                            {item.icon && <item.icon/>}
                            <span>{item.title}</span>
                        </LinkComponent>
                    </SidebarMenuButton>
                )}

                {hasSubItems && (
                    <CollapsibleContent>
                        <SidebarMenuSub className="mr-0! pr-0!">
                            {item.items?.map((subItem) => (
                                <NavSubItem key={subItem.title} item={subItem} pathname={pathname}/>
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                )}
            </SidebarMenuItem>
        </Collapsible>
    );
}

function NavSubItem({item, pathname}: { item: NavItem; pathname: string }) {
    const t = useTranslations();
    const hasInnerItems = !!item.items?.length;
    const isSubActive = pathname === item.url || item.items?.some(inner => pathname === inner.url);

    if (!hasInnerItems) {
        return (
            <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                        {item.icon && <item.icon className="size-4"/>}
                        <span>{item.title}</span>
                    </Link>
                </SidebarMenuSubButton>
            </SidebarMenuSubItem>
        );
    }

    return (
        <SidebarMenuSubItem>
            <Collapsible defaultOpen={isSubActive} className="group/sub-menu-item">
                <div
                    className={`flex items-center rounded-md transition-colors hover:bg-sidebar-accent ${isSubActive ? "bg-sidebar-accent" : ""}`}>
                    <Link href={item.url}
                          className="flex flex-1 items-center gap-2 px-2 py-1.5 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
                        {item.icon && <item.icon className="size-4"/>}
                        <span className="truncate">{item.title}</span>
                    </Link>
                    <CollapsibleTrigger asChild>
                        <button
                            className="mr-1 flex size-6 items-center justify-center rounded-md hover:bg-sidebar-accent-foreground/10 transition-transform">
                            <ChevronRight
                                className="size-4 transition-transform duration-200 group-data-[state=open]/sub-menu-item:rotate-90"/>
                            <span className="sr-only">{t("Common.toggle")}</span>
                        </button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                    <SidebarMenuSub className="mr-0! pr-0!">
                        {item.items?.map((innerItem) => (
                            <SidebarMenuSubItem key={innerItem.title}>
                                <SidebarMenuSubButton asChild isActive={pathname === innerItem.url}>
                                    <Link href={innerItem.url}>
                                        <span>{innerItem.title}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuSubItem>
    );
}
