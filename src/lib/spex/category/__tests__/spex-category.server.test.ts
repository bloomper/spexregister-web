import {beforeEach, describe, expect, it, vi} from 'vitest';

const toPromise = vi.fn();
const query = vi.fn<(...args: unknown[]) => {toPromise: typeof toPromise}>(() => ({toPromise}));
const mutation = vi.fn<(...args: unknown[]) => {toPromise: typeof toPromise}>(() => ({toPromise}));
vi.mock('@/lib/urql.server', () => ({getClient: () => ({query, mutation})}));
const axiosPut = vi.fn();
const axiosDelete = vi.fn();
vi.mock('@/lib/axios.server', () => ({default: {put: (...a: unknown[]) => axiosPut(...a), delete: (...a: unknown[]) => axiosDelete(...a)}}));

import {deleteLogo, getPaged, uploadLogo} from '@/lib/spex/category/spex-category.server';
import {SortDirection} from '@/gql/graphql';

const connection = (nodes: {id: string}[], hasNextPage: boolean, endCursor: string | null) => ({
    edges: nodes.map((node, i) => ({cursor: `c${i}`, node})),
    pageInfo: {hasNextPage, hasPreviousPage: false, startCursor: 'c0', endCursor},
});

beforeEach(() => {
    toPromise.mockReset();
    query.mockClear();
    axiosPut.mockReset();
    axiosDelete.mockReset();
});

describe('spex-category.server (factory config binding)', () => {
    it('applies spex-category-specific defaults and maps the connection', async () => {
        toPromise.mockResolvedValue({data: {spexCategoryPaged: connection([{id: '1'}], false, null)}});
        const page = await getPaged({});
        expect(page.items).toEqual([{id: '1'}]);
        const vars = query.mock.calls[0][1] as Record<string, unknown>;
        expect(vars).toMatchObject({sort: ['name'], direction: SortDirection.Asc, filter: ''});
    });
});

describe('spex-category logo upload/delete (REST)', () => {
    it('uploadLogo PUTs the file bytes to the logo endpoint', async () => {
        vi.stubEnv('API_REST_BASE_URL', 'https://api.test');
        axiosPut.mockResolvedValue({data: {logoUrl: 'u'}});
        const file = new File(['x'], 'l.png', {type: 'image/png'});

        await expect(uploadLogo('7', file)).resolves.toEqual({logoUrl: 'u'});
        expect(axiosPut).toHaveBeenCalledWith(
            'https://api.test/api/spex/categories/7/logo',
            expect.anything(),
            {headers: {'Content-Type': 'image/png'}},
        );
        vi.unstubAllEnvs();
    });

    it('deleteLogo DELETEs the logo endpoint and reports success', async () => {
        vi.stubEnv('API_REST_BASE_URL', 'https://api.test');
        axiosDelete.mockResolvedValue({});

        await expect(deleteLogo('7')).resolves.toEqual({success: true});
        expect(axiosDelete).toHaveBeenCalledWith('https://api.test/api/spex/categories/7/logo');
        vi.unstubAllEnvs();
    });
});
