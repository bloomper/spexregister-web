import {beforeEach, describe, expect, it, vi} from "vitest";
import {screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {NewsTable} from "@/components/news/news-table.client";
import * as actions from "@/app/(app)/news/actions.server";
import {audited, pageOf, renderWithQueue, router} from "@/test/table-harness";

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

const rows = [{id: "n1", subject: "Årsmöte", text: "Välkommen", published: true, visibleFrom: "2026-01-01", visibleTo: null, ...audited}, {id: "n2", subject: "Kalas", text: "Fest", published: false, visibleFrom: null, visibleTo: null, ...audited}] as never[];

beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(actions.getPageAction).mockResolvedValue(pageOf([rows[1]]) as never);
});

describe("NewsTable", () => {
    it("lists the rows", () => {
        renderWithQueue(<NewsTable initialData={pageOf(rows)}/>);

        expect(screen.getByText("Årsmöte")).toBeInTheDocument();
        expect(screen.getByText("Kalas")).toBeInTheDocument();
    });

    it("filters and resets the filter", async () => {
        renderWithQueue(<NewsTable initialData={pageOf(rows)}/>);

        await userEvent.type(screen.getByPlaceholderText("News.filterPlaceholder"), "Kal");

        await waitFor(() => expect(actions.getPageAction).toHaveBeenCalled());
        expect(JSON.stringify(vi.mocked(actions.getPageAction).mock.lastCall)).toContain("Kal");
        await waitFor(() => expect(screen.queryByText("Årsmöte")).not.toBeInTheDocument());

        await userEvent.click(screen.getAllByRole("button", {name: /Common.reset/})[0]);

        expect(screen.getByPlaceholderText("News.filterPlaceholder")).toHaveValue("");
    });

    it("opens a row's details", async () => {
        renderWithQueue(<NewsTable initialData={pageOf(rows)}/>);

        await userEvent.click(screen.getByText("Årsmöte"));

        expect(await screen.findByRole("dialog")).toBeInTheDocument();
    });

    it("offers bulk actions for the selected rows", async () => {
        renderWithQueue(<NewsTable initialData={pageOf(rows)}/>);

        await userEvent.click(screen.getAllByRole("checkbox")[1]);

        expect(screen.getAllByRole("button", {name: /\(1\)/}).length).toBeGreaterThan(0);
    });
});
