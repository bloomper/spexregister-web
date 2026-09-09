import {describe, expect, it, vi} from "vitest";
import {act, render, screen, waitFor} from "@testing-library/react";
import {DataTable} from "@/components/data-table.client";
import type {DataTableColumnDef} from "@/components/data-table-features";
import type {CursorPage} from "@/types/pagination";

type Row = { id: string; name: string };

const columns = [
    {id: "name", accessorKey: "name", header: "Name"},
] as unknown as DataTableColumnDef<Row>[];

const pageOf = (rows: Row[]): CursorPage<Row> => ({
    items: rows,
    pageInfo: {hasNextPage: true, hasPreviousPage: true, startCursor: "s", endCursor: "e"},
    totalCount: 100,
});

describe("DataTable", () => {
    it("discards a fetch response that was superseded by a newer request", async () => {
        let releaseStale: (v: CursorPage<Row>) => void = () => {
        };
        const stale = new Promise<CursorPage<Row>>((r) => {
            releaseStale = r;
        });

        const onFetch = vi
            .fn()
            .mockReturnValueOnce(stale)
            .mockResolvedValue(pageOf([{id: "2", name: "fresh"}]));

        let applyFilter: ((filter: string) => void) | undefined;

        render(
            <DataTable
                columns={columns}
                initialData={pageOf([{id: "0", name: "initial"}])}
                onFetch={onFetch}
                initialPageSize={10}
                meta={{
                    setFilter: (handler) => {
                        applyFilter = handler;
                    }
                }}
            />
        );

        await waitFor(() => expect(applyFilter).toBeDefined());

        // request A (held open), then request B which supersedes it
        act(() => {
            applyFilter!("a");
        });
        await waitFor(() => expect(onFetch).toHaveBeenCalledTimes(1));
        act(() => {
            applyFilter!("b");
        });
        await waitFor(() => expect(screen.getByText("fresh")).toBeInTheDocument());

        // request A finally resolves, describing the query the user has moved away from
        await act(async () => {
            releaseStale(pageOf([{id: "1", name: "stale"}]));
            await stale;
        });

        expect(screen.queryByText("stale")).not.toBeInTheDocument();
        expect(screen.getByText("fresh")).toBeInTheDocument();
    });
});
