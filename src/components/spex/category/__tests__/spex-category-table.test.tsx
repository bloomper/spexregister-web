import {beforeEach, describe, expect, it, vi} from "vitest";
import {screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {SpexCategoryTable} from "@/components/spex/category/spex-category-table.client";
import * as actions from "@/app/(app)/spex/categories/actions.server";
import {audited, pageOf, renderWithQueue, router} from "@/test/table-harness";

vi.mock("next/navigation", () => ({
    useRouter: () => router,
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => "/spex/categories",
}));
vi.mock("@/app/(app)/spex/categories/actions.server", () => ({
    getPageAction: vi.fn(),
    getAction: vi.fn(),
    createAction: vi.fn(),
    updateAction: vi.fn(),
    deleteAction: vi.fn(),
    bulkDeleteAction: vi.fn(),
    exportAction: vi.fn(),
    importAction: vi.fn(),
    uploadLogoAction: vi.fn(),
    deleteLogoAction: vi.fn(),
    getRevisionsAction: vi.fn(),
    getRestorePreviewAction: vi.fn(),
    restoreRevisionAction: vi.fn(),
}));
vi.mock("@/components/data-audit-trail.client", () => ({AuditTrail: () => <div data-testid="audit-trail"/>}));

const rows = [{id: "c1", name: "Chalmersspexet", firstYear: "1948", ...audited}, {id: "c2", name: "Vera", firstYear: "1990", ...audited}] as never[];

beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(actions.getPageAction).mockResolvedValue(pageOf([rows[1]]) as never);
});

describe("SpexCategoryTable", () => {
    it("lists the rows", () => {
        renderWithQueue(<SpexCategoryTable initialData={pageOf(rows)}/>);

        expect(screen.getByText("Chalmersspexet")).toBeInTheDocument();
        expect(screen.getByText("Vera")).toBeInTheDocument();
    });

    it("filters and resets the filter", async () => {
        renderWithQueue(<SpexCategoryTable initialData={pageOf(rows)}/>);

        await userEvent.type(screen.getByPlaceholderText("Spex.Category.filterPlaceholder"), "Ver");

        await waitFor(() => expect(actions.getPageAction).toHaveBeenCalled());
        expect(JSON.stringify(vi.mocked(actions.getPageAction).mock.lastCall)).toContain("Ver");
        await waitFor(() => expect(screen.queryByText("Chalmersspexet")).not.toBeInTheDocument());

        await userEvent.click(screen.getAllByRole("button", {name: /Common.reset/})[0]);

        expect(screen.getByPlaceholderText("Spex.Category.filterPlaceholder")).toHaveValue("");
    });

    it("opens a row's details", async () => {
        renderWithQueue(<SpexCategoryTable initialData={pageOf(rows)}/>);

        await userEvent.click(screen.getByText("Chalmersspexet"));

        expect(await screen.findByRole("dialog")).toBeInTheDocument();
    });

    it("offers bulk actions for the selected rows", async () => {
        renderWithQueue(<SpexCategoryTable initialData={pageOf(rows)}/>);

        await userEvent.click(screen.getAllByRole("checkbox")[1]);

        expect(screen.getAllByRole("button", {name: /\(1\)/}).length).toBeGreaterThan(0);
    });
});
