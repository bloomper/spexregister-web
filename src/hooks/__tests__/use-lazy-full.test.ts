import {describe, expect, it, vi} from "vitest";
import {renderHook, waitFor} from "@testing-library/react";
import {useLazyFull} from "@/hooks/use-lazy-full";

type Item = { id: string; name?: string };

describe("useLazyFull", () => {
    it("does not load and stays idle when no id is selected", () => {
        const load = vi.fn();
        const {result} = renderHook(() => useLazyFull<Item>(null, load));

        expect(result.current).toEqual({full: null, isLoading: false});
        expect(load).not.toHaveBeenCalled();
    });

    it("loads the full item for the id and toggles isLoading", async () => {
        const load = vi.fn(async (id: string) => ({id, name: "full"}));
        const {result} = renderHook(({id}) => useLazyFull<Item>(id, load), {
            initialProps: {id: "1" as string | null},
        });

        expect(result.current.isLoading).toBe(true);
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.full).toEqual({id: "1", name: "full"});
        expect(load).toHaveBeenCalledWith("1");
    });

    it("reloads when the id changes", async () => {
        const load = vi.fn(async (id: string) => ({id, name: `full-${id}`}));
        const {result, rerender} = renderHook(({id}) => useLazyFull<Item>(id, load), {
            initialProps: {id: "1" as string | null},
        });

        await waitFor(() => expect(result.current.full).toEqual({id: "1", name: "full-1"}));

        rerender({id: "2"});
        await waitFor(() => expect(result.current.full).toEqual({id: "2", name: "full-2"}));
        expect(load).toHaveBeenCalledTimes(2);
    });

    it("clears the full item when the id is cleared", async () => {
        const load = vi.fn(async (id: string) => ({id}));
        const {result, rerender} = renderHook(({id}) => useLazyFull<Item>(id, load), {
            initialProps: {id: "1" as string | null},
        });
        await waitFor(() => expect(result.current.full).toEqual({id: "1"}));

        rerender({id: null});
        await waitFor(() => expect(result.current.full).toBeNull());
        expect(result.current.isLoading).toBe(false);
    });

    it("ignores a stale in-flight result when the id changes mid-load", async () => {
        const resolvers: Record<string, (v: Item) => void> = {};
        const load = vi.fn(
            (id: string) => new Promise<Item>((resolve) => {
                resolvers[id] = resolve;
            }),
        );
        const {result, rerender} = renderHook(({id}) => useLazyFull<Item>(id, load), {
            initialProps: {id: "1" as string | null},
        });

        rerender({id: "2"});
        // Resolve the stale (id: '1') load first, then the current one.
        resolvers["1"]({id: "1", name: "stale"});
        resolvers["2"]({id: "2", name: "current"});

        await waitFor(() => expect(result.current.full).toEqual({id: "2", name: "current"}));
        expect(result.current.full).not.toEqual({id: "1", name: "stale"});
    });
});
