import {beforeEach, describe, expect, it, vi} from "vitest";
import {renderHook, waitFor} from "@testing-library/react";
import {useDeepLink, useDeepLinkItem} from "@/hooks/use-deep-link-item.client";

let params = new URLSearchParams();
vi.mock("next/navigation", () => ({useSearchParams: () => params}));

type Item = { id: string };

beforeEach(() => {
    params = new URLSearchParams();
});

describe("useDeepLink", () => {
    it("is null without an open param", () => {
        const {result} = renderHook(() => useDeepLink());

        expect(result.current).toBeNull();
    });

    it("reads the id and tab", () => {
        params = new URLSearchParams("open=42&tab=activities");
        const {result} = renderHook(() => useDeepLink());

        expect(result.current).toEqual({id: "42", tab: "activities"});
    });

    it("defaults the tab to null", () => {
        params = new URLSearchParams("open=42");
        const {result} = renderHook(() => useDeepLink());

        expect(result.current).toEqual({id: "42", tab: null});
    });
});

describe("useDeepLinkItem", () => {
    it("does nothing without a link", () => {
        const fetchById = vi.fn();
        const onFound = vi.fn();
        const {result} = renderHook(() => useDeepLinkItem<Item>(fetchById, onFound));

        expect(result.current.isLoading).toBe(false);
        expect(fetchById).not.toHaveBeenCalled();
    });

    it("fetches the linked item and hands it over with the tab", async () => {
        params = new URLSearchParams("open=42&tab=addresses");
        const fetchById = vi.fn(async (id: string) => ({id}));
        const onFound = vi.fn();
        const {result} = renderHook(() => useDeepLinkItem<Item>(fetchById, onFound));

        expect(result.current.isLoading).toBe(true);
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(fetchById).toHaveBeenCalledWith("42");
        expect(onFound).toHaveBeenCalledWith({id: "42"}, "addresses");
    });

    it("does not call onFound when the item is missing", async () => {
        params = new URLSearchParams("open=gone");
        const onFound = vi.fn();
        const {result} = renderHook(() => useDeepLinkItem<Item>(async () => null, onFound));

        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(onFound).not.toHaveBeenCalled();
    });

    it("stops loading and swallows a failed fetch", async () => {
        params = new URLSearchParams("open=42");
        const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
        const onFound = vi.fn();
        const {result} = renderHook(() => useDeepLinkItem<Item>(async () => {
            throw new Error("boom");
        }, onFound));

        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(onFound).not.toHaveBeenCalled();
        expect(error).toHaveBeenCalled();
        error.mockRestore();
    });

    it("ignores a fetch that resolves after unmount", async () => {
        params = new URLSearchParams("open=42");
        let resolve: (item: Item) => void = () => undefined;
        const onFound = vi.fn();
        const {unmount} = renderHook(() => useDeepLinkItem<Item>(
            () => new Promise<Item>((r) => {
                resolve = r;
            }),
            onFound,
        ));

        unmount();
        resolve({id: "42"});
        await new Promise((r) => setTimeout(r, 0));

        expect(onFound).not.toHaveBeenCalled();
    });
});
