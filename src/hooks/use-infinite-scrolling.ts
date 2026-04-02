'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {CursorPage, CursorPageInfo} from "@/types/pagination";

export type UseInfiniteCursorOptions<TItem> = {
    fetchPageAction: (args: { after: string | null; pageSize: number }) => Promise<CursorPage<TItem>>;
    pageSize?: number;
    rootMargin?: string;
    getKeyAction?: (item: TItem) => string;

    initialItems?: TItem[];
    initialPageInfo?: CursorPageInfo;
    initialAfter?: string | null;
};

function useInView<T extends Element>(options?: IntersectionObserverInit) {
    const ref = useRef<T | null>(null);
    const [inView, setInView] = useState(false);
    const {root, rootMargin, threshold} = options ?? {};

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        const obs = new IntersectionObserver(([entry]) => {
            setInView(entry.isIntersecting);
        }, {root, rootMargin, threshold});

        obs.observe(ref.current);
        return () => obs.disconnect();
    }, [root, rootMargin, threshold]);

    return {ref, inView};
}

export function useInfiniteCursor<TItem>(options: UseInfiniteCursorOptions<TItem>) {
    const {
        fetchPageAction,
        pageSize = 10,
        rootMargin = '600px',
        getKeyAction,
        initialItems = [],
        initialPageInfo,
        initialAfter,
    } = options;

    const [items, setItems] = useState<TItem[]>(initialItems);
    const [after, setAfter] = useState<string | null>(
        initialAfter ?? initialPageInfo?.endCursor ?? null
    );
    const [hasNextPage, setHasNextPage] = useState<boolean>(
        initialPageInfo ? Boolean(initialPageInfo.hasNextPage) : true
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setItems(initialItems);
        if (initialPageInfo) {
            setAfter(initialPageInfo.endCursor ?? null);
            setHasNextPage(Boolean(initialPageInfo.hasNextPage));
        } else {
            setAfter(initialAfter ?? null);
            setHasNextPage(true);
        }
    }, [initialItems, initialPageInfo, initialAfter]);

    const {ref: sentinelRef, inView} = useInView<HTMLDivElement>({rootMargin});

    const loadMore = useCallback(async (force = false) => {
        if (loading || !hasNextPage || (error && !force)) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const page = await fetchPageAction({after, pageSize});

            setItems((prev) => {
                if (!getKeyAction) {
                    return [...prev, ...page.items];
                }

                const seen = new Set(prev.map(getKeyAction));
                const merged = [...prev];
                for (const item of page.items) {
                    const key = getKeyAction(item);
                    if (!seen.has(key)) {
                        seen.add(key);
                        merged.push(item);
                    }
                }
                return merged;
            });

            setHasNextPage(Boolean(page.pageInfo?.hasNextPage));
            setAfter(page.pageInfo?.endCursor ?? null);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to load data');
        } finally {
            setLoading(false);
        }
    }, [after, fetchPageAction, getKeyAction, hasNextPage, loading, pageSize, error]);

    useEffect(() => {
        if (items.length === 0 && !loading && error === null && hasNextPage) {
            void loadMore();
        }
    }, [items.length, loading, error, hasNextPage, loadMore]);

    useEffect(() => {
        if (!inView) {
            return;
        }
        void loadMore();
    }, [inView, loadMore]);

    const reset = useCallback(() => {
        setItems([]);
        setAfter(null);
        setHasNextPage(true);
        setLoading(false);
        setError(null);
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        items,
        loading,
        error,
        hasNextPage,
        sentinelRef,
        loadMore,
        reset,
        clearError,
    };
}
