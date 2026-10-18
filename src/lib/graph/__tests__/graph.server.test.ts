import {beforeEach, describe, expect, it, vi} from "vitest";
import {getNeighbourhood, getNeighbours, search} from "@/lib/graph/graph.server";
import {GraphEdgeType, GraphNodeType} from "@/gql/schema";

const runQuery = vi.fn();
vi.mock("@/lib/graphql.server", () => ({runQuery: (...args: unknown[]) => runQuery(...args)}));

beforeEach(() => {
    runQuery.mockReset();
});

describe("graph.server", () => {
    it("search defaults to ten hits and an empty list", async () => {
        runQuery.mockResolvedValue(undefined);

        expect(await search("ada")).toEqual([]);
        expect(runQuery.mock.calls[0][1]).toEqual({q: "ada", first: 10});
    });

    it("getNeighbourhood is null when the node is unknown", async () => {
        runQuery.mockResolvedValue({graphNeighbourhood: null});

        expect(await getNeighbourhood(GraphNodeType.Spexare, "1")).toBeNull();
        expect(runQuery.mock.calls[0][1]).toEqual({type: GraphNodeType.Spexare, id: "1", first: 25});
    });

    it("getNeighbours flattens the connection and drops empty edges", async () => {
        runQuery.mockResolvedValue({
            graphNeighboursPaged: {
                edges: [{cursor: "a", node: {id: "n1"}}, null, {cursor: "b", node: null}],
                pageInfo: {hasNextPage: true, endCursor: "a"},
                totalCount: 7,
            },
        });

        const page = await getNeighbours({type: GraphNodeType.Spex, id: "1", edge: GraphEdgeType.Participation});

        expect(page).toEqual({nodes: [{id: "n1"}], endCursor: "a", hasNextPage: true, totalCount: 7});
        expect(runQuery.mock.calls[0][1]).toMatchObject({first: 25, after: null});
    });

    it("getNeighbours is an empty last page when nothing comes back", async () => {
        runQuery.mockResolvedValue(undefined);

        expect(await getNeighbours({type: GraphNodeType.Spex, id: "1", edge: GraphEdgeType.Participation}))
            .toEqual({nodes: [], endCursor: null, hasNextPage: false, totalCount: 0});
    });
});
