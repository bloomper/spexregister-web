import {beforeEach, describe, expect, it, vi} from "vitest";
import {render, screen, waitFor, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {PermissionGrants} from "@/components/admin/permission/permission-grants.client";
import * as actions from "@/app/(app)/admin/permissions/actions.server";
import type {PermissionGrant} from "@/lib/permission/permission.server";
import {toast} from "sonner";
import {audited, pageOf, router} from "../../../../../test/table-harness";

const refresh = vi.hoisted(() => vi.fn());

vi.mock("@/app/(app)/admin/permissions/actions.server", () => ({
    bulkDeleteGrantsAction: vi.fn(),
    createGrantAction: vi.fn(),
    deleteGrantAction: vi.fn(),
    getGrantsPageAction: vi.fn(),
    searchSpexareAction: vi.fn(),
    searchUsersAction: vi.fn(),
    updateGrantAction: vi.fn(),
}));
vi.mock("next/navigation", () => ({
    useRouter: () => router,
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => "/admin/permissions",
}));
vi.mock("@/hooks/use-refresh.client", () => ({useRefresh: () => refresh}));
vi.mock("sonner", () => ({toast: {success: vi.fn(), error: vi.fn()}}));

const grants = [
    {
        id: "g1", role: null, permission: "WRITE", scope: "SPEX_PARTICIPANTS", validUntil: null, expired: false,
        user: {id: "u1", email: "ada@example.com", spexare: {id: "x1", firstName: "Ada", lastName: "Lovelace"}},
        spex: {id: "s1", title: "Bacchus", year: "2015"}, spexare: null, ...audited,
    },
    {
        id: "g2", role: "EDITOR", permission: "READ", scope: "SPEXARE", validUntil: "2026-01-01", expired: true,
        user: null, spex: null, spexare: {id: "x2", firstName: "Grace", lastName: "Hopper"}, ...audited,
    },
] as unknown as PermissionGrant[];

const roles = [{id: "EDITOR", label: "Redaktör"}];
const spex = [{id: "s1", label: "Bacchus (2015)"}];

function show() {
    return render(<PermissionGrants initialData={pageOf(grants)} spex={spex} roles={roles}/>);
}

async function choose(label: string, option: string) {
    await userEvent.click(screen.getByRole("combobox", {name: label}));
    await userEvent.click(await screen.findByRole("option", {name: option}));
}

beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(actions.getGrantsPageAction).mockResolvedValue(pageOf([grants[0]]));
    vi.mocked(actions.createGrantAction).mockResolvedValue(undefined as never);
    vi.mocked(actions.updateGrantAction).mockResolvedValue(undefined as never);
    vi.mocked(actions.searchUsersAction).mockResolvedValue([{id: "u9", label: "grace@example.com"}]);
    vi.mocked(actions.searchSpexareAction).mockResolvedValue([{id: "x9", label: "Grace Hopper"}]);
});

describe("PermissionGrants", () => {
    it("lists the grants by grantee, permission, scope and end", () => {
        show();

        expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
        expect(screen.getByText(`roleGrantee:${JSON.stringify({role: "Redaktör"})}`)).toBeInTheDocument();
        expect(screen.getAllByText("permissions.WRITE").length).toBeGreaterThan(0);
        expect(screen.getByText(`scopes.SPEX_PARTICIPANTS_ONE:${JSON.stringify({name: "Bacchus (2015)"})}`)).toBeInTheDocument();
        expect(screen.getByText(`scopes.SPEXARE_ONE:${JSON.stringify({name: "Grace Hopper"})}`)).toBeInTheDocument();
        expect(screen.getByText("noEnd")).toBeInTheDocument();
        expect(screen.getByText("expired")).toBeInTheDocument();
    });

    it("filters by permission and resets", async () => {
        show();

        await userEvent.click(screen.getByRole("button", {name: /^permission/}));
        await userEvent.click(await screen.findByRole("button", {name: "permissions.READ"}));

        await waitFor(() => expect(actions.getGrantsPageAction).toHaveBeenCalled());
        expect(JSON.stringify(vi.mocked(actions.getGrantsPageAction).mock.lastCall)).toContain("permission:WRITE");

        await userEvent.click(await screen.findByRole("button", {name: "permissions.WRITE"}));
        await userEvent.click(await screen.findByRole("button", {name: "permissions.DELETE"}));
        await userEvent.click(await screen.findByRole("button", {name: "permissions.ADMINISTRATION"}));
        await waitFor(() => expect(JSON.stringify(vi.mocked(actions.getGrantsPageAction).mock.lastCall)).toContain("permission:NULL"));

        await userEvent.keyboard("{Escape}");
        await userEvent.click(screen.getAllByRole("button", {name: /reset/})[0]);
        await waitFor(() => expect(screen.queryByRole("button", {name: /reset/})).not.toBeInTheDocument());
    });

    it("grants a role on a spex", async () => {
        show();

        await userEvent.click(screen.getByRole("button", {name: "create"}));
        await choose("granteeType", "granteeTypes.ROLE");
        await choose("role", "Redaktör");
        await choose("scope", "scopes.SPEX");
        await choose("spex", "Bacchus (2015)");
        await userEvent.click(screen.getByRole("button", {name: "save"}));

        await waitFor(() => expect(actions.createGrantAction).toHaveBeenCalledWith(expect.objectContaining({
            granteeType: "ROLE", role: "EDITOR", scope: "SPEX", spexId: "s1", permission: "WRITE",
        })));
        expect(toast.success).toHaveBeenCalledWith("created");
        expect(refresh).toHaveBeenCalled();
    });

    it("grants a user on a spexare found by search", async () => {
        show();

        await userEvent.click(screen.getByRole("button", {name: "create"}));
        await userEvent.click(screen.getByRole("combobox", {name: "user"}));
        await userEvent.type(await screen.findByPlaceholderText("searchUser"), "gr");
        await userEvent.click(await screen.findByRole("option", {name: "grace@example.com"}));
        await choose("scope", "scopes.SPEXARE");
        await userEvent.click(screen.getByRole("combobox", {name: "spexare"}));
        await userEvent.type(await screen.findByPlaceholderText("searchSpexare"), "Grace");
        await userEvent.click(await screen.findByRole("option", {name: "Grace Hopper"}));
        await userEvent.click(screen.getByRole("button", {name: "save"}));

        await waitFor(() => expect(actions.createGrantAction).toHaveBeenCalledWith(expect.objectContaining({
            granteeType: "USER", userId: "u9", scope: "SPEXARE", spexareId: "x9",
        })));
        expect(actions.searchUsersAction).toHaveBeenCalled();
        expect(actions.searchSpexareAction).toHaveBeenCalledWith("Grace");
    });

    it("says what a new grant is missing, and when saving fails", async () => {
        show();

        await userEvent.click(screen.getByRole("button", {name: "create"}));
        await userEvent.click(screen.getByRole("button", {name: "save"}));

        expect(await screen.findByText("validation.userRequired")).toBeInTheDocument();
        expect(screen.getByText("validation.spexRequired")).toBeInTheDocument();
        expect(actions.createGrantAction).not.toHaveBeenCalled();

        vi.mocked(actions.createGrantAction).mockRejectedValue(new Error("boom"));
        await choose("granteeType", "granteeTypes.ROLE");
        await choose("role", "Redaktör");
        await choose("spex", "Bacchus (2015)");
        await userEvent.click(screen.getByRole("button", {name: "save"}));
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("error"));
    });

    it("changes the permission of a grant", async () => {
        show();

        await userEvent.click(screen.getByText("Ada Lovelace"));
        const sheet = await screen.findByRole("dialog");

        expect(within(sheet).getByText("Ada Lovelace")).toBeInTheDocument();
        await userEvent.click(within(sheet).getByRole("combobox", {name: "permission"}));
        await userEvent.click(await screen.findByRole("option", {name: "permissions.DELETE"}));
        await userEvent.click(within(sheet).getByRole("button", {name: "save"}));

        await waitFor(() => expect(actions.updateGrantAction).toHaveBeenCalledWith("g1", expect.objectContaining({permission: "DELETE"})));
        expect(toast.success).toHaveBeenCalledWith("updateSuccess");
    });
});
