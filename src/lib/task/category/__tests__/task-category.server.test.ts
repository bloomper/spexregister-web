import {beforeEach, describe, expect, it, vi} from "vitest";
import {getPaged} from "@/lib/task/category/task-category.server";
import {SortDirection} from "@/gql/schema";

const toPromise = vi.fn();
const query = vi.fn<(...args: unknown[]) => { toPromise: typeof toPromise }>(() => ({toPromise}));
const mutation = vi.fn<(...args: unknown[]) => { toPromise: typeof toPromise }>(() => ({toPromise}));
vi.mock("@/lib/urql.server", () => ({getClient: () => ({query, mutation})}));
vi.mock("@/lib/axios.server", () => ({default: {}}));

const connection = (nodes: { id: string }[], hasNextPage: boolean, endCursor: string | null) => ({
    edges: nodes.map((node, i) => ({cursor: `c${i}`, node})),
    pageInfo: {hasNextPage, hasPreviousPage: false, startCursor: "c0", endCursor},
});

beforeEach(() => {
    toPromise.mockReset();
    query.mockClear();
});

describe("task-category.server (factory config binding)", () => {
    it("applies task-category-specific defaults and maps the connection", async () => {
        toPromise.mockResolvedValue({data: {taskCategoryPaged: connection([{id: "1"}], false, null)}});
        const page = await getPaged({});
        expect(page.items).toEqual([{id: "1"}]);
        const vars = query.mock.calls[0][1] as Record<string, unknown>;
        expect(vars).toMatchObject({sort: ["name"], direction: SortDirection.Asc, filter: ""});
    });

    it("propagates query errors", async () => {
        toPromise.mockResolvedValue({error: new Error("boom")});
        await expect(getPaged({})).rejects.toThrow("boom");
    });
});
