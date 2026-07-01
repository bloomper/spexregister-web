import {beforeEach, describe, expect, it, vi} from 'vitest';

const axiosGet = vi.fn();
vi.mock('@/lib/axios.server', () => ({default: {get: (...a: unknown[]) => axiosGet(...a)}}));

import {NextRequest} from 'next/server';
import {GET} from '@/app/api/impex-result-download-proxy/route';

const makeRequest = (query: string) =>
    new NextRequest(`http://localhost/api/impex-result-download-proxy${query}`);

beforeEach(() => {
    axiosGet.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubEnv('API_REST_BASE_URL', 'https://api.test');
});

describe('impex-result-download-proxy GET', () => {
    it('returns 400 when id is missing', async () => {
        const res = await GET(makeRequest(''));
        expect(res.status).toBe(400);
        await expect(res.json()).resolves.toEqual({error: 'Job ID is required'});
    });

    it('fetches the job results and forwards content headers', async () => {
        axiosGet.mockResolvedValue({
            data: new Uint8Array([1, 2]),
            headers: {'content-type': 'text/csv', 'content-disposition': 'attachment; filename="export.csv"'},
        });

        const res = await GET(makeRequest('?id=42'));

        expect(axiosGet).toHaveBeenCalledWith('https://api.test/api/jobs/42/results', expect.anything());
        expect(res.status).toBe(200);
        expect(res.headers.get('Content-Type')).toBe('text/csv');
        expect(res.headers.get('Content-Disposition')).toBe('attachment; filename="export.csv"');
        expect(res.headers.get('Cache-Control')).toBe('no-store');
    });

    it('defaults content-type and content-disposition when headers are absent', async () => {
        axiosGet.mockResolvedValue({data: new Uint8Array([1]), headers: {}});

        const res = await GET(makeRequest('?id=42'));

        expect(res.headers.get('Content-Type')).toBe('application/octet-stream');
        expect(res.headers.get('Content-Disposition')).toBe('attachment; filename="result-42"');
    });

    it('maps an axios error with a response to that status', async () => {
        axiosGet.mockRejectedValue({isAxiosError: true, response: {status: 403}});
        const res = await GET(makeRequest('?id=42'));
        expect(res.status).toBe(403);
    });

    it('maps a non-axios error to 500', async () => {
        axiosGet.mockRejectedValue(new Error('boom'));
        const res = await GET(makeRequest('?id=42'));
        expect(res.status).toBe(500);
    });
});
