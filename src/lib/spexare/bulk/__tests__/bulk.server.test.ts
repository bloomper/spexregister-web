import {beforeEach, describe, expect, it, vi} from "vitest";
import {apply, preview} from "@/lib/spexare/bulk/bulk.server";
import {SpexareBulkInput, SpexareBulkOperation} from "@/gql/schema";

const toPromise = vi.fn();
const query = vi.fn<(...args: unknown[]) => { toPromise: typeof toPromise }>(() => ({toPromise}));
const mutation = vi.fn<(...args: unknown[]) => { toPromise: typeof toPromise }>(() => ({toPromise}));
vi.mock("@/lib/urql.server", () => ({getClient: () => ({query, mutation})}));
vi.mock("@/lib/axios.server", () => ({default: {}}));

const input: SpexareBulkInput = {
    target: {ids: ["1", "2"]},
    operation: SpexareBulkOperation.TagAdd,
    tags: ["7"],
};

const result = {
    operation: SpexareBulkOperation.TagAdd,
    requested: 2,
    applied: 1,
    unchanged: 1,
    blocked: 0,
    entries: [],
};

beforeEach(() => {
    toPromise.mockReset();
    query.mockClear();
    mutation.mockClear();
});

describe("bulk preview", () => {
    it("returns the result and does not cache it", async () => {
        toPromise.mockResolvedValue({data: {spexareBulkPreview: result}});

        await expect(preview(input)).resolves.toEqual(result);

        const context = query.mock.calls[0][2] as { fetchOptions?: { cache?: string } };
        expect(context.fetchOptions?.cache).toBe("no-store");
    });

    it("throws when the backend returns nothing", async () => {
        toPromise.mockResolvedValue({data: {spexareBulkPreview: null}});
        await expect(preview(input)).rejects.toThrow("No preview returned");
    });

    it("propagates query errors", async () => {
        toPromise.mockResolvedValue({error: new Error("boom")});
        await expect(preview(input)).rejects.toThrow("boom");
    });
});

describe("bulk apply", () => {
    it("sends the reason as X-Audit-Reason so the revision records why", async () => {
        toPromise.mockResolvedValue({data: {spexareBulkApply: result}});

        await expect(apply(input, "Massåtgärd: Lägg till taggar")).resolves.toEqual(result);

        const context = mutation.mock.calls[0][2] as { fetchOptions?: { headers?: Record<string, string> } };
        expect(decodeURIComponent(context.fetchOptions?.headers?.["X-Audit-Reason"] ?? "")).toBe("Massåtgärd: Lägg till taggar");
    });

    it("sends no audit header when there is no reason", async () => {
        toPromise.mockResolvedValue({data: {spexareBulkApply: result}});

        await apply(input);

        expect(mutation.mock.calls[0][2]).toBeUndefined();
    });

    it("throws when nothing comes back", async () => {
        toPromise.mockResolvedValue({data: {spexareBulkApply: null}});
        await expect(apply(input)).rejects.toThrow("No data updated");
    });
});
