import type {ReactNode} from "react";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {AppSwitcher} from "@/components/app-switcher.client";

const track = vi.hoisted(() => vi.fn());

vi.mock("@/utils/umami", () => ({track}));
vi.mock("next/link", () => ({
    default: ({children, href, ...props}: { children?: ReactNode; href: string }) => <a href={href} {...props}>{children}</a>,
}));

describe("AppSwitcher", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // jsdom cannot navigate: silence its complaint when a link is followed
        vi.spyOn(console, "error").mockImplementation(() => undefined);
    });

    it("is just the title when there is no other application", () => {
        render(<AppSwitcher title="Spexregister" applications={[{id: "spexregister", url: "/", current: true}]}/>);

        expect(screen.getByRole("heading", {level: 1, name: "Spexregister"})).toBeInTheDocument();
        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("lists the applications, links to the others and marks the current one", async () => {
        render(<AppSwitcher title="Spexregister" applications={[
            {id: "spexregister", url: "/", current: true},
            {id: "spexify", url: "https://spexify.example.org", current: false},
        ]}/>);

        await userEvent.click(screen.getByRole("button", {name: "Spexregister"}));

        const current = await screen.findByRole("menuitem", {name: /AppSwitcher.spexregister/});
        expect(current).toHaveAttribute("href", "/");
        expect(current).toHaveAttribute("aria-current", "true");

        const other = screen.getByRole("menuitem", {name: /AppSwitcher.spexify/});
        expect(other).toHaveAttribute("href", "https://spexify.example.org");
        expect(other).not.toHaveAttribute("aria-current");
    });

    it("tracks a switch to another application", async () => {
        render(<AppSwitcher title="Spexregister" applications={[
            {id: "spexregister", url: "/", current: true},
            {id: "revival", url: "https://revival.example.org", current: false},
        ]}/>);

        await userEvent.click(screen.getByRole("button", {name: "Spexregister"}));
        await userEvent.click(await screen.findByRole("menuitem", {name: /AppSwitcher.revival/}));

        expect(track).toHaveBeenCalledWith("app-switch", {to: "revival"});
    });
});
