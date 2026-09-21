import {beforeEach, describe, expect, it, vi} from "vitest";
import {get, getSummary} from "@/lib/analytics/analytics.server";

const toPromise = vi.fn();
const query = vi.fn<(...args: unknown[]) => { toPromise: typeof toPromise }>(() => ({toPromise}));
const mutation = vi.fn<(...args: unknown[]) => { toPromise: typeof toPromise }>(() => ({toPromise}));
vi.mock("@/lib/urql.server", () => ({getClient: () => ({query, mutation})}));
vi.mock("@/lib/axios.server", () => ({default: {}}));

beforeEach(() => {
    toPromise.mockReset();
    query.mockClear();
});

describe("analytics.get", () => {
    it("returns the analytics payload", async () => {
        toPromise.mockResolvedValue({data: {analytics: {total: 12}}});
        await expect(get()).resolves.toEqual({total: 12});
    });

    it("returns undefined when absent", async () => {
        toPromise.mockResolvedValue({data: {}});
        await expect(get()).resolves.toBeUndefined();
    });

    it("keeps a section the backend withheld as null", async () => {
        toPromise.mockResolvedValue({data: {analytics: {total: 12, operations: null}}});
        await expect(get()).resolves.toEqual({total: 12, operations: null});
    });

    it("propagates query errors", async () => {
        toPromise.mockResolvedValue({error: new Error("boom")});
        await expect(get()).rejects.toThrow("boom");
    });

    it("carries the headline counts the statistics query used to return", async () => {
        toPromise.mockResolvedValue({data: {analytics: {totals: {spexareCount: 3, taskCount: 5}}}});
        await expect(get()).resolves.toEqual({totals: {spexareCount: 3, taskCount: 5}});
    });
});

describe("analytics.getSummary", () => {
    it("asks for a narrower selection than the full dashboard", async () => {
        toPromise.mockResolvedValue({data: {analytics: {totals: {spexareCount: 3}}}});
        await getSummary();

        const summaryDocument = JSON.stringify(query.mock.calls.at(-1)?.[0]);
        expect(summaryDocument).toContain("AnalyticsSummary");
        // The revision-table queries behind `operations` are the point of not asking for it.
        expect(summaryDocument).not.toContain("operations");
    });

    it("returns the payload", async () => {
        toPromise.mockResolvedValue({data: {analytics: {totals: {spexareCount: 3}}}});
        await expect(getSummary()).resolves.toEqual({totals: {spexareCount: 3}});
    });
});
