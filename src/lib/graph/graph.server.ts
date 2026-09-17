import "server-only";

import {GraphEdgeType, GraphNeighbourhood, GraphNode, GraphNodeType} from "@/gql/schema";
import {graphql} from "@/gql";
import {runQuery} from "@/lib/graphql.server";

export const GraphNodeFields = graphql(`
    fragment GraphNodeFields on GraphNode {
        id
        type
        label
        sublabel
        imageUrl
        revival
        entityId
    }
`);

const SearchQuery = graphql(`
    query GraphSearch($q: String!, $first: Int!) {
        graphSearch(q: $q, first: $first) {
            ...GraphNodeFields
        }
    }
`);

const NeighbourhoodQuery = graphql(`
    query GraphNeighbourhood($type: GraphNodeType!, $id: ID!, $first: Int!) {
        graphNeighbourhood(type: $type, id: $id, first: $first) {
            origin { ...GraphNodeFields }
            groups {
                type
                totalCount
                nodes { ...GraphNodeFields }
                edges { id source target type label }
            }
        }
    }
`);

const NeighboursQuery = graphql(`
    query GraphNeighboursPaged($type: GraphNodeType!, $id: ID!, $edge: GraphEdgeType!, $first: Int, $after: String) {
        graphNeighboursPaged(type: $type, id: $id, edge: $edge, first: $first, after: $after) {
            edges { cursor node { ...GraphNodeFields } }
            pageInfo { hasNextPage endCursor }
            totalCount
        }
    }
`);

const context = {
    fetchOptions: {
        next: {tags: ["spexare", "spex", "task", "tag"]}
    }
};

export async function search(q: string, first = 10): Promise<GraphNode[]> {
    const data = await runQuery(SearchQuery, {q, first}, context);

    return (data?.graphSearch ?? []) as GraphNode[];
}

export async function getNeighbourhood(type: GraphNodeType, id: string, first = 25): Promise<GraphNeighbourhood | null> {
    const data = await runQuery(NeighbourhoodQuery, {type, id, first}, context);

    return (data?.graphNeighbourhood as GraphNeighbourhood | undefined) ?? null;
}

export async function getNeighbours(args: {
    type: GraphNodeType;
    id: string;
    edge: GraphEdgeType;
    first?: number;
    after?: string | null;
}): Promise<{ nodes: GraphNode[]; endCursor: string | null; hasNextPage: boolean; totalCount: number }> {
    const data = await runQuery(NeighboursQuery, {
        type: args.type,
        id: args.id,
        edge: args.edge,
        first: args.first ?? 25,
        after: args.after ?? null,
    }, context);

    const connection = data?.graphNeighboursPaged;

    return {
        nodes: (connection?.edges ?? []).map((edge) => edge?.node).filter(Boolean) as GraphNode[],
        endCursor: connection?.pageInfo?.endCursor ?? null,
        hasNextPage: connection?.pageInfo?.hasNextPage ?? false,
        totalCount: connection?.totalCount ?? 0,
    };
}
