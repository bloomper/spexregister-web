import {beforeEach, describe, expect, it, vi} from "vitest";
import {getMaintenanceJobs, runMaintenanceJob} from "@/lib/admin/admin.server";
import {MaintenanceJob} from "@/gql/schema";

const runQuery = vi.fn();
const runMutationField = vi.fn();
vi.mock("@/lib/graphql.server", () => ({
    runQuery: (...args: unknown[]) => runQuery(...args),
    runMutationField: (...args: unknown[]) => runMutationField(...args),
}));

beforeEach(() => {
    runQuery.mockReset();
    runMutationField.mockReset();
});

describe("admin.server", () => {
    it("getMaintenanceJobs returns the jobs", async () => {
        runQuery.mockResolvedValue({maintenanceJobs: [{job: MaintenanceJob.UserSync, running: true}]});

        expect(await getMaintenanceJobs()).toEqual([{job: MaintenanceJob.UserSync, running: true}]);
    });

    it("getMaintenanceJobs is empty when nothing comes back", async () => {
        runQuery.mockResolvedValue(undefined);

        expect(await getMaintenanceJobs()).toEqual([]);
    });

    it("runMaintenanceJob passes the job and reads the result", async () => {
        runMutationField.mockResolvedValueOnce(true).mockResolvedValueOnce(false);

        expect(await runMaintenanceJob(MaintenanceJob.JobCleanup)).toBe(true);
        expect(await runMaintenanceJob(MaintenanceJob.JobCleanup)).toBe(false);
        expect(runMutationField.mock.calls[0][1]).toEqual({job: MaintenanceJob.JobCleanup});
        expect(runMutationField.mock.calls[0][2]).toBe("maintenanceJobRun");
    });
});
