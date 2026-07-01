import {beforeEach, describe, expect, it, vi} from 'vitest';

const toPromise = vi.fn();
const mutation = vi.fn<(...args: unknown[]) => {toPromise: typeof toPromise}>(() => ({toPromise}));
vi.mock('@/lib/urql.server', () => ({getClient: () => ({query: vi.fn(), mutation})}));
vi.mock('@/lib/axios.server', () => ({default: {}}));

import * as consent from '@/lib/spexare/consent/consent.server';
import * as tagging from '@/lib/spexare/tagging/tagging.server';

beforeEach(() => {
    toPromise.mockReset();
    mutation.mockClear();
});

describe('consent (input + missing-data shape)', () => {
    it('create forwards ids/input and returns the created entity', async () => {
        toPromise.mockResolvedValue({data: {consentCreate: {id: 'c1'}}});

        await expect(consent.create('s1', 't1', {value: true} as never)).resolves.toEqual({id: 'c1'});
        expect(mutation.mock.calls[0][1]).toEqual({spexareId: 's1', typeId: 't1', input: {value: true}});
    });

    it('create throws "No data created" when the field is absent', async () => {
        toPromise.mockResolvedValue({data: {}});
        await expect(consent.create('s1', 't1', {} as never)).rejects.toThrow('No data created');
    });

    it('update injects the id and throws "No data updated" when absent', async () => {
        toPromise.mockResolvedValueOnce({data: {consentUpdate: {id: 'c1'}}});
        await consent.update('s1', 't1', 'c1', {value: false} as never);
        expect(mutation.mock.calls[0][1]).toEqual({spexareId: 's1', typeId: 't1', input: {value: false, id: 'c1'}});

        toPromise.mockResolvedValueOnce({data: {}});
        await expect(consent.update('s1', 't1', 'c1', {} as never)).rejects.toThrow('No data updated');
    });

    it('del returns the delete payload', async () => {
        toPromise.mockResolvedValue({data: {consentDelete: true}});
        await expect(consent.del('s1', 't1', 'c1')).resolves.toBe(true);
    });

    it('propagates GraphQL errors', async () => {
        toPromise.mockResolvedValue({error: new Error('denied')});
        await expect(consent.del('s1', 't1', 'c1')).rejects.toThrow('denied');
    });
});

describe('tagging (scalar, no missing-data check)', () => {
    it('create returns the boolean payload without throwing on falsy', async () => {
        toPromise.mockResolvedValue({data: {taggingCreate: true}});
        await expect(tagging.create('s1', 'tag1')).resolves.toBe(true);
        expect(mutation.mock.calls[0][1]).toEqual({spexareId: 's1', tagId: 'tag1'});
    });

    it('del returns the boolean payload', async () => {
        toPromise.mockResolvedValue({data: {taggingDelete: true}});
        await expect(tagging.del('s1', 'tag1')).resolves.toBe(true);
    });
});
