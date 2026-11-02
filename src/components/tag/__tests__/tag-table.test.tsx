import {beforeEach, describe, expect, it, vi} from "vitest";
import {screen, waitFor, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {TagTable} from "@/components/tag/tag-table.client";
import * as actions from "@/app/(app)/tags/actions.server";
import type {Tag} from "@/gql/schema";
import {audited, pageOf, renderWithQueue, router} from "@/test/table-harness";

vi.mock("next/navigation", () => ({
    useRouter: () => router,
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => "/tags/manage",
}));
vi.mock("@/app/(app)/tags/actions.server", () => ({
    bulkDeleteAction: vi.fn(),
    deleteAction: vi.fn(),
    exportAction: vi.fn(),
    getAction: vi.fn(),
    getPageAction: vi.fn(),
    getRestorePreviewAction: vi.fn(),
    getRevisionsAction: vi.fn(),
    importAction: vi.fn(),
    restoreRevisionAction: vi.fn(),
    createAction: vi.fn(),
    updateAction: vi.fn(),
}));
vi.mock("@/components/data-audit-trail.client", () => ({AuditTrail: () => <div data-testid="audit-trail"/>}));

const tags = [
    {id: "t1", name: "Hedersmedlem", ...audited},
    {id: "t2", name: "Styrelse", ...audited},
] as unknown as Tag[];

beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(actions.getPageAction).mockResolvedValue(pageOf([tags[1]]) as never);
});

describe("TagTable", () => {
    it("lists the tags", () => {
        renderWithQueue(<TagTable initialData={pageOf(tags)}/>);

        expect(screen.getByText("Hedersmedlem")).toBeInTheDocument();
        expect(screen.getByText("Styrelse")).toBeInTheDocument();
    });

    it("filters by name and resets the filter", async () => {
        renderWithQueue(<TagTable initialData={pageOf(tags)}/>);

        await userEvent.type(screen.getByPlaceholderText("Tag.filterPlaceholder"), "Sty");

        await waitFor(() => expect(actions.getPageAction).toHaveBeenCalled());
        expect(JSON.stringify(vi.mocked(actions.getPageAction).mock.lastCall)).toContain("Sty");
        await waitFor(() => expect(screen.queryByText("Hedersmedlem")).not.toBeInTheDocument());

        await userEvent.click(screen.getByRole("button", {name: /Common.reset/}));

        expect(screen.getByPlaceholderText("Tag.filterPlaceholder")).toHaveValue("");
    });

    it("opens a tag's details from its row", async () => {
        renderWithQueue(<TagTable initialData={pageOf(tags)}/>);

        await userEvent.click(screen.getByText("Hedersmedlem"));

        const dialog = await screen.findByRole("dialog");

        expect(within(dialog).getByText("Hedersmedlem")).toBeInTheDocument();
        expect(within(dialog).getByTestId("audit-trail")).toBeInTheDocument();

        await userEvent.click(within(dialog).getAllByRole("button", {name: "Common.close"})[0]);
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    });

    it("offers deleting the selected rows", async () => {
        renderWithQueue(<TagTable initialData={pageOf(tags)}/>);

        const checkboxes = screen.getAllByRole("checkbox");

        await userEvent.click(checkboxes[1]);

        expect(screen.getByRole("button", {name: /Common.delete \(1\)/})).toBeInTheDocument();
    });
});
