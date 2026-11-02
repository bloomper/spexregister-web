import {beforeEach, describe, expect, it, vi} from "vitest";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {TaskCategoryGrid} from "@/components/task/category/task-category-grid.client";
import {audited, router} from "../../../../../test/table-harness";

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

const rows = [{id: "c1", name: "Teknik", actorPresent: false, ...audited}, {id: "c2", name: "Scen", actorPresent: true, ...audited}] as never[];

beforeEach(() => {
    vi.clearAllMocks();
});

describe("TaskCategoryGrid", () => {
    it("shows a card per item", () => {
        render(<TaskCategoryGrid initialItems={rows}/>);

        expect(screen.getByText("Teknik")).toBeInTheDocument();
        expect(screen.getByText("Scen")).toBeInTheDocument();
    });

    it("opens an item's details", async () => {
        render(<TaskCategoryGrid initialItems={rows}/>);

        await userEvent.click(screen.getByText("Teknik"));

        expect(await screen.findByRole("dialog")).toBeInTheDocument();
    });

    it("offers editing to those who may", async () => {
        const {container} = render(<TaskCategoryGrid initialItems={rows} canUpdate/>);
        const without = render(<TaskCategoryGrid initialItems={rows}/>).container;

        await waitFor(() => expect(container.querySelectorAll("button").length).toBeGreaterThan(without.querySelectorAll("button").length));
    });

    it("shows an empty state", () => {
        render(<TaskCategoryGrid initialItems={[]}/>);

        expect(screen.queryByText("Teknik")).not.toBeInTheDocument();
    });
});
