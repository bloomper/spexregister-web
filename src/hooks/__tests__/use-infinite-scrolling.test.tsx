import {describe, expect, it, vi} from "vitest";
import {act, renderHook, waitFor} from "@testing-library/react";
import {useInfiniteCursor, type UseInfiniteCursorOptions} from "@/hooks/use-infinite-scrolling";
import type {CursorPage, CursorPageInfo} from "@/types/pagination";

type Item = { id: string };

const getKey = (i: Item) => i.id;
const EMPTY: Item[] = [];

const page = (items: Item[], hasNextPage: boolean, endCursor: string | null): CursorPage<Item> => ({
    items,
    pageInfo: {hasNextPage, hasPreviousPage: false, startCursor: null, endCursor},
});

function renderCursor(options: UseInfiniteCursorOptions<Item>) {
    return renderHook(() => useInfiniteCursor<Item>(options));
}

describe("useInfiniteCursor", () => {
    it("auto-loads the first page on mount", async () => {
        const fetchPageAction = vi.fn().mockResolvedValue(page([{id: "1"}, {id: "2"}], false, "c2"));
        const {result} = renderCursor({fetchPageAction, pageSize: 2, getKeyAction: getKey, initialItems: EMPTY});

        await waitFor(() => expect(result.current.items).toHaveLength(2));
        expect(fetchPageAction).toHaveBeenCalledWith({after: null, pageSize: 2});
        expect(result.current.hasNextPage).toBe(false);
    });

    it("appends subsequent pages and de-duplicates by key", async () => {
        const fetchPageAction = vi
            .fn()
            .mockResolvedValueOnce(page([{id: "1"}, {id: "2"}], true, "c2"))
            .mockResolvedValueOnce(page([{id: "2"}, {id: "3"}], false, null));
        const {result} = renderCursor({fetchPageAction, pageSize: 2, getKeyAction: getKey, initialItems: EMPTY});

        await waitFor(() => expect(result.current.items).toHaveLength(2));
        expect(result.current.hasNextPage).toBe(true);

        await act(async () => {
            await result.current.loadMore();
        });

        expect(result.current.items.map((i) => i.id)).toEqual(["1", "2", "3"]);
        expect(result.current.hasNextPage).toBe(false);
        expect(fetchPageAction).toHaveBeenLastCalledWith({after: "c2", pageSize: 2});
    });

    it("captures fetch errors and recovers after clearError", async () => {
        const fetchPageAction = vi
            .fn()
            .mockRejectedValueOnce(new Error("boom"))
            .mockResolvedValueOnce(page([{id: "1"}], false, null));
        const {result} = renderCursor({fetchPageAction, pageSize: 5, getKeyAction: getKey, initialItems: EMPTY});

        await waitFor(() => expect(result.current.error).toBe("boom"));
        expect(result.current.items).toHaveLength(0);

        await act(async () => {
            result.current.clearError();
        });

        await waitFor(() => expect(result.current.items).toHaveLength(1));
        expect(result.current.error).toBeNull();
    });

    it("reset clears items and re-triggers a fresh load", async () => {
        const fetchPageAction = vi.fn().mockResolvedValue(page([{id: "1"}], false, null));
        const {result} = renderCursor({fetchPageAction, pageSize: 5, getKeyAction: getKey, initialItems: EMPTY});

        await waitFor(() => expect(result.current.items).toHaveLength(1));
        expect(fetchPageAction).toHaveBeenCalledTimes(1);

        await act(async () => {
            result.current.reset();
        });

        await waitFor(() => expect(fetchPageAction).toHaveBeenCalledTimes(2));
        expect(result.current.items).toEqual([{id: "1"}]);
    });

    it("does not loop or reset paging when initial props are recreated every render", async () => {
        const fetchPageAction = vi.fn().mockResolvedValue(page([{id: "1"}, {id: "2"}], false, "c2"));
        const {result, rerender} = renderHook(() =>
            useInfiniteCursor<Item>({
                fetchPageAction,
                pageSize: 2,
                getKeyAction: (i) => i.id,
                // Fresh, unstable references on every render — the fatal case.
                initialItems: [],
                initialPageInfo: {hasNextPage: true, hasPreviousPage: false, startCursor: null, endCursor: null},
            }),
        );

        await waitFor(() => expect(result.current.items).toHaveLength(2));

        rerender();
        rerender();
        await waitFor(() => expect(result.current.items).toHaveLength(2));
        expect(fetchPageAction).toHaveBeenCalledTimes(1);
    });

    it("re-seeds when the caller supplies genuinely new initial data", async () => {
        const fetchPageAction = vi.fn().mockResolvedValue(page([], false, null));
        let seed = {items: [{id: "a"}], endCursor: "a"};
        const {result, rerender} = renderHook(() =>
            useInfiniteCursor<Item>({
                fetchPageAction,
                pageSize: 5,
                getKeyAction: (i) => i.id,
                initialItems: seed.items,
                initialPageInfo: {
                    hasNextPage: false,
                    hasPreviousPage: false,
                    startCursor: null,
                    endCursor: seed.endCursor
                },
            }),
        );

        expect(result.current.items).toEqual([{id: "a"}]);

        seed = {items: [{id: "b"}, {id: "c"}], endCursor: "c"};
        rerender();

        await waitFor(() => expect(result.current.items).toEqual([{id: "b"}, {id: "c"}]));
    });

    it("seeds from initial items and page info without fetching", async () => {
        const fetchPageAction = vi.fn();
        const initialItems: Item[] = [{id: "a"}];
        const initialPageInfo: CursorPageInfo = {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: "a",
        };
        const {result} = renderCursor({
            fetchPageAction,
            pageSize: 5,
            getKeyAction: getKey,
            initialItems,
            initialPageInfo
        });

        expect(result.current.items).toEqual([{id: "a"}]);
        expect(result.current.hasNextPage).toBe(false);
        expect(fetchPageAction).not.toHaveBeenCalled();
    });
});
