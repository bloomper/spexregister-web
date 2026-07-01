import {beforeEach, describe, expect, it, vi} from 'vitest';

vi.mock('@/utils/route.server', () => ({
    withPolicyAction: (_policy: unknown, cb: () => unknown) => cb(),
}));
vi.mock('@/utils/policy.server', () => {
    const deep = new Proxy({}, {get: () => deep});
    return {Policies: deep};
});
vi.mock('next/cache', () => ({revalidateTag: vi.fn()}));

vi.mock('@/lib/task', () => ({
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
    taskFormSchema: {parse: (d: unknown) => d},
}));
vi.mock('@/lib/task/category', () => ({getAll: vi.fn()}));

import {createAction, updateAction, getPageAction, bulkDeleteAction} from '@/app/(app)/tasks/actions.server';
import {create, update, del, getPaged} from '@/lib/task';
import {revalidateTag} from 'next/cache';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('task getPageAction', () => {
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

describe('task create/update payload shaping', () => {
    it('strips categoryId before create and revalidates', async () => {
        await createAction({name: 'X', categoryId: 'c1'});

        expect(create).toHaveBeenCalledWith({name: 'X'});
        expect(revalidateTag).toHaveBeenCalledWith('task', 'max');
    });

    it('strips categoryId before update and revalidates', async () => {
        await updateAction('id1', {name: 'Y', categoryId: 'c2'});

        expect(update).toHaveBeenCalledWith('id1', {name: 'Y'});
        expect(revalidateTag).toHaveBeenCalledWith('task', 'max');
    });
});

describe('task bulkDeleteAction', () => {
    it('deletes every id and revalidates once', async () => {
        await bulkDeleteAction(['a', 'b']);

        expect(del).toHaveBeenCalledTimes(2);
        expect(revalidateTag).toHaveBeenCalledTimes(1);
    });
});
