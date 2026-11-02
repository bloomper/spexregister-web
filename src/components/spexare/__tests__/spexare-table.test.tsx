import {beforeEach, describe, expect, it, vi} from "vitest";
import {screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {SpexareTable} from "@/components/spexare/spexare-table.client";
import * as actions from "@/app/(app)/spexare/actions.server";
import {audited, pageOf, renderWithQueue, router} from "../../../../test/table-harness";

vi.mock("next/navigation", () => ({
    useRouter: () => router,
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => "/spexare",
}));
vi.mock("@/app/(app)/spexare/actions.server", () => ({
    getPageAction: vi.fn(),
    searchAction: vi.fn(),
    getMineAction: vi.fn(),
    createAction: vi.fn(),
    getAction: vi.fn(),
    updateAction: vi.fn(),
    deleteAction: vi.fn(),
    bulkDeleteAction: vi.fn(),
    bulkPreviewAction: vi.fn(),
    bulkApplyAction: vi.fn(),
    exportAction: vi.fn(),
    importAction: vi.fn(),
    addPartnerAction: vi.fn(),
    removePartnerAction: vi.fn(),
    uploadImageAction: vi.fn(),
    deleteImageAction: vi.fn(),
    createAddressAction: vi.fn(),
    updateAddressAction: vi.fn(),
    deleteAddressAction: vi.fn(),
    createConsentAction: vi.fn(),
    updateConsentAction: vi.fn(),
    deleteConsentAction: vi.fn(),
    createMembershipAction: vi.fn(),
    deleteMembershipAction: vi.fn(),
    createTaggingAction: vi.fn(),
    deleteTaggingAction: vi.fn(),
    createToggleAction: vi.fn(),
    updateToggleAction: vi.fn(),
    deleteToggleAction: vi.fn(),
    createActivityAction: vi.fn(),
    deleteActivityAction: vi.fn(),
    createSpexActivityAction: vi.fn(),
    updateSpexActivityAction: vi.fn(),
    deleteSpexActivityAction: vi.fn(),
    createTaskActivityAction: vi.fn(),
    updateTaskActivityAction: vi.fn(),
    deleteTaskActivityAction: vi.fn(),
    createActorAction: vi.fn(),
    updateActorAction: vi.fn(),
    deleteActorAction: vi.fn(),
    getRevisionsAction: vi.fn(),
    getRelatedTypeRevisionsAction: vi.fn(),
    getRestorePreviewAction: vi.fn(),
    restoreRevisionAction: vi.fn(),
}));
vi.mock("@/components/data-audit-trail.client", () => ({AuditTrail: () => <div data-testid="audit-trail"/>}));

const rows = [{id: "x1", firstName: "Ada", lastName: "Lovelace", nickName: "Countess", published: true, imageUrl: null, ...audited}, {id: "x2", firstName: "Grace", lastName: "Hopper", nickName: null, published: false, imageUrl: null, ...audited}] as never[];

beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(actions.getPageAction).mockResolvedValue(pageOf([rows[1]]) as never);
});

describe("SpexareTable", () => {
    it("lists the rows", () => {
        renderWithQueue(<SpexareTable initialData={pageOf(rows)} types={[]} countries={[]} canDelete/>);

        expect(screen.getByText("Lovelace")).toBeInTheDocument();
        expect(screen.getByText("Hopper")).toBeInTheDocument();
    });

    it("filters and resets the filter", async () => {
        renderWithQueue(<SpexareTable initialData={pageOf(rows)} types={[]} countries={[]} canDelete/>);

        await userEvent.type(screen.getByPlaceholderText("Spexare.filterPlaceholder"), "Hop");

        await waitFor(() => expect(actions.getPageAction).toHaveBeenCalled());
        expect(JSON.stringify(vi.mocked(actions.getPageAction).mock.lastCall)).toContain("Hop");
        await waitFor(() => expect(screen.queryByText("Lovelace")).not.toBeInTheDocument());

        await userEvent.click(screen.getAllByRole("button", {name: /Common.reset/})[0]);

        expect(screen.getByPlaceholderText("Spexare.filterPlaceholder")).toHaveValue("");
    });

    it("opens a row's details", async () => {
        renderWithQueue(<SpexareTable initialData={pageOf(rows)} types={[]} countries={[]} canDelete/>);

        await userEvent.click(screen.getByText("Lovelace"));

        expect(await screen.findByRole("dialog")).toBeInTheDocument();
    });

    it("offers bulk actions for the selected rows", async () => {
        renderWithQueue(<SpexareTable initialData={pageOf(rows)} types={[]} countries={[]} canDelete/>);

        await userEvent.click(screen.getAllByRole("checkbox")[1]);

        expect(screen.getAllByRole("button", {name: /\(1\)/}).length).toBeGreaterThan(0);
    });
});
