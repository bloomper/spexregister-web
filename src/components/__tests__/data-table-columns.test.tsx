import {describe, expect, it, vi} from "vitest";
import {render, screen, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {DataTable} from "@/components/data-table.client";
import {columnHelper} from "@/components/data-table-columns.client";
import type {DataTableColumnDef, DataTableMeta} from "@/components/data-table-features";
import type {CursorPage} from "@/types/pagination";

type Row = { id: string; name: string };

const columns = [
    {id: "name", accessorKey: "name", header: "Name"},
    columnHelper.actions<Row>(),
] as unknown as DataTableColumnDef<Row>[];

const page: CursorPage<Row> = {
    items: [{id: "1", name: "first"}],
    pageInfo: {hasNextPage: false, hasPreviousPage: false, startCursor: "s", endCursor: "e"},
    totalCount: 1,
};

async function openActions(meta: DataTableMeta<Row>) {
    render(<DataTable columns={columns} initialData={page} onFetch={vi.fn()} meta={meta}/>);
    await userEvent.click(within(screen.getByText("first").closest("tr")!).getByRole("button"));
    return screen.findByText("Common.edit");
}

describe("the row actions", () => {
    it("offer deleting when the table can delete", async () => {
        const setDeleteItem = vi.fn();

        await openActions({setEditItem: vi.fn(), setDeleteItem});
        await userEvent.click(screen.getByText("Common.delete"));

        expect(setDeleteItem).toHaveBeenCalledWith({id: "1", name: "first"});
    });

    it("leave deleting out when the table cannot delete", async () => {
        await openActions({setEditItem: vi.fn()});

        expect(screen.queryByText("Common.delete")).not.toBeInTheDocument();
    });
});
