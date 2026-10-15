import {beforeEach, describe, expect, it, vi} from "vitest";
import {exportMineAction, getMineExportStatusAction, requestRemovalAction} from "@/app/(app)/my-profile/actions.server";
import {expMine, requestRemoval} from "@/lib/spexare";
import {jobStatus} from "@/lib/impex";
import {ImpexType} from "@/gql/schema";

vi.mock("@/utils/route.server", () => ({
    withPolicyAction: (_policy: unknown, cb: () => unknown) => cb(),
}));
vi.mock("@/utils/policy.server", () => {
    const deep = new Proxy({}, {get: () => deep});
    return {Policies: deep};
});
vi.mock("@/lib/spexare", () => ({
    expMine: vi.fn(),
    requestRemoval: vi.fn(),
}));
vi.mock("@/lib/impex", () => ({
    jobStatus: vi.fn(),
}));

beforeEach(() => {
    vi.clearAllMocks();
});

describe("my-profile actions", () => {
    it("exportMineAction exports the current user's spexare", async () => {
        vi.mocked(expMine).mockResolvedValue({id: "job1"});

        await expect(exportMineAction(ImpexType.Excel)).resolves.toEqual({id: "job1"});
        expect(expMine).toHaveBeenCalledWith(ImpexType.Excel);
    });

    it("getMineExportStatusAction returns the job status", async () => {
        vi.mocked(jobStatus).mockResolvedValue({id: "job1", status: "COMPLETED"} as never);

        await expect(getMineExportStatusAction("job1")).resolves.toEqual({id: "job1", status: "COMPLETED"});
        expect(jobStatus).toHaveBeenCalledWith("job1");
    });

    it("requestRemovalAction sends a trimmed reason", async () => {
        await requestRemovalAction({reason: "  Moving on  "});

        expect(requestRemoval).toHaveBeenCalledWith("Moving on");
    });

    it("requestRemovalAction sends null for a blank reason", async () => {
        await requestRemovalAction({reason: "   "});

        expect(requestRemoval).toHaveBeenCalledWith(null);
    });

    it("requestRemovalAction rejects a too long reason", async () => {
        await expect(requestRemovalAction({reason: "x".repeat(2001)})).rejects.toThrow();
        expect(requestRemoval).not.toHaveBeenCalled();
    });
});
