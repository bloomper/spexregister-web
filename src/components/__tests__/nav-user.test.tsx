import type {ReactNode} from "react";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {NavUser} from "@/components/nav-user.client";

const auth = vi.hoisted(() => ({
    session: {user: {name: "Anna Andersson", email: "anna@example.com", image: null as string | null}} as null | {
        user: { name: string; email: string; image: string | null }
    },
    signOut: vi.fn(),
}));
const toast = vi.hoisted(() => ({message: vi.fn()}));
const appendLogoutParams = vi.hoisted(() => vi.fn((url: string) => `${url}?with=params`));

vi.mock("@/lib/auth-client", () => ({useSession: () => ({data: auth.session}), signOut: auth.signOut}));
vi.mock("@/utils/auth", () => ({appendLogoutParams}));
vi.mock("next-themes", () => ({useTheme: () => ({theme: "dark"})}));
vi.mock("sonner", () => ({toast}));
vi.mock("next/link", () => ({
    default: ({children, href, ...props}: { children?: ReactNode; href: string }) => <a href={href} {...props}>{children}</a>,
}));
vi.mock("@/components/ui/sidebar", () => ({
    SidebarMenu: ({children}: { children?: ReactNode }) => <ul>{children}</ul>,
    SidebarMenuItem: ({children}: { children?: ReactNode }) => <li>{children}</li>,
    SidebarMenuButton: (props: object) => <button type="button" {...props}/>,
    useSidebar: () => ({isMobile: false}),
}));

describe("NavUser", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        auth.session = {user: {name: "Anna Andersson", email: "anna@example.com", image: null}};
        // jsdom cannot navigate, and its Location cannot be stubbed: silence its complaint
        vi.spyOn(console, "error").mockImplementation(() => undefined);
    });

    it("shows a placeholder while the user's spexare is loading", () => {
        render(<NavUser spexare={undefined} accountUrl="/account"/>);

        expect(screen.getByRole("button")).toBeDisabled();
        expect(screen.queryByText("Anna Andersson")).not.toBeInTheDocument();
    });

    it("links to the user's own profile when there is a spexare", async () => {
        const {unmount} = render(<NavUser spexare={{id: "1"} as never} accountUrl="/account"/>);

        await userEvent.click(screen.getByRole("button", {name: /Anna Andersson/}));
        expect(await screen.findByRole("menuitem", {name: "Common.myProfile"})).toHaveAttribute("href", "/my-profile");
        unmount();

        render(<NavUser spexare={null} accountUrl="/account"/>);
        await userEvent.click(screen.getByRole("button", {name: /Anna Andersson/}));
        await screen.findByRole("menuitem", {name: "Common.logout"});
        expect(screen.queryByRole("menuitem", {name: "Common.myProfile"})).not.toBeInTheDocument();
    });

    it("shows the user's name, e-mail and initials", () => {
        render(<NavUser spexare={null} accountUrl="https://auth.example.com/account"/>);

        expect(screen.getByText("Anna Andersson")).toBeInTheDocument();
        expect(screen.getByText("anna@example.com")).toBeInTheDocument();
        expect(screen.getByText("AA")).toBeInTheDocument();
    });

    it("falls back to the e-mail for initials and a question mark without either", () => {
        auth.session = {user: {name: "", email: "kalle@example.com", image: null}};
        const {unmount} = render(<NavUser spexare={null} accountUrl="/account"/>);

        expect(screen.getByText("KA")).toBeInTheDocument();
        unmount();

        auth.session = null;
        render(<NavUser spexare={null} accountUrl="/account"/>);
        expect(screen.getByText("?")).toBeInTheDocument();
    });

    it("links to the account and logs out through Keycloak", async () => {
        auth.signOut.mockResolvedValue({data: {url: "https://auth.example.com/logout"}});
        render(<NavUser spexare={null} accountUrl="https://auth.example.com/account"/>);

        await userEvent.click(screen.getByRole("button", {name: /Anna Andersson/}));
        expect(await screen.findByRole("link", {name: /Common.myFgvAccount/})).toHaveAttribute("href", "https://auth.example.com/account");

        await userEvent.click(screen.getByRole("menuitem", {name: "Common.logout"}));

        await waitFor(() => expect(toast.message).toHaveBeenCalledWith("Common.loggedOut"));
        expect(auth.signOut).toHaveBeenCalledWith({disableRedirect: true});
        expect(appendLogoutParams).toHaveBeenCalledWith("https://auth.example.com/logout", "sv", "dark");
    });

    it("goes home when Keycloak gives no logout address", async () => {
        auth.signOut.mockResolvedValue({data: null});
        render(<NavUser spexare={null} accountUrl="/account"/>);

        await userEvent.click(screen.getByRole("button", {name: /Anna Andersson/}));
        await userEvent.click(await screen.findByRole("menuitem", {name: "Common.logout"}));

        await waitFor(() => expect(toast.message).toHaveBeenCalledWith("Common.loggedOut"));
        expect(appendLogoutParams).not.toHaveBeenCalled();
    });
});
