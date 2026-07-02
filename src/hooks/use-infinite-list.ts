"use client";

import {useInfiniteCursor, UseInfiniteCursorOptions} from "@/hooks/use-infinite-scrolling";

export type UseInfiniteListOptions<TItem> = UseInfiniteCursorOptions<TItem> & {
    maxItems?: number;
};

export function useInfiniteList<TItem>({maxItems, ...cursorOptions}: UseInfiniteListOptions<TItem>) {
    const infinite = useInfiniteCursor<TItem>(cursorOptions);
    const items = maxItems ? infinite.items.slice(0, maxItems) : infinite.items;
    const isInfiniteMode = !maxItems;

    return {...infinite, items, isInfiniteMode};
}
