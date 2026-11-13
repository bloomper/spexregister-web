import {beforeEach, describe, expect, it, vi} from "vitest";
import {getPageAction} from "@/app/(app)/spex/actions.server";
import {getPaged} from "@/lib/spex";

vi.mock("@/utils/route.server", () => ({
    withPolicyAction: (_policy: unknown, cb: () => unknown) => cb(),
}));
vi.mock("@/utils/policy.server", () => {
    const deep = new Proxy({}, {get: () => deep});
    return {Policies: deep};
});
vi.mock("next/cache", () => ({revalidateTag: vi.fn()}));

vi.mock("@/lib/spex", () => ({
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
vi.mock("@/lib/spex/category", () => ({getAll: vi.fn()}));

beforeEach(() => {
    vi.clearAllMocks();
});

describe("spex getPageAction", () => {
    it.each([
        [true, true],
        ["true", true],
        [false, false],
        ["false", false],
        [undefined, false],
    ])("coerces full=%p to %p", async (input, expected) => {
        await getPageAction({full: input as boolean | string | undefined, first: 5});
        expect(getPaged).toHaveBeenCalledWith(expect.objectContaining({full: expected, first: 5}));
    });
});

