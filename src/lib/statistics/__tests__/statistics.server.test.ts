import {beforeEach, describe, expect, it, vi} from "vitest";
import {get} from "@/lib/statistics/statistics.server";

const toPromise = vi.fn();
const query = vi.fn<(...args: unknown[]) => { toPromise: typeof toPromise }>(() => ({toPromise}));
const mutation = vi.fn<(...args: unknown[]) => { toPromise: typeof toPromise }>(() => ({toPromise}));
vi.mock("@/lib/urql.server", () => ({getClient: () => ({query, mutation})}));
vi.mock("@/lib/axios.server", () => ({default: {}}));

beforeEach(() => {
    toPromise.mockReset();
    query.mockClear();
});

describe("statistics.get", () => {
    it("returns the statistics payload", async () => {
        toPromise.mockResolvedValue({data: {statistics: {spexCount: 5}}});
        await expect(get()).resolves.toEqual({spexCount: 5});
    });

    it("returns undefined when absent", async () => {
        toPromise.mockResolvedValue({data: {}});
        await expect(get()).resolves.toBeUndefined();
    });

    it("propagates query errors", async () => {
        toPromise.mockResolvedValue({error: new Error("boom")});
        await expect(get()).rejects.toThrow("boom");
    });
});
