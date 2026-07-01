import {beforeEach, describe, expect, it, vi} from 'vitest';

vi.mock('@/utils/route.server', () => ({
    withPolicyAction: (_policy: unknown, cb: () => unknown) => cb(),
}));
vi.mock('@/utils/policy.server', () => {
    const deep = new Proxy({}, {get: () => deep});
    return {Policies: deep};
});
vi.mock('next/cache', () => ({revalidateTag: vi.fn()}));

vi.mock('@/lib/spex/category', () => ({
    getPaged: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    del: vi.fn(),
    exp: vi.fn(),
    imp: vi.fn(),
    events: vi.fn(),
    uploadLogo: vi.fn(),
    deleteLogo: vi.fn(),
    spexCategoryFormSchema: {parse: (d: unknown) => d},
}));

import {getPageAction, bulkDeleteAction} from '@/app/(app)/spex/categories/actions.server';
import {del, getPaged} from '@/lib/spex/category';
import {revalidateTag} from 'next/cache';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('spex-category getPageAction', () => {
    it.each([
        [true, true],
        ['true', true],
        [false, false],
        ['false', false],
        [undefined, false],
    ])('coerces full=%p to %p', async (input, expected) => {
        await getPageAction({full: input as boolean | string | undefined});
        expect(getPaged).toHaveBeenCalledWith(expect.objectContaining({full: expected}));
    });
});

describe('spex-category bulkDeleteAction', () => {
    it('deletes every id and revalidates once', async () => {
        await bulkDeleteAction(['a', 'b']);
        expect(del).toHaveBeenCalledTimes(2);
        expect(revalidateTag).toHaveBeenCalledTimes(1);
    });
});
