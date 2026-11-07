import {beforeEach, describe, expect, it, vi} from "vitest";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {ChangeLogTable} from "@/components/audit/change-log-table.client";
import * as actions from "@/app/(app)/admin/change-log/actions.server";
import {AuditedType, AuditSource, type RevisionDetail, type RevisionFeedEntry} from "@/gql/schema";
import type {RevisionFeedPage} from "@/types/pagination";

vi.mock("@/app/(app)/admin/change-log/actions.server", () => ({
    getRevisionDetailAction: vi.fn(),
    getRevisionFeedPageAction: vi.fn(),
}));
vi.mock("@/components/audit/revision-detail.client", () => ({
    RevisionDetailPanel: ({detail}: { detail: RevisionDetail }) => <div data-testid="detail">{detail.revision}</div>,
}));

const entries = [
    {revision: 12, modifiedAt: "2026-11-01T10:00:00Z", modifiedBy: "editor@example.com", source: AuditSource.Web, types: [AuditedType.Spexare], comment: "Bytt adress"},
    {revision: 11, modifiedAt: "2026-10-31T10:00:00Z", modifiedBy: "system", source: null, types: [AuditedType.Tag], comment: null},
] as unknown as RevisionFeedEntry[];

function pageOf(items: RevisionFeedEntry[], hasNextPage = false): RevisionFeedPage {
    return {
        items,
        edges: items.map((node, i) => ({cursor: `c${i}`, node})),
        pageInfo: {hasNextPage, hasPreviousPage: false, startCursor: "c0", endCursor: `c${items.length - 1}`},
        totalCount: items.length + (hasNextPage ? 1 : 0),
    } as RevisionFeedPage;
}

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
});

describe("ChangeLogTable", () => {
    it("lists the revisions with their origin and comment", () => {
        render(<ChangeLogTable initialData={pageOf(entries)} authors={["editor@example.com"]}/>);

        expect(screen.getByText("editor@example.com")).toBeInTheDocument();
        expect(screen.getByText("Audit.sources.WEB")).toBeInTheDocument();
        expect(screen.getByText("Bytt adress")).toBeInTheDocument();
        expect(screen.getByText(`Audit.matchCount:${JSON.stringify({count: 2})}`)).toBeInTheDocument();
    });

    it("shows an empty state", () => {
        render(<ChangeLogTable initialData={pageOf([])} authors={[]}/>);

        expect(screen.queryByText("editor@example.com")).not.toBeInTheDocument();
        expect(screen.getByText("Common.noDataHeading")).toBeInTheDocument();
        // The count would only repeat the empty state
        expect(screen.queryByText(/^Audit.matchCount:/)).not.toBeInTheDocument();
    });

    it("expands a revision once and folds it again", async () => {
        vi.mocked(actions.getRevisionDetailAction).mockResolvedValue({revision: 12} as RevisionDetail);
        render(<ChangeLogTable initialData={pageOf(entries)} authors={[]}/>);

        await userEvent.click(screen.getAllByRole("button", {name: "Common.details"})[0]);
        expect(await screen.findByTestId("detail")).toHaveTextContent("12");

        await userEvent.click(screen.getAllByRole("button", {name: "Common.details"})[0]);
        expect(screen.queryByTestId("detail")).not.toBeInTheDocument();

        await userEvent.click(screen.getByText("Bytt adress"));
        expect(await screen.findByTestId("detail")).toBeInTheDocument();
        expect(actions.getRevisionDetailAction).toHaveBeenCalledTimes(1);
    });

    it("says when a revision has no detail", async () => {
        vi.mocked(actions.getRevisionDetailAction).mockRejectedValue(new Error("boom"));
        render(<ChangeLogTable initialData={pageOf(entries)} authors={[]}/>);

        await userEvent.click(screen.getAllByRole("button", {name: "Common.details"})[1]);

        expect(await screen.findByText("Common.noDataFound")).toBeInTheDocument();
    });

    it("loads more revisions", async () => {
        vi.mocked(actions.getRevisionFeedPageAction).mockResolvedValue(pageOf([
            {...entries[1], revision: 10, modifiedBy: "older@example.com"} as RevisionFeedEntry,
        ]));
        render(<ChangeLogTable initialData={pageOf(entries, true)} authors={[]}/>);

        await userEvent.click(screen.getByRole("button", {name: "Common.loadMore"}));

        expect(await screen.findByText("older@example.com")).toBeInTheDocument();
        expect(screen.getByText("editor@example.com")).toBeInTheDocument();
        expect(vi.mocked(actions.getRevisionFeedPageAction).mock.lastCall?.[0]).toMatchObject({after: "c1", type: null});
    });

    it("filters by type, author, origin and period, and resets", async () => {
        vi.mocked(actions.getRevisionFeedPageAction).mockResolvedValue(pageOf([entries[0]]));
        render(<ChangeLogTable initialData={pageOf(entries)} authors={["editor@example.com"]}/>);

        await userEvent.click(screen.getByRole("combobox", {name: "Audit.entityType"}));
        await userEvent.click(await screen.findByRole("option", {name: /Spexare/}));
        await waitFor(() => expect(vi.mocked(actions.getRevisionFeedPageAction).mock.lastCall?.[0]).toMatchObject({type: AuditedType.Spexare}));

        await userEvent.click(screen.getByRole("button", {name: /^Common.lastModifiedBy/}));
        await userEvent.click(await screen.findByRole("button", {name: "editor@example.com"}));
        await waitFor(() => expect(vi.mocked(actions.getRevisionFeedPageAction).mock.lastCall?.[0]).toMatchObject({modifiedBy: ["editor@example.com"]}));
        await userEvent.keyboard("{Escape}");

        await userEvent.click(screen.getByRole("button", {name: /^Audit.origin/}));
        await userEvent.click(await screen.findByRole("button", {name: "Audit.sources.IMPORT"}));
        await waitFor(() => expect(vi.mocked(actions.getRevisionFeedPageAction).mock.lastCall?.[0]).toMatchObject({sources: [AuditSource.Import]}));
        await userEvent.keyboard("{Escape}");

        await userEvent.click(screen.getByRole("button", {name: /^Audit.period/}));
        fireEvent.change(await screen.findByLabelText("Audit.from"), {target: {value: "2026-01-01"}});
        fireEvent.change(screen.getByLabelText("Audit.to"), {target: {value: "2026-12-31"}});
        await waitFor(() => expect(vi.mocked(actions.getRevisionFeedPageAction).mock.lastCall?.[0]).toMatchObject({from: "2026-01-01", to: "2026-12-31"}));
        await userEvent.click(screen.getAllByRole("button", {name: "Common.reset"}).at(-1)!);
        await userEvent.keyboard("{Escape}");

        await userEvent.click(screen.getAllByRole("button", {name: /Common.reset/})[0]);
        await waitFor(() => expect(vi.mocked(actions.getRevisionFeedPageAction).mock.lastCall?.[0]).toMatchObject({
            type: null, modifiedBy: [], sources: [], from: null, to: null,
        }));
    });
});
