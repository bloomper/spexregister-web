import {beforeEach, describe, expect, it, vi} from "vitest";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {SpexCategoryGrid} from "@/components/spex/category/spex-category-grid.client";
import {audited, router} from "../../../../../test/table-harness";

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

const rows = [{id: "c1", name: "Chalmersspexet", firstYear: "1948", logoUrl: null, ...audited}, {id: "c2", name: "Vera", firstYear: "1990", logoUrl: null, ...audited}] as never[];

beforeEach(() => {
    vi.clearAllMocks();
});

describe("SpexCategoryGrid", () => {
    it("shows a card per item", () => {
        render(<SpexCategoryGrid initialItems={rows}/>);

        expect(screen.getByText("Chalmersspexet")).toBeInTheDocument();
        expect(screen.getByText("Vera")).toBeInTheDocument();
    });

    it("opens an item's details", async () => {
        render(<SpexCategoryGrid initialItems={rows}/>);

        await userEvent.click(screen.getByText("Chalmersspexet"));

        expect(await screen.findByRole("dialog")).toBeInTheDocument();
    });

    it("offers editing to those who may", async () => {
        const {container} = render(<SpexCategoryGrid initialItems={rows} canUpdate/>);
        const without = render(<SpexCategoryGrid initialItems={rows}/>).container;

        await waitFor(() => expect(container.querySelectorAll("button").length).toBeGreaterThan(without.querySelectorAll("button").length));
    });

    it("shows an empty state", () => {
        render(<SpexCategoryGrid initialItems={[]}/>);

        expect(screen.queryByText("Chalmersspexet")).not.toBeInTheDocument();
    });
});
