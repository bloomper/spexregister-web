import {beforeEach, describe, expect, it, vi} from "vitest";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {NewsGrid} from "@/components/news/news-grid.client";
import {audited, router} from "@/test/table-harness";

vi.mock("next/navigation", () => ({
    useRouter: () => router,
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => "/news",
}));
vi.mock("@/app/(app)/news/actions.server", () => ({
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

const rows = [{id: "n1", subject: "Årsmöte", text: "Välkomna till årsmötet", published: true, visibleFrom: "2026-01-01", visibleTo: null, ...audited}, {id: "n2", subject: "Kalas", text: "Fest", published: false, visibleFrom: null, visibleTo: null, ...audited}] as never[];

beforeEach(() => {
    vi.clearAllMocks();
});

describe("NewsGrid", () => {
    it("shows a card per item", () => {
        render(<NewsGrid initialItems={rows}/>);

        expect(screen.getByText("Årsmöte")).toBeInTheDocument();
        expect(screen.getByText("Kalas")).toBeInTheDocument();
    });

    it("opens an item's details", async () => {
        render(<NewsGrid initialItems={rows}/>);

        await userEvent.click(screen.getByText("Årsmöte"));

        expect(await screen.findByRole("dialog")).toBeInTheDocument();
    });

    it("offers editing to those who may", async () => {
        const {container} = render(<NewsGrid initialItems={rows} canUpdate/>);
        const without = render(<NewsGrid initialItems={rows}/>).container;

        await waitFor(() => expect(container.querySelectorAll("button").length).toBeGreaterThan(without.querySelectorAll("button").length));
    });

    it("shows an empty state", () => {
        render(<NewsGrid initialItems={[]}/>);

        expect(screen.queryByText("Årsmöte")).not.toBeInTheDocument();
    });
});
