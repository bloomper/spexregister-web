import { beforeEach, describe, expect, it, vi } from "vitest";
import { getPaged } from "@/lib/spex/spex.server";
import { SortDirection } from "@/gql/schema";

const toPromise = vi.fn();
const query = vi.fn<(...args: unknown[]) => { toPromise: typeof toPromise }>(() => ({ toPromise }));
const mutation = vi.fn<(...args: unknown[]) => { toPromise: typeof toPromise }>(() => ({ toPromise }));
vi.mock("@/lib/urql.server", () => ({ getClient: () => ({ query, mutation }) }));
const axiosPut = vi.fn();
const axiosDelete = vi.fn();
vi.mock("@/lib/axios.server", () => ({
  default: {
    put: (...a: unknown[]) => axiosPut(...a),
    delete: (...a: unknown[]) => axiosDelete(...a),
  },
}));

const connection = (nodes: { id: string }[], hasNextPage: boolean, endCursor: string | null) => ({
  edges: nodes.map((node, i) => ({ cursor: `c${i}`, node })),
  pageInfo: { hasNextPage, hasPreviousPage: false, startCursor: "c0", endCursor },
});

beforeEach(() => {
  toPromise.mockReset();
  query.mockClear();
  mutation.mockClear();
  axiosPut.mockReset();
  axiosDelete.mockReset();
});

// Generic CRUD/impex mechanics live in graphql.server.test.ts. Here we
// verify spex's own config binding and its bespoke (non-factory) operations.
describe("spex.server (factory config binding)", () => {
  it("applies spex-specific defaults and maps the connection into a page", async () => {
    toPromise.mockResolvedValue({ data: { spexPaged: connection([{ id: "1" }, { id: "2" }], true, "c1") } });

    const page = await getPaged({});

    expect(page.items).toEqual([{ id: "1" }, { id: "2" }]);
    const vars = query.mock.calls[0][1] as Record<string, unknown>;
    expect(vars).toMatchObject({ sort: ["year"], direction: SortDirection.Desc, filter: "parent:NULL" });
  });

  it("propagates query errors", async () => {
    toPromise.mockResolvedValue({ error: new Error("graphql failed") });
    await expect(getPaged({})).rejects.toThrow("graphql failed");
  });
});
