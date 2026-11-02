import {beforeEach, describe, expect, it, vi} from "vitest";
import {screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {SpexTable} from "@/components/spex/spex-table.client";
import * as actions from "@/app/(app)/spex/actions.server";
import {audited, pageOf, renderWithQueue, router} from "../../../../test/table-harness";

vi.mock("next/navigation", () => ({
    useRouter: () => router,
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => "/spex",
}));
vi.mock("@/app/(app)/spex/actions.server", () => ({
    getPageAction: vi.fn(),
    getAllAction: vi.fn(),
    getAction: vi.fn(),
    createAction: vi.fn(),
    updateAction: vi.fn(),
    deleteAction: vi.fn(),
    bulkDeleteAction: vi.fn(),
    exportAction: vi.fn(),
    importAction: vi.fn(),
    getAllCategoriesAction: vi.fn(),
    addCategoryAction: vi.fn(),
    removeCategoryAction: vi.fn(),
    createRevivalAction: vi.fn(),
    deleteRevivalAction: vi.fn(),
    uploadPosterAction: vi.fn(),
    deletePosterAction: vi.fn(),
    getRevisionsAction: vi.fn(),
    getRestorePreviewAction: vi.fn(),
    restoreRevisionAction: vi.fn(),
}));
vi.mock("@/components/data-audit-trail.client", () => ({AuditTrail: () => <div data-testid="audit-trail"/>}));

const rows = [{id: "s1", year: "2015", title: "Bacchus", revival: false, category: {id: "c1", name: "Chalmersspexet"}, posterUrl: null, ...audited}, {id: "s2", year: "1998", title: "Nobel", revival: true, category: null, posterUrl: null, ...audited}] as never[];

beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(actions.getPageAction).mockResolvedValue(pageOf([rows[1]]) as never);
});

describe("SpexTable", () => {
    it("lists the rows", () => {
        renderWithQueue(<SpexTable initialData={pageOf(rows)} categories={[{id: "c1", name: "Chalmersspexet"} as never]} canDelete/>);

        expect(screen.getByText("Bacchus")).toBeInTheDocument();
        expect(screen.getByText("Nobel")).toBeInTheDocument();
    });

    it("filters and resets the filter", async () => {
        renderWithQueue(<SpexTable initialData={pageOf(rows)} categories={[{id: "c1", name: "Chalmersspexet"} as never]} canDelete/>);

        await userEvent.type(screen.getByPlaceholderText("Spex.filterPlaceholder"), "Nob");

        await waitFor(() => expect(actions.getPageAction).toHaveBeenCalled());
        expect(JSON.stringify(vi.mocked(actions.getPageAction).mock.lastCall)).toContain("Nob");
        await waitFor(() => expect(screen.queryByText("Bacchus")).not.toBeInTheDocument());

        await userEvent.click(screen.getAllByRole("button", {name: /Common.reset/})[0]);

        expect(screen.getByPlaceholderText("Spex.filterPlaceholder")).toHaveValue("");
    });

    it("opens a row's details", async () => {
        renderWithQueue(<SpexTable initialData={pageOf(rows)} categories={[{id: "c1", name: "Chalmersspexet"} as never]} canDelete/>);

        await userEvent.click(screen.getByText("Bacchus"));

        expect(await screen.findByRole("dialog")).toBeInTheDocument();
    });

    it("offers bulk actions for the selected rows", async () => {
        renderWithQueue(<SpexTable initialData={pageOf(rows)} categories={[{id: "c1", name: "Chalmersspexet"} as never]} canDelete/>);

        await userEvent.click(screen.getAllByRole("checkbox")[1]);

        expect(screen.getAllByRole("button", {name: /\(1\)/}).length).toBeGreaterThan(0);
    });
});
