import { beforeEach, describe, expect, it, vi } from "vitest";
import { getPaged } from "@/lib/task/task.server";
import { SortDirection } from "@/gql/schema";

const toPromise = vi.fn();
const query = vi.fn<(...args: unknown[]) => { toPromise: typeof toPromise }>(() => ({ toPromise }));
const mutation = vi.fn<(...args: unknown[]) => { toPromise: typeof toPromise }>(() => ({ toPromise }));
vi.mock("@/lib/urql.server", () => ({ getClient: () => ({ query, mutation }) }));
vi.mock("@/lib/axios.server", () => ({ default: {} }));

const connection = (nodes: { id: string }[], hasNextPage: boolean, endCursor: string | null) => ({
  edges: nodes.map((node, i) => ({ cursor: `c${i}`, node })),
  pageInfo: { hasNextPage, hasPreviousPage: false, startCursor: "c0", endCursor },
});

beforeEach(() => {
  toPromise.mockReset();
  query.mockClear();
  mutation.mockClear();
});

describe("task.server (factory config binding)", () => {
  it("applies task-specific defaults", async () => {
    toPromise.mockResolvedValue({ data: { taskPaged: connection([{ id: "1" }], false, null) } });
    await getPaged({});
    const vars = query.mock.calls[0][1] as Record<string, unknown>;
    expect(vars).toMatchObject({ sort: ["name"], direction: SortDirection.Asc, filter: "" });
  });
});
