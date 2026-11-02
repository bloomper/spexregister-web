import {beforeEach, describe, expect, it, vi} from "vitest";
import {screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {TaskTable} from "@/components/task/task-table.client";
import * as actions from "@/app/(app)/tasks/actions.server";
import {audited, pageOf, renderWithQueue, router} from "../../../../test/table-harness";

vi.mock("next/navigation", () => ({
    useRouter: () => router,
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => "/tasks",
}));
vi.mock("@/app/(app)/tasks/actions.server", () => ({
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
    getRevisionsAction: vi.fn(),
    getRestorePreviewAction: vi.fn(),
    restoreRevisionAction: vi.fn(),
}));
vi.mock("@/components/data-audit-trail.client", () => ({AuditTrail: () => <div data-testid="audit-trail"/>}));

const rows = [{id: "t1", name: "Ljus", category: {id: "c1", name: "Teknik"}, ...audited}, {id: "t2", name: "Ljud", category: null, ...audited}] as never[];

beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(actions.getPageAction).mockResolvedValue(pageOf([rows[1]]) as never);
});

describe("TaskTable", () => {
    it("lists the rows", () => {
        renderWithQueue(<TaskTable initialData={pageOf(rows)} categories={[{id: "c1", name: "Teknik"} as never]} canDelete/>);

        expect(screen.getByText("Ljus")).toBeInTheDocument();
        expect(screen.getByText("Ljud")).toBeInTheDocument();
    });

    it("filters and resets the filter", async () => {
        renderWithQueue(<TaskTable initialData={pageOf(rows)} categories={[{id: "c1", name: "Teknik"} as never]} canDelete/>);

        await userEvent.type(screen.getByPlaceholderText("Task.filterPlaceholder"), "Lju");

        await waitFor(() => expect(actions.getPageAction).toHaveBeenCalled());
        expect(JSON.stringify(vi.mocked(actions.getPageAction).mock.lastCall)).toContain("Lju");
        await waitFor(() => expect(screen.queryByText("Ljus")).not.toBeInTheDocument());

        await userEvent.click(screen.getAllByRole("button", {name: /Common.reset/})[0]);

        expect(screen.getByPlaceholderText("Task.filterPlaceholder")).toHaveValue("");
    });

    it("opens a row's details", async () => {
        renderWithQueue(<TaskTable initialData={pageOf(rows)} categories={[{id: "c1", name: "Teknik"} as never]} canDelete/>);

        await userEvent.click(screen.getByText("Ljus"));

        expect(await screen.findByRole("dialog")).toBeInTheDocument();
    });

    it("offers bulk actions for the selected rows", async () => {
        renderWithQueue(<TaskTable initialData={pageOf(rows)} categories={[{id: "c1", name: "Teknik"} as never]} canDelete/>);

        await userEvent.click(screen.getAllByRole("checkbox")[1]);

        expect(screen.getAllByRole("button", {name: /\(1\)/}).length).toBeGreaterThan(0);
    });
});
