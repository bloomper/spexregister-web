"use client";

import * as React from "react";
import { useMemo } from "react";
import {
  Drama,
  House,
  ListTodo,
  type LucideIcon,
  Newspaper,
  Settings,
  Tag,
  UserRound,
  Users,
  Wrench,
} from "lucide-react";

import { NavMain, type NavItem } from "@bloomper/fgv-web-ui/shell/nav-main";
import { NavSecondary, SidebarBrand } from "@bloomper/fgv-web-ui/shell/sidebar-parts";
import { NavUser } from "@/components/nav-user.client";
import { Sidebar, SidebarContent, SidebarFooter, useSidebar } from "@bloomper/fgv-web-ui/ui/sidebar";
import { Role } from "@/types/auth";
import { isAdmin, isAdminOrEditor } from "@/utils/auth";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Spexare } from "@/gql/schema";
import { useIsClient } from "@bloomper/fgv-web-ui/hooks/use-is-client";

interface NavSecondaryItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  roles: Role[];
  spexare?: Spexare | null;
  accountUrl: string;
}

export function AppSidebar({ roles, spexare, accountUrl, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const t = useTranslations();
  const isClient = useIsClient();
  const { isMobile, setOpenMobile } = useSidebar();

  const closeOnNavigate = (event: React.MouseEvent) => {
    if (isMobile && (event.target as Element).closest("a")) {
      setOpenMobile(false);
    }
  };

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
        items: isCurrentUserAdminOrEditor
          ? [
              { title: t("Common.manage"), url: "/news/manage" },
              { title: t("Common.create"), url: "/news/create" },
            ]
          : undefined,
      },
      {
        title: t("Spexare.heading"),
        url: "/spexare",
        icon: UserRound,
        isActive: pathname.startsWith("/spexare"),
        items: [
          { title: t("Common.search"), url: "/spexare/search" },
          { title: t("Explore.heading"), url: "/spexare/explore" },
          { title: t("Map.heading"), url: "/spexare/map" },
          { title: t("Analytics.heading"), url: "/spexare/analytics" },
          ...(isCurrentUserAdminOrEditor
            ? [
                { title: t("Common.manage"), url: "/spexare/manage" },
                { title: t("Common.create"), url: "/spexare/create" },
              ]
            : []),
        ],
      },
      {
        title: t("Tag.heading"),
        url: "/tags",
        icon: Tag,
        isActive: pathname.startsWith("/tags"),
        items: isCurrentUserAdminOrEditor
          ? [
              { title: t("Common.manage"), url: "/tags/manage" },
              { title: t("Common.create"), url: "/tags/create" },
            ]
          : undefined,
      },
    ];

    if (isCurrentUserAdmin) {
      mainItems.push({
        title: t("User.heading"),
        icon: Users,
        isActive: pathname.startsWith("/users"),
        items: [
          { title: t("Common.manage"), url: "/users/manage" },
          { title: t("Common.create"), url: "/users/create" },
        ],
      });
    }

    if (isCurrentUserAdminOrEditor) {
      mainItems.push({
        title: t("Impex.heading"),
        icon: ListTodo,
        isActive: pathname.startsWith("/impex"),
        items: [{ title: t("Common.manage"), url: "/impex/manage" }],
      });
    }

    if (isCurrentUserAdmin) {
      mainItems.push({
        title: t("Admin.heading"),
        icon: Settings,
        isActive: pathname.startsWith("/admin"),
        items: [
          { title: t("Admin.maintenance"), url: "/admin/maintenance" },
          { title: t("Audit.title"), url: "/admin/change-log" },
          { title: t("PermissionGrant.heading"), url: "/admin/permissions" },
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
      ],
    };
  }, [roles, pathname, t]);

  return (
    <Sidebar
      collapsible="icon"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarBrand />
      <SidebarContent onClickCapture={closeOnNavigate}>
        {isClient ? (
          <>
            <NavMain items={navigation.main} />
            <NavSecondary
              items={navigation.secondary}
              className="mt-auto"
            />
          </>
        ) : (
          <div className="flex flex-col gap-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-2 py-1.5"
              >
                <div className="bg-sidebar-accent/50 size-4 shrink-0 animate-pulse rounded" />
                <div className="bg-sidebar-accent/50 h-3 w-24 animate-pulse rounded group-data-[collapsible=icon]:hidden" />
              </div>
            ))}
          </div>
        )}
      </SidebarContent>
      <SidebarFooter onClickCapture={closeOnNavigate}>
        {isClient && (
          <NavUser
            spexare={spexare}
            accountUrl={accountUrl}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
