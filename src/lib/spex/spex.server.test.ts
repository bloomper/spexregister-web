import {beforeEach, describe, expect, it, vi} from 'vitest';

const toPromise = vi.fn();
const query = vi.fn<(...args: unknown[]) => {toPromise: typeof toPromise}>(() => ({toPromise}));
const mutation = vi.fn<(...args: unknown[]) => {toPromise: typeof toPromise}>(() => ({toPromise}));
vi.mock('@/lib/urql.server', () => ({getClient: () => ({query, mutation})}));

const axiosDelete = vi.fn();
vi.mock('@/lib/axios.server', () => ({default: {delete: (...a: unknown[]) => axiosDelete(...a)}}));

import {create, del, getAll, getPaged} from '@/lib/spex/spex.server';
import {SortDirection} from '@/gql/graphql';

const connection = (nodes: {id: string}[], hasNextPage: boolean, endCursor: string | null) => ({
    edges: nodes.map((node, i) => ({cursor: `c${i}`, node})),
    pageInfo: {hasNextPage, hasPreviousPage: false, startCursor: 'c0', endCursor},
});

beforeEach(() => {
    toPromise.mockReset();
    query.mockClear();
    mutation.mockClear();
    axiosDelete.mockReset();
});

describe('getPaged', () => {
    it('maps the connection into a page and applies default variables', async () => {
        toPromise.mockResolvedValue({data: {spexPaged: connection([{id: '1'}, {id: '2'}], true, 'c1')}});

        const page = await getPaged({});

        expect(page.items).toEqual([{id: '1'}, {id: '2'}]);
        expect(page.pageInfo.hasNextPage).toBe(true);

        const vars = query.mock.calls[0][1] as Record<string, unknown>;
        expect(vars).toMatchObject({
            sort: ['year'],
            direction: SortDirection.Desc,
            filter: 'parent:NULL',
            after: null,
            before: null,
        });
    });

    it('forwards explicit arguments', async () => {
        toPromise.mockResolvedValue({data: {spexPaged: connection([], false, null)}});

        await getPaged({first: 10, after: 'cursor', sort: ['title'], direction: SortDirection.Asc, filter: 'year:2024'});

        const vars = query.mock.calls[0][1] as Record<string, unknown>;
        expect(vars).toMatchObject({first: 10, after: 'cursor', sort: ['title'], direction: SortDirection.Asc, filter: 'year:2024'});
    });

    it('throws when the query returns an error', async () => {
        toPromise.mockResolvedValue({error: new Error('graphql failed')});
        await expect(getPaged({})).rejects.toThrow('graphql failed');
    });
});

describe('getAll', () => {
    it('walks every page until hasNextPage is false', async () => {
        toPromise
            .mockResolvedValueOnce({data: {spexPaged: connection([{id: '1'}, {id: '2'}], true, 'c-end-1')}})
            .mockResolvedValueOnce({data: {spexPaged: connection([{id: '3'}], false, null)}});

        const items = await getAll();

        expect(items.map((i) => i.id)).toEqual(['1', '2', '3']);
        expect(query).toHaveBeenCalledTimes(2);
        // Second page continues from the first page's endCursor.
        expect((query.mock.calls[1][1] as Record<string, unknown>).after).toBe('c-end-1');
    });
});

describe('create', () => {
    it('returns the created spex on success', async () => {
        toPromise.mockResolvedValue({data: {spexCreate: {id: '42', year: '2024'}}});
        await expect(create({title: 'X', year: '2024'} as never)).resolves.toEqual({id: '42', year: '2024'});
    });

    it('throws when the mutation reports an error', async () => {
        toPromise.mockResolvedValue({error: new Error('boom')});
        await expect(create({} as never)).rejects.toThrow('boom');
    });

    it('throws when no data is returned', async () => {
        toPromise.mockResolvedValue({data: {}});
        await expect(create({} as never)).rejects.toThrow('No data created');
    });
});

describe('del', () => {
    it('propagates a mutation error', async () => {
        toPromise.mockResolvedValue({error: new Error('cannot delete')});
        await expect(del('1')).rejects.toThrow('cannot delete');
    });

    it('returns the delete payload on success', async () => {
        toPromise.mockResolvedValue({data: {spexDelete: true}});
        await expect(del('1')).resolves.toBe(true);
    });
});
