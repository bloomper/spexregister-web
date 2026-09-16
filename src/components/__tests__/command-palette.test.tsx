import {beforeEach, describe, expect, it, vi} from "vitest";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {CommandPalette} from "@/components/command-palette.client";
import type {Role} from "@/types/auth";
import type {Spexare} from "@/gql/schema";

const ownSpexare = {id: "1", firstName: "Ada", lastName: "Lovelace"} as unknown as Spexare;

const push = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({push, replace: vi.fn(), refresh: vi.fn()}),
    usePathname: () => "/",
}));

const getMineAction = vi.fn<() => Promise<unknown>>(async () => null);
vi.mock("@/app/(app)/spexare/actions.server", () => ({
    getMineAction: () => getMineAction(),
}));

let roles: Role[] = ["ADMIN"];
vi.mock("@/components/roles-provider.client", () => ({
    useRoles: () => roles,
}));

const openPalette = async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", {name: /CommandPalette.open/}));
    return user;
};

beforeEach(() => {
    push.mockClear();
    getMineAction.mockReset();
    getMineAction.mockResolvedValue(null);
    roles = ["ADMIN"];
});

describe("CommandPalette", () => {
    it("renders a trigger button and opens the dialog on click", async () => {
        render(<CommandPalette/>);
        expect(screen.queryByText("Home.heading")).not.toBeInTheDocument();

        await openPalette();

        expect(await screen.findByText("Home.heading")).toBeInTheDocument();
        expect(screen.getByText("Spexare.heading")).toBeInTheDocument();
    });

    it("opens on Ctrl/Cmd+K", async () => {
        render(<CommandPalette/>);

        await userEvent.keyboard("{Control>}k{/Control}");

        expect(await screen.findByText("Home.heading")).toBeInTheDocument();
    });

    it("navigates to the selected entry and closes", async () => {
        render(<CommandPalette/>);
        const user = await openPalette();

        await user.click(await screen.findByText("Tag.heading"));

        expect(push).toHaveBeenCalledWith("/tags");
        await waitFor(() => expect(screen.queryByText("Home.heading")).not.toBeInTheDocument());
    });

    it("filters entries against the typed query", async () => {
        render(<CommandPalette/>);
        const user = await openPalette();

        await user.type(screen.getByPlaceholderText("CommandPalette.placeholder"), "Tag.");

        expect(screen.getByText("Tag.heading")).toBeInTheDocument();
        expect(screen.queryByText("Home.heading")).not.toBeInTheDocument();
    });

    it("shows an empty state when nothing matches", async () => {
        render(<CommandPalette/>);
        const user = await openPalette();

        // "z" rather than a likelier letter: next-intl is mocked to echo keys, so labels read
        // "Home.heading", "Tag.heading" and so on, and most single letters match one of them.
        await user.type(screen.getByPlaceholderText("CommandPalette.placeholder"), "z");

        await waitFor(() => expect(screen.getByText("CommandPalette.empty")).toBeInTheDocument());
    });

    it("hides admin-only destinations from a plain user", async () => {
        roles = ["USER"];
        render(<CommandPalette/>);
        await openPalette();

        expect(await screen.findByText("Home.heading")).toBeInTheDocument();
        expect(screen.queryByText("User.heading")).not.toBeInTheDocument();
        expect(screen.queryByText("Audit.title")).not.toBeInTheDocument();
        expect(screen.queryByText("Impex.heading")).not.toBeInTheDocument();
        expect(screen.queryByText("Spexare.createHeading")).not.toBeInTheDocument();
    });

    it("offers editor create actions but not admin-only ones", async () => {
        roles = ["EDITOR"];
        render(<CommandPalette/>);
        await openPalette();

        expect(await screen.findByText("Spexare.createHeading")).toBeInTheDocument();
        expect(screen.getByText("Impex.heading")).toBeInTheDocument();
        expect(screen.queryByText("Spex.createHeading")).not.toBeInTheDocument();
        expect(screen.queryByText("User.heading")).not.toBeInTheDocument();
    });

    it("offers a shortcut to the user's own spexare when the account is linked to one", async () => {
        getMineAction.mockResolvedValue(ownSpexare);

        render(<CommandPalette/>);
        const user = await openPalette();

        await user.click(await screen.findByText("Common.myProfile"));

        expect(push).toHaveBeenCalledWith("/my-profile");
    });

    it("omits the shortcut when the account has no linked spexare", async () => {
        getMineAction.mockResolvedValue(null);

        render(<CommandPalette/>);
        await openPalette();

        expect(await screen.findByText("Home.heading")).toBeInTheDocument();
        await waitFor(() => expect(getMineAction).toHaveBeenCalled());
        expect(screen.queryByText("Common.myProfile")).not.toBeInTheDocument();
    });

    it("omits the shortcut while the lookup is still in flight", async () => {
        getMineAction.mockReturnValue(new Promise(() => {
        }));

        render(<CommandPalette/>);
        await openPalette();

        expect(await screen.findByText("Home.heading")).toBeInTheDocument();
        expect(screen.queryByText("Common.myProfile")).not.toBeInTheDocument();
    });

    it("keeps working when the lookup fails", async () => {
        getMineAction.mockRejectedValue(new Error("nope"));

        render(<CommandPalette/>);
        await openPalette();

        expect(await screen.findByText("Home.heading")).toBeInTheDocument();
        expect(screen.queryByText("Common.myProfile")).not.toBeInTheDocument();
    });

    it("looks the user up only once across repeated opens", async () => {
        getMineAction.mockResolvedValue(ownSpexare);

        render(<CommandPalette/>);
        const user = await openPalette();
        await screen.findByText("Common.myProfile");

        await user.keyboard("{Escape}");
        await user.click(screen.getByRole("button", {name: /CommandPalette.open/}));

        await screen.findByText("Common.myProfile");
        expect(getMineAction).toHaveBeenCalledTimes(1);
    });

    it("keeps the shortcut reachable by filtering", async () => {
        getMineAction.mockResolvedValue(ownSpexare);

        render(<CommandPalette/>);
        const user = await openPalette();
        await screen.findByText("Common.myProfile");

        await user.type(screen.getByPlaceholderText("CommandPalette.placeholder"), "myProfile");

        expect(screen.getByText("Common.myProfile")).toBeInTheDocument();
        expect(screen.queryByText("Home.heading")).not.toBeInTheDocument();
    });
});
