import {beforeEach, describe, expect, it, vi} from "vitest";
import {screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {UserTable} from "@/components/user/user-table.client";
import * as actions from "@/app/(app)/users/actions.server";
import {audited, pageOf, renderWithQueue, router} from "../../../../test/table-harness";

vi.mock("next/navigation", () => ({
    useRouter: () => router,
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => "/users",
}));
vi.mock("@/app/(app)/users/actions.server", () => ({
    getPageAction: vi.fn(),
    getAction: vi.fn(),
    createAction: vi.fn(),
    updateAction: vi.fn(),
    deleteAction: vi.fn(),
    bulkDeleteAction: vi.fn(),
    exportAction: vi.fn(),
    importAction: vi.fn(),
    getAuthoritiesAction: vi.fn(),
    addAuthoritiesAction: vi.fn(),
    removeAuthoritiesAction: vi.fn(),
    getStatesAction: vi.fn(),
    setStateAction: vi.fn(),
    addSpexareAction: vi.fn(),
    removeSpexareAction: vi.fn(),
    searchSpexareAction: vi.fn(),
    getRevisionsAction: vi.fn(),
    getRestorePreviewAction: vi.fn(),
    restoreRevisionAction: vi.fn(),
}));
vi.mock("@/components/data-audit-trail.client", () => ({AuditTrail: () => <div data-testid="audit-trail"/>}));

const rows = [{id: "u1", externalId: "ext-1", email: "ada@example.com", state: {id: "ACTIVE", label: "Aktiv"}, authorities: [{id: "ADMIN", label: "Admin"}], spexare: null, ...audited}, {id: "u2", externalId: "ext-2", email: "grace@example.com", state: null, authorities: [], spexare: {id: "s1", firstName: "Grace", lastName: "Hopper"}, ...audited}] as never[];

beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(actions.getPageAction).mockResolvedValue(pageOf([rows[1]]) as never);
});

describe("UserTable", () => {
    it("lists the rows", () => {
        renderWithQueue(<UserTable initialData={pageOf(rows)} authorities={[{id: "ADMIN", label: "Admin"} as never]} states={[{id: "ACTIVE", label: "Aktiv"} as never]}/>);

        expect(screen.getByText("ada@example.com")).toBeInTheDocument();
        expect(screen.getByText("grace@example.com")).toBeInTheDocument();
    });

    it("filters and resets the filter", async () => {
        renderWithQueue(<UserTable initialData={pageOf(rows)} authorities={[{id: "ADMIN", label: "Admin"} as never]} states={[{id: "ACTIVE", label: "Aktiv"} as never]}/>);

        await userEvent.type(screen.getByPlaceholderText("User.filterPlaceholder"), "gra");

        await waitFor(() => expect(actions.getPageAction).toHaveBeenCalled());
        expect(JSON.stringify(vi.mocked(actions.getPageAction).mock.lastCall)).toContain("gra");
        await waitFor(() => expect(screen.queryByText("ada@example.com")).not.toBeInTheDocument());

        await userEvent.click(screen.getAllByRole("button", {name: /Common.reset/})[0]);

        expect(screen.getByPlaceholderText("User.filterPlaceholder")).toHaveValue("");
    });

    it("opens a row's details", async () => {
        renderWithQueue(<UserTable initialData={pageOf(rows)} authorities={[{id: "ADMIN", label: "Admin"} as never]} states={[{id: "ACTIVE", label: "Aktiv"} as never]}/>);

        await userEvent.click(screen.getByText("ada@example.com"));

        expect(await screen.findByRole("dialog")).toBeInTheDocument();
    });

    it("offers bulk actions for the selected rows", async () => {
        renderWithQueue(<UserTable initialData={pageOf(rows)} authorities={[{id: "ADMIN", label: "Admin"} as never]} states={[{id: "ACTIVE", label: "Aktiv"} as never]}/>);

        await userEvent.click(screen.getAllByRole("checkbox")[1]);

        expect(screen.getAllByRole("button", {name: /\(1\)/}).length).toBeGreaterThan(0);
    });
});
