import {beforeEach, describe, expect, it, vi} from 'vitest';
import {act, renderHook} from '@testing-library/react';

const getPageAction = vi.fn<(...args: unknown[]) => Promise<unknown>>(async () => ({
    items: [],
    pageInfo: {hasNextPage: false, hasPreviousPage: false, startCursor: null, endCursor: null},
}));
vi.mock('@/app/(app)/tasks/actions.server', () => ({getPageAction: (...a: unknown[]) => getPageAction(...a)}));

let capturedFetch: ((args: {after: string | null; pageSize: number}) => unknown) | undefined;
const reset = vi.fn();
vi.mock('@/hooks/use-infinite-scrolling', () => ({
    useInfiniteCursor: (opts: {fetchPageAction: NonNullable<typeof capturedFetch>}) => {
        capturedFetch = opts.fetchPageAction;
        return {items: [], loading: false, error: null, hasNextPage: false, sentinelRef: {current: null}, loadMore: vi.fn(), reset, clearError: vi.fn()};
    },
}));

import {useTaskSearch} from '@/components/task/use-task-search';
import type {TaskCategory} from '@/gql/schema';

const categories = [{id: 'c1', name: 'A'}, {id: 'c2', name: 'B'}] as unknown as TaskCategory[];

const fetchWith = async () => {
    await act(async () => {
        await capturedFetch!({after: null, pageSize: 24});
    });
};

beforeEach(() => {
    getPageAction.mockClear();
    reset.mockClear();
    capturedFetch = undefined;
});

describe('useTaskSearch filter building', () => {
    it('sends an empty filter when everything (incl. "none") is selected', async () => {
        renderHook(() => useTaskSearch({categories, initialItems: []}));
        await fetchWith();
        expect(getPageAction).toHaveBeenCalledWith({after: null, first: 24, filter: ''});
    });

    it('maps the synthetic "none" option to category:NULL', async () => {
        const {result} = renderHook(() => useTaskSearch({categories, initialItems: []}));
        act(() => result.current.handleCategorySelect(new Set(['none'])));
        await fetchWith();
        expect(getPageAction).toHaveBeenLastCalledWith({after: null, first: 24, filter: '(category:NULL)'});
    });

    it('maps a real category to category.id', async () => {
        const {result} = renderHook(() => useTaskSearch({categories, initialItems: []}));
        act(() => result.current.handleCategorySelect(new Set(['c1'])));
        await fetchWith();
        expect(getPageAction).toHaveBeenLastCalledWith({after: null, first: 24, filter: '(category.id:c1)'});
    });

    it('sends id:NULL (match nothing) when no option is selected', async () => {
        const {result} = renderHook(() => useTaskSearch({categories, initialItems: []}));
        act(() => result.current.handleCategorySelect(new Set()));
        await fetchWith();
        expect(getPageAction).toHaveBeenLastCalledWith({after: null, first: 24, filter: 'id:NULL'});
    });

    it('adds a debounced name clause from the search input', async () => {
        vi.useFakeTimers();
        try {
            const {result} = renderHook(() => useTaskSearch({categories, initialItems: []}));
            act(() => result.current.setSearchValue('lighting'));
            act(() => {
                vi.advanceTimersByTime(300);
            });
            await fetchWith();
            expect(getPageAction).toHaveBeenLastCalledWith({after: null, first: 24, filter: '(name:*lighting*)'});
        } finally {
            vi.useRealTimers();
        }
    });
});
