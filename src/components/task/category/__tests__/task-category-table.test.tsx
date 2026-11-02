import {beforeEach, describe, expect, it, vi} from "vitest";
import {screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {TaskCategoryTable} from "@/components/task/category/task-category-table.client";
import * as actions from "@/app/(app)/tasks/categories/actions.server";
import {audited, pageOf, renderWithQueue, router} from "@/test/table-harness";

vi.mock("next/navigation", () => ({
    useRouter: () => router,
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => "/tasks/categories",
}));
vi.mock("@/app/(app)/tasks/categories/actions.server", () => ({
    getPageAction: vi.fn(),
    getAction: vi.fn(),
    createAction: vi.fn(),
    updateAction: vi.fn(),
    deleteAction: vi.fn(),
    bulkDeleteAction: vi.fn(),
    exportAction: vi.fn(),
    importAction: vi.fn(),
    getRevisionsAction: vi.fn(),
    getRestorePreviewAction: vi.fn(),
    restoreRevisionAction: vi.fn(),
}));
vi.mock("@/components/data-audit-trail.client", () => ({AuditTrail: () => <div data-testid="audit-trail"/>}));

const rows = [{id: "c1", name: "Teknik", hasActor: false, ...audited}, {id: "c2", name: "Scen", hasActor: true, ...audited}] as never[];

beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(actions.getPageAction).mockResolvedValue(pageOf([rows[1]]) as never);
});

describe("TaskCategoryTable", () => {
    it("lists the rows", () => {
        renderWithQueue(<TaskCategoryTable initialData={pageOf(rows)}/>);

        expect(screen.getByText("Teknik")).toBeInTheDocument();
        expect(screen.getByText("Scen")).toBeInTheDocument();
    });

    it("filters and resets the filter", async () => {
        renderWithQueue(<TaskCategoryTable initialData={pageOf(rows)}/>);

        await userEvent.type(screen.getByPlaceholderText("Task.Category.filterPlaceholder"), "Sce");

        await waitFor(() => expect(actions.getPageAction).toHaveBeenCalled());
        expect(JSON.stringify(vi.mocked(actions.getPageAction).mock.lastCall)).toContain("Sce");
        await waitFor(() => expect(screen.queryByText("Teknik")).not.toBeInTheDocument());

        await userEvent.click(screen.getAllByRole("button", {name: /Common.reset/})[0]);

        expect(screen.getByPlaceholderText("Task.Category.filterPlaceholder")).toHaveValue("");
    });

    it("opens a row's details", async () => {
        renderWithQueue(<TaskCategoryTable initialData={pageOf(rows)}/>);

        await userEvent.click(screen.getByText("Teknik"));

        expect(await screen.findByRole("dialog")).toBeInTheDocument();
    });

    it("offers bulk actions for the selected rows", async () => {
        renderWithQueue(<TaskCategoryTable initialData={pageOf(rows)}/>);

        await userEvent.click(screen.getAllByRole("checkbox")[1]);

        expect(screen.getAllByRole("button", {name: /\(1\)/}).length).toBeGreaterThan(0);
    });
});
