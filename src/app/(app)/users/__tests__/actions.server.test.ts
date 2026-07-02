import {beforeEach, describe, expect, it, vi} from "vitest";
import {
    bulkDeleteAction,
    createAction,
    getPageAction,
    searchSpexareAction,
    updateAction
} from "@/app/(app)/users/actions.server";
import {create, del, getPaged, update} from "@/lib/user";
import {getPaged as getSpexarePaged} from "@/lib/spexare";
import {revalidateTag} from "next/cache";

vi.mock("@/utils/route.server", () => ({
    withPolicyAction: (_policy: unknown, cb: () => unknown) => cb(),
}));
vi.mock("@/utils/policy.server", () => {
    const deep = new Proxy({}, {get: () => deep});
    return {Policies: deep};
});
vi.mock("next/cache", () => ({revalidateTag: vi.fn()}));

vi.mock("@/lib/user", () => ({
    getPaged: vi.fn(),
    me: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    del: vi.fn(),
    exp: vi.fn(),
    imp: vi.fn(),
    events: vi.fn(),
    getAuthorities: vi.fn(),
    addAuthorities: vi.fn(),
    removeAuthorities: vi.fn(),
    getStates: vi.fn(),
    setState: vi.fn(),
    addSpexare: vi.fn(),
    removeSpexare: vi.fn(),
    userFormSchema: {parse: (d: unknown) => d},
}));
vi.mock("@/lib/spexare", () => ({getPaged: vi.fn()}));

beforeEach(() => {
    vi.clearAllMocks();
});

describe("user getPageAction", () => {
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

describe("user create/update payload shaping", () => {
    it("strips authorityIds/stateId/spexareId before create and revalidates", async () => {
        await createAction({email: "a@b.c", authorityIds: ["1"], stateId: "s", spexareId: "x"});

        expect(create).toHaveBeenCalledWith({email: "a@b.c"});
        expect(revalidateTag).toHaveBeenCalledWith("user", "max");
    });

    it("strips authorityIds/stateId/spexareId before update and revalidates", async () => {
        await updateAction("id1", {email: "d@e.f", authorityIds: ["2"], stateId: "s2", spexareId: "y"});

        expect(update).toHaveBeenCalledWith("id1", {email: "d@e.f"});
        expect(revalidateTag).toHaveBeenCalledWith("user", "max");
    });
});

describe("user searchSpexareAction", () => {
    it("builds a Lucene filter over name fields constrained to unlinked spexare and returns items", async () => {
        vi.mocked(getSpexarePaged).mockResolvedValue({
            items: [{id: "s1"}],
            pageInfo: {hasNextPage: false, hasPreviousPage: false, startCursor: null, endCursor: null},
        } as never);

        const result = await searchSpexareAction("Ann");

        expect(getSpexarePaged).toHaveBeenCalledWith({
            first: 10,
            filter: "(firstName:*Ann* OR lastName:*Ann* OR nickName:*Ann*) AND user:NULL",
            full: false,
        });
        expect(result).toEqual([{id: "s1"}]);
    });
});

describe("user bulkDeleteAction", () => {
    it("deletes every id and revalidates once", async () => {
        await bulkDeleteAction(["a", "b"]);

        expect(del).toHaveBeenCalledTimes(2);
        expect(revalidateTag).toHaveBeenCalledTimes(1);
    });
});
