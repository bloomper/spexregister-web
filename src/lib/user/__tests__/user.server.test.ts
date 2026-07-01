import {beforeEach, describe, expect, it, vi} from 'vitest';

const toPromise = vi.fn();
const query = vi.fn<(...args: unknown[]) => {toPromise: typeof toPromise}>(() => ({toPromise}));
const mutation = vi.fn<(...args: unknown[]) => {toPromise: typeof toPromise}>(() => ({toPromise}));
vi.mock('@/lib/urql.server', () => ({getClient: () => ({query, mutation})}));
vi.mock('@/lib/axios.server', () => ({default: {}}));

import {
    addAuthorities,
    addSpexare,
    getAuthorities,
    getPaged,
    getStates,
    me,
    removeAuthorities,
    removeSpexare,
    setState,
} from '@/lib/user/user.server';
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

describe('user.server (factory config binding)', () => {
    it('applies user-specific defaults', async () => {
        toPromise.mockResolvedValue({data: {userPaged: connection([{id: '1'}], false, null)}});
        await getPaged({});
        const vars = query.mock.calls[0][1] as Record<string, unknown>;
        expect(vars).toMatchObject({sort: ['id'], direction: SortDirection.Asc, filter: ''});
    });
});

describe('user read helpers', () => {
    it('me returns the current user', async () => {
        toPromise.mockResolvedValue({data: {me: {id: 'u1'}}});
        await expect(me()).resolves.toEqual({id: 'u1'});
    });

    it('getAuthorities returns the list, defaulting to empty', async () => {
        toPromise.mockResolvedValueOnce({data: {authorities: [{id: 'a1'}]}});
        await expect(getAuthorities()).resolves.toEqual([{id: 'a1'}]);
        toPromise.mockResolvedValueOnce({data: {}});
        await expect(getAuthorities()).resolves.toEqual([]);
    });

    it('getStates returns the list, defaulting to empty', async () => {
        toPromise.mockResolvedValueOnce({data: {states: [{id: 's1'}]}});
        await expect(getStates()).resolves.toEqual([{id: 's1'}]);
        toPromise.mockResolvedValueOnce({data: {}});
        await expect(getStates()).resolves.toEqual([]);
    });
});

describe('user relation mutations', () => {
    it('addAuthorities forwards userId/ids to the correct field', async () => {
        toPromise.mockResolvedValue({data: {userAuthoritiesAdd: true}});
        await expect(addAuthorities('u1', ['a1', 'a2'])).resolves.toBe(true);
        expect(mutation.mock.calls[0][1]).toEqual({userId: 'u1', ids: ['a1', 'a2']});
    });

    it('removeAuthorities returns the payload', async () => {
        toPromise.mockResolvedValue({data: {userAuthoritiesRemove: true}});
        await expect(removeAuthorities('u1', ['a1'])).resolves.toBe(true);
    });

    it('setState forwards userId/id', async () => {
        toPromise.mockResolvedValue({data: {userStateSet: true}});
        await expect(setState('u1', 's1')).resolves.toBe(true);
        expect(mutation.mock.calls[0][1]).toEqual({userId: 'u1', id: 's1'});
    });

    it('addSpexare and removeSpexare return their payloads', async () => {
        toPromise.mockResolvedValueOnce({data: {userSpexareAdd: true}});
        await expect(addSpexare('u1', 'sp1')).resolves.toBe(true);
        expect(mutation.mock.calls[0][1]).toEqual({userId: 'u1', id: 'sp1'});

        toPromise.mockResolvedValueOnce({data: {userSpexareRemove: true}});
        await expect(removeSpexare('u1')).resolves.toBe(true);
    });

    it('propagates mutation errors', async () => {
        toPromise.mockResolvedValue({error: new Error('denied')});
        await expect(setState('u1', 's1')).rejects.toThrow('denied');
    });
});
