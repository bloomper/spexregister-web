import {beforeEach, describe, expect, it, vi} from "vitest";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {TagGrid} from "@/components/tag/tag-grid.client";
import {audited, router} from "../../../../test/table-harness";

vi.mock("next/navigation", () => ({
    useRouter: () => router,
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => "/tags",
}));
vi.mock("@/app/(app)/tags/actions.server", () => ({
    getPageAction: vi.fn(),
    getAction: vi.fn(),
    createAction: vi.fn(),
    updateAction: vi.fn(),
    deleteAction: vi.fn(),
    bulkDeleteAction: vi.fn(),
    exportAction: vi.fn(),
    importAction: vi.fn(),
    getAllTagsAction: vi.fn(),
    getRevisionsAction: vi.fn(),
    getRestorePreviewAction: vi.fn(),
    restoreRevisionAction: vi.fn(),
}));
vi.mock("@/components/data-audit-trail.client", () => ({AuditTrail: () => <div data-testid="audit-trail"/>}));

const rows = [{id: "t1", name: "Hedersmedlem", ...audited}, {id: "t2", name: "Styrelse", ...audited}] as never[];

beforeEach(() => {
    vi.clearAllMocks();
});

describe("TagGrid", () => {
    it("shows a card per item", () => {
        render(<TagGrid initialItems={rows}/>);

        expect(screen.getByText("Hedersmedlem")).toBeInTheDocument();
        expect(screen.getByText("Styrelse")).toBeInTheDocument();
    });

    it("opens an item's details", async () => {
        render(<TagGrid initialItems={rows}/>);

        await userEvent.click(screen.getByText("Hedersmedlem"));

        expect(await screen.findByRole("dialog")).toBeInTheDocument();
    });

    it("offers editing to those who may", async () => {
        const {container} = render(<TagGrid initialItems={rows} canUpdate/>);
        const without = render(<TagGrid initialItems={rows}/>).container;

        await waitFor(() => expect(container.querySelectorAll("button").length).toBeGreaterThan(without.querySelectorAll("button").length));
    });

    it("shows an empty state", () => {
        render(<TagGrid initialItems={[]}/>);

        expect(screen.queryByText("Hedersmedlem")).not.toBeInTheDocument();
    });
});
