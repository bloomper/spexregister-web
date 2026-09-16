import type {ReactNode} from "react";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {render, screen} from "@testing-library/react";
import {NavMain} from "@/components/nav-main.client";
import {SidebarProvider} from "@/components/ui/sidebar";
import {TooltipProvider} from "@/components/ui/tooltip";

let pathname = "/";
vi.mock("next/navigation", () => ({
    usePathname: () => pathname,
}));
vi.mock("next/link", () => ({
    default: ({children, href}: { children?: ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

const items = [
    {
        title: "Spex",
        url: "/spex",
        items: [{title: "Hantera", url: "/spex/manage"}],
    },
];

const tree = () => (
    <TooltipProvider>
        <SidebarProvider>
            <NavMain items={items}/>
        </SidebarProvider>
    </TooltipProvider>
);

const toggle = () => screen.getByRole("button", {name: /Common.toggle/});

beforeEach(() => {
    pathname = "/";
});

describe("NavMain", () => {
    // The open state derives from the pathname. While this was an uncontrolled Collapsible with
    // `defaultOpen`, any client-side navigation changed that default after mount and Base UI
    // warned. jsdom runs in development, so the warning is live here (a production E2E build
    // strips it, which is why this is a unit test).
    it("does not warn about a changing uncontrolled default when navigation changes the active section", () => {
        const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {
        });
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {
        });

        const {rerender} = render(tree());
        pathname = "/spex/manage";
        rerender(tree());

        const messages = [...errorSpy.mock.calls, ...warnSpy.mock.calls]
            .map((call) => call.map(String).join(" "));

        expect(messages.filter((m) => /default open state/i.test(m))).toEqual([]);

        errorSpy.mockRestore();
        warnSpy.mockRestore();
    });

    it("opens the section that navigation makes active", () => {
        const {rerender} = render(tree());
        expect(toggle()).toHaveAttribute("aria-expanded", "false");

        pathname = "/spex/manage";
        rerender(tree());

        expect(toggle()).toHaveAttribute("aria-expanded", "true");
    });

    it("starts open when the section is already active on mount", () => {
        pathname = "/spex/manage";
        render(tree());

        expect(toggle()).toHaveAttribute("aria-expanded", "true");
    });

    it("leaves a section open after navigating away rather than collapsing under the user", () => {
        pathname = "/spex/manage";
        const {rerender} = render(tree());
        expect(toggle()).toHaveAttribute("aria-expanded", "true");

        pathname = "/news";
        rerender(tree());

        expect(toggle()).toHaveAttribute("aria-expanded", "true");
    });
});
