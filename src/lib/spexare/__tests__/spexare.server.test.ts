import {beforeEach, describe, expect, it, vi} from 'vitest';

const toPromise = vi.fn();
const query = vi.fn<(...args: unknown[]) => {toPromise: typeof toPromise}>(() => ({toPromise}));
const mutation = vi.fn<(...args: unknown[]) => {toPromise: typeof toPromise}>(() => ({toPromise}));
vi.mock('@/lib/urql.server', () => ({getClient: () => ({query, mutation})}));
const axiosPut = vi.fn();
const axiosDelete = vi.fn();
vi.mock('@/lib/axios.server', () => ({default: {put: (...a: unknown[]) => axiosPut(...a), delete: (...a: unknown[]) => axiosDelete(...a)}}));

import {addPartner, deleteImage, exp, get, getPaged, removePartner, search, uploadImage} from '@/lib/spexare/spexare.server';
import {ImpexType, ReportType, SortDirection} from '@/gql/graphql';

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

describe('spexare.server (factory config binding)', () => {
    it('applies spexare-specific defaults', async () => {
        toPromise.mockResolvedValue({data: {spexarePaged: connection([{id: '1'}], false, null)}});
        await getPaged({});
        const vars = query.mock.calls[0][1] as Record<string, unknown>;
        expect(vars).toMatchObject({sort: ['firstName'], direction: SortDirection.Asc, filter: 'published:TRUE'});
    });
});

describe('spexare search', () => {
    it('applies search defaults and maps items plus (truthy) facets', async () => {
        toPromise.mockResolvedValue({
            data: {
                spexareSearchPaged: {
                    edges: [{cursor: 'c0', node: {id: '1'}}, {cursor: 'c1', node: {id: '2'}}],
                    facets: [{id: 'f1', label: 'F1'}, null],
                    pageInfo: {hasNextPage: false, hasPreviousPage: false, startCursor: 'c0', endCursor: 'c1'},
                },
            },
        });

        const result = await search({q: 'ann'});

        expect(result.items).toEqual([{id: '1'}, {id: '2'}]);
        expect(result.facets).toEqual([{id: 'f1', label: 'F1'}]);
        expect(query.mock.calls[0][1]).toMatchObject({q: 'ann', limit: 24, offset: 0, sort: ['score'], direction: SortDirection.Desc});
    });

    it('returns an empty page and no facets when the connection is missing', async () => {
        toPromise.mockResolvedValue({data: {}});
        const result = await search({q: 'x'});
        expect(result.items).toEqual([]);
        expect(result.facets).toEqual([]);
    });
});

describe('spexare get/export', () => {
    it('get returns the spexare', async () => {
        toPromise.mockResolvedValue({data: {spexare: {id: 's1'}}});
        await expect(get('s1')).resolves.toEqual({id: 's1'});
    });

    it('exp forwards ids/filter/type/reportType and returns the job', async () => {
        toPromise.mockResolvedValue({data: {spexareExport: {id: 'job1'}}});
        await expect(exp(['1'], 'f', ImpexType.Pdf, ReportType.PdfPlatoonList)).resolves.toEqual({id: 'job1'});
        expect(query.mock.calls[0][1]).toEqual({ids: ['1'], filter: 'f', type: ImpexType.Pdf, reportType: ReportType.PdfPlatoonList});
    });
});

describe('spexare partner mutations', () => {
    it('addPartner forwards spexareId/id', async () => {
        toPromise.mockResolvedValue({data: {spexarePartnerAdd: true}});
        await expect(addPartner('s1', 'p1')).resolves.toBe(true);
        expect(mutation.mock.calls[0][1]).toEqual({spexareId: 's1', id: 'p1'});
    });

    it('removePartner forwards spexareId', async () => {
        toPromise.mockResolvedValue({data: {spexarePartnerRemove: true}});
        await expect(removePartner('s1')).resolves.toBe(true);
        expect(mutation.mock.calls[0][1]).toEqual({spexareId: 's1'});
    });
});

describe('spexare image upload/delete (REST)', () => {
    it('uploadImage PUTs the file bytes to the image endpoint', async () => {
        vi.stubEnv('API_REST_BASE_URL', 'https://api.test');
        axiosPut.mockResolvedValue({data: {imageUrl: 'u'}});
        const file = new File(['x'], 'i.jpg', {type: 'image/jpeg'});

        await expect(uploadImage('s1', file)).resolves.toEqual({imageUrl: 'u'});
        expect(axiosPut).toHaveBeenCalledWith(
            'https://api.test/api/spexare/s1/image',
            expect.anything(),
            {headers: {'Content-Type': 'image/jpeg'}},
        );
        vi.unstubAllEnvs();
    });

    it('deleteImage DELETEs the image endpoint and reports success', async () => {
        vi.stubEnv('API_REST_BASE_URL', 'https://api.test');
        axiosDelete.mockResolvedValue({});

        await expect(deleteImage('s1')).resolves.toEqual({success: true});
        expect(axiosDelete).toHaveBeenCalledWith('https://api.test/api/spexare/s1/image');
        vi.unstubAllEnvs();
    });
});
