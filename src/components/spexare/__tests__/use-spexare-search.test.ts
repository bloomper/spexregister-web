import {beforeEach, describe, expect, it, vi} from "vitest";
import {act, renderHook} from "@testing-library/react";
import {useSpexareSearch} from "@/components/spexare/use-spexare-search.client";

const getPageAction = vi.fn<(...args: unknown[]) => Promise<unknown>>(async () => ({
    items: [],
    pageInfo: {hasNextPage: false, hasPreviousPage: false, startCursor: null, endCursor: null},
}));
const searchAction = vi.fn<(...args: unknown[]) => Promise<unknown>>(async () => ({
    items: [],
    pageInfo: {hasNextPage: false, hasPreviousPage: false, startCursor: null, endCursor: null},
    facets: [],
}));
vi.mock("@/app/(app)/spexare/actions.server", () => ({
    getPageAction: (...a: unknown[]) => getPageAction(...a),
    searchAction: (...a: unknown[]) => searchAction(...a),
}));
vi.mock("next/navigation", () => ({
    useRouter: () => ({replace: vi.fn(), refresh: vi.fn()}),
    usePathname: () => "/spexare",
}));

let capturedFetch: ((args: { after: string | null; pageSize: number }) => unknown) | undefined;
const reset = vi.fn();
vi.mock("@/hooks/use-infinite-scrolling.client", () => ({
    useInfiniteCursor: (opts: { fetchPageAction: NonNullable<typeof capturedFetch> }) => {
        capturedFetch = opts.fetchPageAction;
        return {
            items: [],
            loading: false,
            error: null,
            hasNextPage: false,
            sentinelRef: {current: null},
            loadMore: vi.fn(),
            reset,
            clearError: vi.fn()
        };
    },
}));

const fetchWith = async () => {
    await act(async () => {
        await capturedFetch!({after: null, pageSize: 24});
    });
};

beforeEach(() => {
    getPageAction.mockClear();
    searchAction.mockClear();
    reset.mockClear();
    capturedFetch = undefined;
    window.history.replaceState(null, "", "/spexare");
});

describe("useSpexareSearch (filter mode)", () => {
    it("sends an empty filter by default", async () => {
        renderHook(() => useSpexareSearch({mode: "filter", initialSearchQuery: "", facets: [], initialItems: []}));
        await fetchWith();
        expect(getPageAction).toHaveBeenCalledWith({after: null, first: 24, filter: ""});
    });

    it("adds a deceased clause when the deceased filter is narrowed", async () => {
        const {result} = renderHook(() => useSpexareSearch({
            mode: "filter",
            initialSearchQuery: "",
            facets: [],
            initialItems: []
        }));
        act(() => result.current.setSelectedDeceasedValues(new Set(["true"])));
        await fetchWith();
        expect(getPageAction).toHaveBeenLastCalledWith({after: null, first: 24, filter: "deceased:TRUE"});
    });

    it("builds a name clause from the query", async () => {
        // The query seeds from initialSearchQuery (the path used by SSR / search links); the
        // filter-mode prop-sync effect keeps searchValue pinned to it.
        renderHook(() => useSpexareSearch({mode: "filter", initialSearchQuery: "ada", facets: [], initialItems: []}));
        await fetchWith();
        expect(getPageAction).toHaveBeenLastCalledWith({
            after: null,
            first: 24,
            filter: "(firstName:*ada* OR lastName:*ada* OR nickName:*ada*)",
        });
    });
});

describe("useSpexareSearch (search mode)", () => {
    it("dispatches a faceted search with the query and cursor", async () => {
        renderHook(() => useSpexareSearch({mode: "search", initialSearchQuery: "q", facets: [], initialItems: []}));
        await fetchWith();
        expect(searchAction).toHaveBeenCalledWith({q: "q", first: 24, after: null, aggregationFilters: []});
        expect(getPageAction).not.toHaveBeenCalled();
    });
});

describe("useSpexareSearch (facet selection in the URL)", () => {
    it("seeds the selection from initialSelectedFacets and sends it as aggregation filters", async () => {
        renderHook(() => useSpexareSearch({
            mode: "search",
            initialSearchQuery: "",
            facets: [],
            initialItems: [],
            initialSelectedFacets: {tags: new Set(["Hedersmedlem", "Grundare"])},
        }));
        await fetchWith();
        expect(searchAction).toHaveBeenCalledWith({
            q: "",
            first: 24,
            after: null,
            aggregationFilters: [
                {name: "tags", value: "Grundare"},
                {name: "tags", value: "Hedersmedlem"},
            ],
        });
    });

    it("mirrors the seeded selection into the URL alongside the query", () => {
        renderHook(() => useSpexareSearch({
            mode: "search",
            initialSearchQuery: "ada",
            facets: [],
            initialItems: [],
            initialSelectedFacets: {tags: new Set(["Grundare"])},
        }));
        expect(window.location.search).toBe("?q=ada&f.tags=Grundare");
    });

    it("updates the URL when the selection changes", () => {
        const {result} = renderHook(() => useSpexareSearch({
            mode: "search",
            initialSearchQuery: "",
            facets: [],
            initialItems: []
        }));
        expect(window.location.search).toBe("");

        act(() => result.current.setSelectedFacets({deceased: new Set(["true"])}));
        expect(window.location.search).toBe("?f.deceased=true");
    });

    it("clears the selection from state and URL on reset", () => {
        const {result} = renderHook(() => useSpexareSearch({
            mode: "search",
            initialSearchQuery: "ada",
            facets: [],
            initialItems: [],
            initialSelectedFacets: {deceased: new Set(["true"])},
        }));
        expect(window.location.search).toBe("?q=ada&f.deceased=true");

        act(() => result.current.handleReset());
        expect(result.current.selectedFacets).toEqual({});
        expect(window.location.search).toBe("");
    });

    it("leaves the URL alone in filter mode", () => {
        renderHook(() => useSpexareSearch({mode: "filter", initialSearchQuery: "ada", facets: [], initialItems: []}));
        expect(window.location.search).toBe("");
    });
});
