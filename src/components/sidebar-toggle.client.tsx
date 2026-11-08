"use client";

import {PanelLeftCloseIcon, PanelLeftOpenIcon, XIcon} from "lucide-react";
import {useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";
import {useSidebar} from "@/components/ui/sidebar";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {useIsClient} from "@/hooks/use-is-client.client";

/**
 * Icon button in the sidebar header that collapses or expands the sidebar, or closes it when it opens as a sheet on
 * mobile. On desktop the tooltip names the action and its keyboard shortcut.
 */
export function SidebarToggle() {
    const {toggleSidebar, state, isMobile, setOpenMobile} = useSidebar();
    const isClient = useIsClient();
    const t = useTranslations("Sidebar");

    if (isMobile) {
        return (
            <Button
                className="h-8 w-8 shrink-0"
                variant="ghost"
                size="icon"
                aria-label={t("hideMenu")}
                onClick={() => setOpenMobile(false)}
            >
                <XIcon/>
            </Button>
        );
    }

    const expanded = state === "expanded";
    const label = expanded ? t("hideMenu") : t("showMenu");
    const Icon = expanded ? PanelLeftCloseIcon : PanelLeftOpenIcon;
    const shortcut = isClient && /Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘B" : "Ctrl+B";

    return (
        <Tooltip>
            <TooltipTrigger
                render={
                    <Button
                        className="h-8 w-8 shrink-0"
                        variant="ghost"
                        size="icon"
                        aria-label={label}
                        aria-expanded={expanded}
                        onClick={toggleSidebar}
                    >
                        <Icon/>
                    </Button>
                }
            />
            <TooltipContent side={expanded ? "bottom" : "right"} className="flex items-center gap-2">
                {label}
                <kbd className="rounded border border-background/30 px-1 font-sans text-[10px]">{shortcut}</kbd>
            </TooltipContent>
        </Tooltip>
    );
}
