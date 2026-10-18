import {beforeEach, describe, expect, it, vi} from "vitest";
import {getEditQueueOptions} from "@/app/(app)/edit-queue/actions.server";
import {withPolicyAction} from "@/utils/route.server";
import {Policies} from "@/utils/policy.server";
import {getCountries, getTypes} from "@/lib/settings";

vi.mock("@/utils/route.server", () => ({
    withPolicyAction: vi.fn((_policy: unknown, cb: () => unknown) => cb()),
}));
vi.mock("@/utils/policy.server", () => ({
    Policies: {
        spexare: {requireUpdate: "spexare.update"},
        spex: {requireUpdate: "spex.update"},
        task: {requireUpdate: "task.update"},
        user: {requireUpdate: "user.update"},
    },
}));
vi.mock("next-intl/server", () => ({getLocale: async () => "en"}));
vi.mock("@/lib/settings", () => ({getTypes: vi.fn(async () => ["type"]), getCountries: vi.fn(async () => ["country"])}));
vi.mock("@/lib/tag", () => ({getAll: async () => ["tag"]}));
vi.mock("@/lib/task", () => ({getAll: async () => ["task"]}));
vi.mock("@/lib/task/category", () => ({getAll: async () => ["taskCategory"]}));
vi.mock("@/lib/spex", () => ({getAll: async () => ["spex"]}));
vi.mock("@/lib/spex/category", () => ({getAll: async () => ["spexCategory"]}));
vi.mock("@/lib/user", () => ({getAuthorities: async () => ["authority"], getStates: async () => ["state"]}));

const empty = {
    types: [], countries: [], tags: [], tasks: [], taskCategories: [],
    spex: [], spexCategories: [], authorities: [], states: [],
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe("getEditQueueOptions", () => {
    it("loads every spexare option in the request locale", async () => {
        const options = await getEditQueueOptions("spexare");

        expect(withPolicyAction).toHaveBeenCalledWith(Policies.spexare.requireUpdate, expect.any(Function));
        expect(getTypes).toHaveBeenCalledWith("en");
        expect(getCountries).toHaveBeenCalledWith("en");
        expect(options).toEqual({
            ...empty,
            types: ["type"], countries: ["country"], tags: ["tag"], tasks: ["task"],
            taskCategories: ["taskCategory"], spex: ["spex"], spexCategories: ["spexCategory"],
        });
    });

    it.each([
        ["spex", Policies.spex.requireUpdate, {spexCategories: ["spexCategory"]}],
        ["task", Policies.task.requireUpdate, {taskCategories: ["taskCategory"]}],
        ["user", Policies.user.requireUpdate, {authorities: ["authority"], states: ["state"]}],
    ] as const)("loads only what the %s form needs, under its own policy", async (entityType, policy, expected) => {
        const options = await getEditQueueOptions(entityType);

        expect(withPolicyAction).toHaveBeenCalledWith(policy, expect.any(Function));
        expect(options).toEqual({...empty, ...expected});
        expect(getTypes).not.toHaveBeenCalled();
    });

    it("returns empty options for an entity without any", async () => {
        const options = await getEditQueueOptions("tag");

        expect(options).toEqual(empty);
        expect(withPolicyAction).not.toHaveBeenCalled();
    });
});
