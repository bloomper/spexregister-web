import {beforeEach, describe, expect, it, vi} from 'vitest';

const toPromise = vi.fn();
const query = vi.fn<(...args: unknown[]) => {toPromise: typeof toPromise}>(() => ({toPromise}));
const mutation = vi.fn<(...args: unknown[]) => {toPromise: typeof toPromise}>(() => ({toPromise}));
vi.mock('@/lib/urql.server', () => ({getClient: () => ({query, mutation})}));
vi.mock('@/lib/axios.server', () => ({default: {}}));

import {addCategory, getPaged, removeCategory} from '@/lib/task/task.server';
import {SortDirection} from '@/gql/graphql';

const connection = (nodes: {id: string}[], hasNextPage: boolean, endCursor: string | null) => ({
    edges: nodes.map((node, i) => ({cursor: `c${i}`, node})),
    pageInfo: {hasNextPage, hasPreviousPage: false, startCursor: 'c0', endCursor},
});

beforeEach(() => {
    toPromise.mockReset();
    query.mockClear();
    mutation.mockClear();
});

describe('task.server (factory config binding)', () => {
    it('applies task-specific defaults', async () => {
        toPromise.mockResolvedValue({data: {taskPaged: connection([{id: '1'}], false, null)}});
        await getPaged({});
        const vars = query.mock.calls[0][1] as Record<string, unknown>;
        expect(vars).toMatchObject({sort: ['name'], direction: SortDirection.Asc, filter: ''});
    });
});

describe('task category mutations', () => {
    it('addCategory forwards ids and returns the payload', async () => {
        toPromise.mockResolvedValue({data: {taskCategoryAdd: true}});
        await expect(addCategory('1', 'c9')).resolves.toBe(true);
        expect(mutation.mock.calls[0][1]).toEqual({id: '1', categoryId: 'c9'});
    });

    it('removeCategory returns the payload', async () => {
        toPromise.mockResolvedValue({data: {taskCategoryRemove: true}});
        await expect(removeCategory('1')).resolves.toBe(true);
    });

    it('propagates mutation errors', async () => {
        toPromise.mockResolvedValue({error: new Error('denied')});
        await expect(removeCategory('1')).rejects.toThrow('denied');
    });
});
