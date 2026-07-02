import {beforeEach, describe, expect, it, vi} from 'vitest';
import {renderHook} from '@testing-library/react';

const cursor = vi.fn();
vi.mock('@/hooks/use-infinite-scrolling', () => ({
    useInfiniteCursor: (opts: unknown) => cursor(opts),
}));

import {useInfiniteList} from '@/hooks/use-infinite-list';

const noopFetch = async () => ({
    items: [],
    pageInfo: {hasNextPage: false, hasPreviousPage: false, startCursor: null, endCursor: null},
});

beforeEach(() => {
    cursor.mockReset();
    cursor.mockReturnValue({items: [{id: '1'}, {id: '2'}, {id: '3'}], loading: false});
});

describe('useInfiniteList', () => {
    it('forwards cursor options and exposes the full list + isInfiniteMode when uncapped', () => {
        const {result} = renderHook(() => useInfiniteList({fetchPageAction: noopFetch, getKeyAction: (x: {id: string}) => x.id}));

        expect(result.current.items).toEqual([{id: '1'}, {id: '2'}, {id: '3'}]);
        expect(result.current.isInfiniteMode).toBe(true);
        expect(cursor.mock.calls[0][0]).not.toHaveProperty('maxItems');
    });

    it('caps the list at maxItems and marks the mode as non-infinite', () => {
        const {result} = renderHook(() => useInfiniteList({fetchPageAction: noopFetch, maxItems: 2}));

        expect(result.current.items).toEqual([{id: '1'}, {id: '2'}]);
        expect(result.current.isInfiniteMode).toBe(false);
    });
});
