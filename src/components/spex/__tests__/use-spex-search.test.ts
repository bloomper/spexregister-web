import {beforeEach, describe, expect, it, vi} from 'vitest';
import {act, renderHook} from '@testing-library/react';

const getPageAction = vi.fn<(...args: unknown[]) => Promise<unknown>>(async () => ({
    items: [],
    pageInfo: {hasNextPage: false, hasPreviousPage: false, startCursor: null, endCursor: null},
}));
vi.mock('@/app/(app)/spex/actions.server', () => ({getPageAction: (...a: unknown[]) => getPageAction(...a)}));

let capturedFetch: ((args: {after: string | null; pageSize: number}) => unknown) | undefined;
const reset = vi.fn();
vi.mock('@/hooks/use-infinite-scrolling', () => ({
    useInfiniteCursor: (opts: {fetchPageAction: NonNullable<typeof capturedFetch>}) => {
        capturedFetch = opts.fetchPageAction;
        return {items: [], loading: false, error: null, hasNextPage: false, sentinelRef: {current: null}, loadMore: vi.fn(), reset, clearError: vi.fn()};
    },
}));

import {useSpexSearch} from '@/components/spex/use-spex-search';
import type {SpexCategory} from '@/gql/schema';

const categories = [{id: 'c1', name: 'A'}, {id: 'c2', name: 'B'}] as unknown as SpexCategory[];

beforeEach(() => {
    getPageAction.mockClear();
    reset.mockClear();
    capturedFetch = undefined;
});

describe('useSpexSearch filter building', () => {
    it('sends only parent:NULL when nothing is filtered', async () => {
        renderHook(() => useSpexSearch({categories: [], initialItems: []}));
        await act(async () => {
            await capturedFetch!({after: null, pageSize: 24});
        });
        expect(getPageAction).toHaveBeenCalledWith({after: null, first: 24, filter: 'parent:NULL'});
    });

    it('adds a category clause and resets when categories are narrowed', async () => {
        const {result} = renderHook(() => useSpexSearch({categories, initialItems: []}));
        act(() => result.current.handleCategorySelect(new Set(['c1'])));
        await act(async () => {
            await capturedFetch!({after: null, pageSize: 24});
        });
        expect(getPageAction).toHaveBeenLastCalledWith({
            after: null,
            first: 24,
            filter: 'parent:NULL AND (details.category.id:c1)',
        });
        expect(reset).toHaveBeenCalled();
    });

    it('adds a debounced title/year clause from the search input', async () => {
        vi.useFakeTimers();
        try {
            const {result} = renderHook(() => useSpexSearch({categories: [], initialItems: []}));
            act(() => result.current.setSearchValue('hamlet'));
            act(() => {
                vi.advanceTimersByTime(300);
            });
            await act(async () => {
                await capturedFetch!({after: null, pageSize: 24});
            });
            expect(getPageAction).toHaveBeenLastCalledWith({
                after: null,
                first: 24,
                filter: 'parent:NULL AND (details.title:*hamlet* OR year:*hamlet*)',
            });
        } finally {
            vi.useRealTimers();
        }
    });
});
