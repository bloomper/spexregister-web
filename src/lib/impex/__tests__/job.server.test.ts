import {beforeEach, describe, expect, it, vi} from "vitest";
import {del, job, jobs, jobStatus} from "@/lib/impex/job.server";

const toPromise = vi.fn();
const query = vi.fn<(...args: unknown[]) => { toPromise: typeof toPromise }>(() => ({toPromise}));
const mutation = vi.fn<(...args: unknown[]) => { toPromise: typeof toPromise }>(() => ({toPromise}));
vi.mock("@/lib/urql.server", () => ({getClient: () => ({query, mutation})}));
vi.mock("@/lib/axios.server", () => ({default: {}}));

beforeEach(() => {
    toPromise.mockReset();
    query.mockClear();
    mutation.mockClear();
});

describe("job read helpers", () => {
    it("jobStatus returns the status or null", async () => {
        toPromise.mockResolvedValueOnce({data: {jobStatus: {id: "j1"}}});
        await expect(jobStatus("j1")).resolves.toEqual({id: "j1"});
        toPromise.mockResolvedValueOnce({data: {}});
        await expect(jobStatus("j1")).resolves.toBeNull();
    });

    it("job returns the job or null", async () => {
        toPromise.mockResolvedValueOnce({data: {job: {id: "j1"}}});
        await expect(job("j1")).resolves.toEqual({id: "j1"});
        toPromise.mockResolvedValueOnce({data: {}});
        await expect(job("j1")).resolves.toBeNull();
    });

    it("jobs returns the list, defaulting to empty", async () => {
        toPromise.mockResolvedValueOnce({data: {jobs: [{id: "j1"}]}});
        await expect(jobs()).resolves.toEqual([{id: "j1"}]);
        toPromise.mockResolvedValueOnce({data: {}});
        await expect(jobs()).resolves.toEqual([]);
    });
});

describe("job del", () => {
    it("returns the delete payload", async () => {
        toPromise.mockResolvedValue({data: {jobDelete: true}});
        await expect(del("j1")).resolves.toBe(true);
    });

    it("propagates mutation errors", async () => {
        toPromise.mockResolvedValue({error: new Error("denied")});
        await expect(del("j1")).rejects.toThrow("denied");
    });
});
