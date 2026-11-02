import {beforeEach, describe, expect, it, vi} from "vitest";
import {getMaintenanceJobsAction, runMaintenanceJobAction} from "@/app/(app)/admin/maintenance/actions.server";
import {getMaintenanceJobs, runMaintenanceJob} from "@/lib/admin";
import {MaintenanceJob} from "@/gql/schema";

vi.mock("@/utils/route.server", () => ({
    withPolicyAction: (_policy: unknown, cb: () => unknown) => cb(),
}));
vi.mock("@/utils/policy.server", () => {
    const deep = new Proxy({}, {get: () => deep});
    return {Policies: deep};
});
vi.mock("@/lib/admin", () => ({
    getMaintenanceJobs: vi.fn(),
    runMaintenanceJob: vi.fn(),
}));

beforeEach(() => {
    vi.clearAllMocks();
});

describe("admin actions", () => {
    it("runMaintenanceJobAction starts the job", async () => {
        vi.mocked(runMaintenanceJob).mockResolvedValue(true);

        expect(await runMaintenanceJobAction(MaintenanceJob.UserSync)).toBe(true);
        expect(runMaintenanceJob).toHaveBeenCalledWith(MaintenanceJob.UserSync);
    });

    it("getMaintenanceJobsAction returns the jobs", async () => {
        vi.mocked(getMaintenanceJobs).mockResolvedValue([{job: MaintenanceJob.SearchIndex, running: false}]);

        expect(await getMaintenanceJobsAction()).toEqual([{job: MaintenanceJob.SearchIndex, running: false}]);
    });
});
