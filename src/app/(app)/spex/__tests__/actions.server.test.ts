import {beforeEach, describe, expect, it, vi} from 'vitest';

vi.mock('@/utils/route.server', () => ({
    withPolicyAction: (_policy: unknown, cb: () => unknown) => cb(),
}));
vi.mock('@/utils/policy.server', () => {
    const deep = new Proxy({}, {get: () => deep});
    return {Policies: deep};
});
vi.mock('next/cache', () => ({revalidateTag: vi.fn()}));

vi.mock('@/lib/spex', () => ({
    getPaged: vi.fn(),
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    del: vi.fn(),
    exp: vi.fn(),
    imp: vi.fn(),
    events: vi.fn(),
    addCategory: vi.fn(),
    removeCategory: vi.fn(),
    createRevival: vi.fn(),
    deleteRevival: vi.fn(),
    uploadPoster: vi.fn(),
    deletePoster: vi.fn(),
    spexFormSchema: {parse: (d: unknown) => d},
}));
vi.mock('@/lib/spex/category', () => ({getAll: vi.fn()}));

import {createAction, updateAction, getPageAction, bulkDeleteAction} from '@/app/(app)/spex/actions.server';
import {create, update, del, getPaged} from '@/lib/spex';
import {revalidateTag} from 'next/cache';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('spex getPageAction', () => {
    it.each([
        [true, true],
        ['true', true],
        [false, false],
        ['false', false],
        [undefined, false],
    ])('coerces full=%p to %p', async (input, expected) => {
        await getPageAction({full: input as boolean | string | undefined, first: 5});
        expect(getPaged).toHaveBeenCalledWith(expect.objectContaining({full: expected, first: 5}));
    });
});

describe('spex create/update payload shaping', () => {
    it('strips categoryId and revivalYears before create and revalidates', async () => {
        await createAction({title: 'X', year: '2024', categoryId: 'c1', revivalYears: ['2000']});

        expect(create).toHaveBeenCalledWith({title: 'X', year: '2024'});
        expect(revalidateTag).toHaveBeenCalledWith('spex', 'max');
    });

    it('strips categoryId and revivalYears before update and revalidates', async () => {
        await updateAction('id1', {title: 'Y', year: '2025', categoryId: 'c2', revivalYears: ['2001']});

        expect(update).toHaveBeenCalledWith('id1', {title: 'Y', year: '2025'});
        expect(revalidateTag).toHaveBeenCalledWith('spex', 'max');
    });
});

describe('spex bulkDeleteAction', () => {
    it('deletes every id and revalidates once', async () => {
        await bulkDeleteAction(['a', 'b', 'c']);

        expect(del).toHaveBeenCalledTimes(3);
        expect(del).toHaveBeenCalledWith('a');
        expect(del).toHaveBeenCalledWith('c');
        expect(revalidateTag).toHaveBeenCalledTimes(1);
    });
});
