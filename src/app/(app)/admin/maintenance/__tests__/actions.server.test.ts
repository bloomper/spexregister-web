import {beforeEach, describe, expect, it, vi} from "vitest";
import {indexSpexareAction} from "@/app/(app)/admin/maintenance/actions.server";
import {indexSpexare} from "@/lib/admin";

vi.mock("@/utils/route.server", () => ({
    withPolicyAction: (_policy: unknown, cb: () => unknown) => cb(),
}));
vi.mock("@/utils/policy.server", () => {
    const deep = new Proxy({}, {get: () => deep});
    return {Policies: deep};
});
vi.mock("@/lib/admin", () => ({
    indexSpexare: vi.fn(),
}));

beforeEach(() => {
    vi.clearAllMocks();
});

describe("admin actions", () => {
    it("indexSpexareAction starts indexing", async () => {
        await indexSpexareAction();

        expect(indexSpexare).toHaveBeenCalledTimes(1);
    });
});
