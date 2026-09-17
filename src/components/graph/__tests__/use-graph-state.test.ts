import {describe, expect, it} from "vitest";
import {GraphEdgeType, GraphNeighbourhood, GraphNodeType} from "@/gql/schema";
import {GraphState, mergeNeighbourhood, mergeNodes} from "@/components/graph/use-graph-state.client";

const EMPTY: GraphState = {nodes: [], edges: [], pending: []};

const node = (id: string, type: GraphNodeType, label: string) =>
    ({id, type, label, sublabel: null, entityId: id.split(":")[1]}) as never;

const neighbourhood = (origin: ReturnType<typeof node>, groups: unknown[]): GraphNeighbourhood =>
    ({origin, groups}) as unknown as GraphNeighbourhood;

const ada = node("SPEXARE:1", GraphNodeType.Spexare, "Ada Lovelace");
const bacchus = node("SPEX:100", GraphNodeType.Spex, "Bacchus");
const caesar = node("SPEX:101", GraphNodeType.Spex, "Caesar");

const adaNeighbourhood = neighbourhood(ada, [{
    type: GraphEdgeType.Participation,
    totalCount: 1,
    nodes: [caesar],
    edges: [{id: "e1", source: "SPEXARE:1", target: "SPEX:101", type: GraphEdgeType.Participation, label: "2015"}],
}]);

describe("mergeNeighbourhood", () => {
    it("adds the origin and its neighbours", () => {
        const state = mergeNeighbourhood(EMPTY, adaNeighbourhood);

        expect(state.nodes.map((n) => n.id)).toEqual(["SPEXARE:1", "SPEX:101"]);
        expect(state.edges).toHaveLength(1);
    });

    it("marks the origin expanded but not its neighbours", () => {
        const state = mergeNeighbourhood(EMPTY, adaNeighbourhood);

        expect(state.nodes.find((n) => n.id === "SPEXARE:1")?.expanded).toBe(true);
        expect(state.nodes.find((n) => n.id === "SPEX:101")?.expanded).toBe(false);
    });

    it("does not duplicate a node reached from two directions", () => {
        const first = mergeNeighbourhood(EMPTY, adaNeighbourhood);
        const second = mergeNeighbourhood(first, neighbourhood(caesar, [{
            type: GraphEdgeType.Participation,
            totalCount: 1,
            nodes: [ada],
            edges: [{
                id: "e1",
                source: "SPEXARE:1",
                target: "SPEX:101",
                type: GraphEdgeType.Participation,
                label: "2015"
            }],
        }]));

        expect(second.nodes.map((n) => n.id).sort()).toEqual(["SPEX:101", "SPEXARE:1"]);
        // The shared edge is keyed by id, so it is not re-added.
        expect(second.edges).toHaveLength(1);
    });

    it("keeps a node's expanded flag when it reappears as someone else's neighbour", () => {
        const first = mergeNeighbourhood(EMPTY, adaNeighbourhood);
        const second = mergeNeighbourhood(first, neighbourhood(bacchus, [{
            type: GraphEdgeType.Participation,
            totalCount: 1,
            nodes: [ada],
            edges: [{
                id: "e2",
                source: "SPEXARE:1",
                target: "SPEX:100",
                type: GraphEdgeType.Participation,
                label: null
            }],
        }]));

        expect(second.nodes.find((n) => n.id === "SPEXARE:1")?.expanded).toBe(true);
    });

    it("records a pending group only when the total exceeds what was returned", () => {
        const state = mergeNeighbourhood(EMPTY, neighbourhood(bacchus, [
            // A hub: capped at one of 275, so there is more to fetch.
            {type: GraphEdgeType.Participation, totalCount: 275, nodes: [ada], edges: []},
            // Fully returned, so nothing is outstanding.
            {
                type: GraphEdgeType.Category,
                totalCount: 1,
                nodes: [node("SPEX_CATEGORY:7", GraphNodeType.SpexCategory, "Chalmersspexet")],
                edges: []
            },
        ]));

        expect(state.pending).toHaveLength(1);
        expect(state.pending[0]).toMatchObject({edge: GraphEdgeType.Participation, shown: 1, totalCount: 275});
    });
});

describe("mergeNodes", () => {
    it("appends a further page and advances the shown count", () => {
        const seeded = mergeNeighbourhood(EMPTY, neighbourhood(bacchus, [
            {type: GraphEdgeType.Participation, totalCount: 3, nodes: [ada], edges: []},
        ]));
        const more = mergeNodes(seeded, seeded.nodes.find((n) => n.id === "SPEX:100")!, GraphEdgeType.Participation, [
            node("SPEXARE:2", GraphNodeType.Spexare, "Grace Hopper"),
        ]);

        expect(more.nodes.map((n) => n.id)).toContain("SPEXARE:2");
        expect(more.pending[0]).toMatchObject({shown: 2, totalCount: 3});
        expect(more.edges.some((e) => e.source === "SPEXARE:2" && e.target === "SPEX:100")).toBe(true);
    });

    it("does not duplicate a node that is already loaded", () => {
        const seeded = mergeNeighbourhood(EMPTY, adaNeighbourhood);
        const more = mergeNodes(seeded, seeded.nodes[0], GraphEdgeType.Participation, [caesar]);

        expect(more.nodes.filter((n) => n.id === "SPEX:101")).toHaveLength(1);
    });
});
