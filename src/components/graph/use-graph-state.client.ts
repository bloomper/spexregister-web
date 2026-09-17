"use client";

import {useCallback, useMemo, useState} from "react";
import {GraphEdge, GraphEdgeType, GraphNeighbourhood, GraphNode, GraphNodeType} from "@/gql/schema";

export type LoadedNode = GraphNode & {
    expanded?: boolean;
};

export type PendingGroup = {
    nodeId: string;
    type: GraphNodeType;
    entityId: string;
    edge: GraphEdgeType;
    shown: number;
    totalCount: number;
};

export type GraphState = {
    nodes: LoadedNode[];
    edges: GraphEdge[];
    pending: PendingGroup[];
};

const EMPTY: GraphState = {nodes: [], edges: [], pending: []};

export function mergeNeighbourhood(state: GraphState, neighbourhood: GraphNeighbourhood): GraphState {
    const nodes = new Map(state.nodes.map((node) => [node.id, node]));
    const edges = new Map(state.edges.map((edge) => [edge.id, edge]));

    const origin = neighbourhood.origin;

    nodes.set(origin.id, {...nodes.get(origin.id), ...origin, expanded: true});

    for (const group of neighbourhood.groups ?? []) {
        for (const node of group.nodes ?? []) {
            const existing = nodes.get(node.id);

            nodes.set(node.id, {...node, expanded: existing?.expanded ?? false});
        }
        for (const edge of group.edges ?? []) {
            edges.set(edge.id, edge);
        }
    }

    const pending = (neighbourhood.groups ?? [])
        .filter((group) => group.totalCount > (group.nodes ?? []).length)
        .map((group) => ({
            nodeId: origin.id,
            type: origin.type,
            entityId: origin.entityId as string,
            edge: group.type,
            shown: (group.nodes ?? []).length,
            totalCount: group.totalCount,
        }));

    return {
        nodes: [...nodes.values()],
        edges: [...edges.values()],
        pending: [
            ...state.pending.filter((p) => p.nodeId !== origin.id),
            ...pending,
        ],
    };
}

export function mergeNodes(state: GraphState, origin: LoadedNode, edge: GraphEdgeType, added: GraphNode[]): GraphState {
    const nodes = new Map(state.nodes.map((node) => [node.id, node]));
    const edges = new Map(state.edges.map((e) => [e.id, e]));

    for (const node of added) {
        const existing = nodes.get(node.id);

        nodes.set(node.id, {...node, expanded: existing?.expanded ?? false});
        edges.set(`${node.id}->${origin.id}:${edge}`, {
            id: `${node.id}->${origin.id}:${edge}`,
            source: node.id,
            target: origin.id,
            type: edge,
            label: null,
        } as GraphEdge);
    }

    return {
        nodes: [...nodes.values()],
        edges: [...edges.values()],
        pending: state.pending.map((p) => p.nodeId === origin.id && p.edge === edge
            ? {...p, shown: p.shown + added.length}
            : p),
    };
}

/**
 * Undoes an expansion: drops the neighbours that hang off this node and nothing else, together with
 * the edges reaching them. A neighbour that is also attached elsewhere stays — it is part of the
 * rest of the graph now, and pulling it out would silently break paths the user built.
 */
export function collapse(state: GraphState, id: string): GraphState {
    const degree = new Map<string, number>();

    for (const edge of state.edges) {
        degree.set(edge.source, (degree.get(edge.source) ?? 0) + 1);
        degree.set(edge.target, (degree.get(edge.target) ?? 0) + 1);
    }

    const orphaned = new Set(state.edges
        .filter((edge) => edge.source === id || edge.target === id)
        .map((edge) => (edge.source === id ? edge.target : edge.source))
        .filter((neighbour) => neighbour !== id && (degree.get(neighbour) ?? 0) <= 1));

    return {
        nodes: state.nodes
            .filter((node) => !orphaned.has(node.id))
            .map((node) => (node.id === id ? {...node, expanded: false} : node)),
        edges: state.edges.filter((edge) => !orphaned.has(edge.source) && !orphaned.has(edge.target)),
        pending: state.pending.filter((group) => group.nodeId !== id),
    };
}

export function useGraphState() {
    const [state, setState] = useState<GraphState>(EMPTY);

    const absorb = useCallback((neighbourhood: GraphNeighbourhood) => {
        setState((previous) => mergeNeighbourhood(previous, neighbourhood));
    }, []);

    const collapseNode = useCallback((id: string) => {
        setState((previous) => collapse(previous, id));
    }, []);

    const absorbNodes = useCallback((origin: LoadedNode, edge: GraphEdgeType, added: GraphNode[]) => {
        setState((previous) => mergeNodes(previous, origin, edge, added));
    }, []);

    const reset = useCallback(() => setState(EMPTY), []);

    const byId = useMemo(() => new Map(state.nodes.map((node) => [node.id, node])), [state.nodes]);

    return {state, byId, absorb, absorbNodes, collapseNode, reset};
}
