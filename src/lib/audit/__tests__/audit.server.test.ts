import {beforeEach, describe, expect, it, vi} from "vitest";
import {getRestorePreview, getRevisionFeedPaged, getRevisions, restore} from "@/lib/audit/audit.server";
import {AuditedType, RevisionType} from "@/gql/schema";

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

describe("getRevisions", () => {
    it("forwards the audited type and id, and returns the list", async () => {
        toPromise.mockResolvedValue({
            data: {
                revisions: [{
                    revision: 2,
                    type: AuditedType.Tag,
                    entityId: 1,
                    revisionType: RevisionType.Mod,
                    modifiedAt: "2026-09-08T14:02:00Z",
                    modifiedBy: "anna@spexregister.com",
                    changes: [{field: "name", oldValue: "a", newValue: "b", binary: false}],
                }],
            },
        });

        const result = await getRevisions(AuditedType.Tag, "1");

        expect(result).toHaveLength(1);
        expect(result[0].changes[0].field).toBe("name");
        expect(query.mock.calls[0][1]).toMatchObject({type: AuditedType.Tag, id: "1"});
    });

    it("defaults to an empty list", async () => {
        toPromise.mockResolvedValue({data: {}});
        await expect(getRevisions(AuditedType.Tag, "1")).resolves.toEqual([]);
    });

    it("propagates query errors", async () => {
        toPromise.mockResolvedValue({error: new Error("boom")});
        await expect(getRevisions(AuditedType.Tag, "1")).rejects.toThrow("boom");
    });
});

describe("getRevisionFeedPaged", () => {
    it("maps the connection and nulls out omitted arguments", async () => {
        toPromise.mockResolvedValue({
            data: {
                revisionFeedPaged: {
                    edges: [{
                        cursor: "c0",
                        node: {revision: 3, modifiedAt: "x", modifiedBy: "y", types: [AuditedType.Tag]}
                    }],
                    pageInfo: {hasNextPage: false, hasPreviousPage: false, startCursor: "c0", endCursor: "c0"},
                    totalCount: 1,
                },
            },
        });

        const page = await getRevisionFeedPaged({first: 10});

        expect(page.items).toHaveLength(1);
        expect(page.totalCount).toBe(1);
        expect(query.mock.calls[0][1]).toMatchObject({first: 10, after: null, type: null, sinceInDays: null});
    });
});

describe("getRestorePreview", () => {
    it("returns the preview", async () => {
        toPromise.mockResolvedValue({data: {restorePreview: {entries: [], warnings: []}}});

        await expect(getRestorePreview(AuditedType.Spexare, "1", 5, true)).resolves.toEqual({
            entries: [],
            warnings: []
        });
        expect(query.mock.calls[0][1]).toMatchObject({type: AuditedType.Spexare, id: "1", revision: 5, cascade: true});
    });

    it("throws when the preview is missing", async () => {
        toPromise.mockResolvedValue({data: {}});
        await expect(getRestorePreview(AuditedType.Spexare, "1", 5, false)).rejects.toThrow("No restore preview returned");
    });
});

describe("restore", () => {
    it("returns the result of the mutation", async () => {
        toPromise.mockResolvedValue({
            data: {restore: {revision: 5, updated: 1, created: 0, deleted: 0, warnings: []}},
        });

        const result = await restore(AuditedType.Tag, "1", 5, false);

        expect(result.updated).toBe(1);
        expect(mutation.mock.calls[0][1]).toMatchObject({type: AuditedType.Tag, id: "1", revision: 5, cascade: false});
    });
});
