import {beforeEach, describe, expect, it, vi} from 'vitest';

const toPromise = vi.fn();
const query = vi.fn<(...args: unknown[]) => {toPromise: typeof toPromise}>(() => ({toPromise}));
const mutation = vi.fn<(...args: unknown[]) => {toPromise: typeof toPromise}>(() => ({toPromise}));
vi.mock('@/lib/urql.server', () => ({getClient: () => ({query, mutation})}));
const axiosPut = vi.fn();
const axiosDelete = vi.fn();
vi.mock('@/lib/axios.server', () => ({default: {put: (...a: unknown[]) => axiosPut(...a), delete: (...a: unknown[]) => axiosDelete(...a)}}));

import {addCategory, createRevival, deletePoster, deleteRevival, getPaged, removeCategory, uploadPoster} from '@/lib/spex/spex.server';
import {SortDirection} from '@/gql/schema';

const connection = (nodes: {id: string}[], hasNextPage: boolean, endCursor: string | null) => ({
    edges: nodes.map((node, i) => ({cursor: `c${i}`, node})),
    pageInfo: {hasNextPage, hasPreviousPage: false, startCursor: 'c0', endCursor},
});

beforeEach(() => {
    toPromise.mockReset();
    query.mockClear();
    mutation.mockClear();
    axiosPut.mockReset();
    axiosDelete.mockReset();
});

// Generic CRUD/impex/events mechanics live in graphql.server.test.ts. Here we
// verify spex's own config binding and its bespoke (non-factory) operations.
describe('spex.server (factory config binding)', () => {
    it('applies spex-specific defaults and maps the connection into a page', async () => {
        toPromise.mockResolvedValue({data: {spexPaged: connection([{id: '1'}, {id: '2'}], true, 'c1')}});

        const page = await getPaged({});

        expect(page.items).toEqual([{id: '1'}, {id: '2'}]);
        const vars = query.mock.calls[0][1] as Record<string, unknown>;
        expect(vars).toMatchObject({sort: ['year'], direction: SortDirection.Desc, filter: 'parent:NULL'});
    });

    it('propagates query errors', async () => {
        toPromise.mockResolvedValue({error: new Error('graphql failed')});
        await expect(getPaged({})).rejects.toThrow('graphql failed');
    });
});

describe('spex category/revival mutations', () => {
    it('addCategory forwards ids and returns the payload', async () => {
        toPromise.mockResolvedValue({data: {spexCategoryAdd: true}});
        await expect(addCategory('1', 'c9')).resolves.toBe(true);
        expect(mutation.mock.calls[0][1]).toEqual({id: '1', categoryId: 'c9'});
    });

    it('removeCategory returns the payload', async () => {
        toPromise.mockResolvedValue({data: {spexCategoryRemove: true}});
        await expect(removeCategory('1')).resolves.toBe(true);
    });

    it('createRevival forwards spexId/year and returns the revival', async () => {
        toPromise.mockResolvedValue({data: {spexRevivalCreate: {id: 'r1', year: '2000'}}});
        await expect(createRevival('1', '2000')).resolves.toEqual({id: 'r1', year: '2000'});
        expect(mutation.mock.calls[0][1]).toEqual({spexId: '1', year: '2000'});
    });

    it('deleteRevival forwards spexId/id and returns the payload', async () => {
        toPromise.mockResolvedValue({data: {spexRevivalDelete: true}});
        await expect(deleteRevival('1', 'r1')).resolves.toBe(true);
        expect(mutation.mock.calls[0][1]).toEqual({spexId: '1', id: 'r1'});
    });

    it('propagates mutation errors', async () => {
        toPromise.mockResolvedValue({error: new Error('denied')});
        await expect(addCategory('1', 'c')).rejects.toThrow('denied');
    });
});

describe('spex poster upload/delete (REST)', () => {
    it('uploadPoster PUTs the file bytes to the poster endpoint', async () => {
        vi.stubEnv('API_REST_BASE_URL', 'https://api.test');
        axiosPut.mockResolvedValue({data: {posterUrl: 'u'}});
        const file = new File(['x'], 'p.jpg', {type: 'image/jpeg'});

        await expect(uploadPoster('42', file)).resolves.toEqual({posterUrl: 'u'});
        expect(axiosPut).toHaveBeenCalledWith(
            'https://api.test/api/spex/42/poster',
            expect.anything(),
            {headers: {'Content-Type': 'image/jpeg'}},
        );
        vi.unstubAllEnvs();
    });

    it('deletePoster DELETEs the poster endpoint and reports success', async () => {
        vi.stubEnv('API_REST_BASE_URL', 'https://api.test');
        axiosDelete.mockResolvedValue({});

        await expect(deletePoster('42')).resolves.toEqual({success: true});
        expect(axiosDelete).toHaveBeenCalledWith('https://api.test/api/spex/42/poster');
        vi.unstubAllEnvs();
    });
});
