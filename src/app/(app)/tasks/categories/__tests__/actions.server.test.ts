import {beforeEach, describe, expect, it, vi} from "vitest";
import {bulkDeleteAction, getPageAction} from "@/app/(app)/tasks/categories/actions.server";
import {del, getPaged} from "@/lib/task/category";
import {revalidateTag} from "next/cache";

vi.mock("@/utils/route.server", () => ({
    withPolicyAction: (_policy: unknown, cb: () => unknown) => cb(),
}));
vi.mock("@/utils/policy.server", () => {
    const deep = new Proxy({}, {get: () => deep});
    return {Policies: deep};
});
vi.mock("next/cache", () => ({revalidateTag: vi.fn()}));

vi.mock("@/lib/task/category", () => ({
    getPaged: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    del: vi.fn(),
    exp: vi.fn(),
    imp: vi.fn(),
    events: vi.fn(),
    taskCategoryFormSchema: {parse: (d: unknown) => d},
}));

beforeEach(() => {
    vi.clearAllMocks();
});

describe("task-category getPageAction", () => {
    it.each([
        [true, true],
        ["true", true],
        [false, false],
        ["false", false],
        [undefined, false],
    ])("coerces full=%p to %p", async (input, expected) => {
        await getPageAction({full: input as boolean | string | undefined});
        expect(getPaged).toHaveBeenCalledWith(expect.objectContaining({full: expected}));
    });
});

describe("task-category bulkDeleteAction", () => {
    it("deletes every id and revalidates once", async () => {
        await bulkDeleteAction(["a", "b"]);
        expect(del).toHaveBeenCalledTimes(2);
        expect(revalidateTag).toHaveBeenCalledTimes(1);
    });
});
