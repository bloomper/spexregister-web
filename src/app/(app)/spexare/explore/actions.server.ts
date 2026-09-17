"use server";

import {GraphEdgeType, GraphNodeType} from "@/gql/schema";
import {getNeighbourhood, getNeighbours, search} from "@/lib/graph";
import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";

export async function searchAction(q: string, first?: number) {
    return withPolicyAction(Policies.spexare.requireRead, async () => {
        return search(q, first);
    });
}

export async function getNeighbourhoodAction(type: GraphNodeType, id: string, first?: number) {
    return withPolicyAction(Policies.spexare.requireRead, async () => {
        return getNeighbourhood(type, id, first);
    });
}

export async function getNeighboursAction(args: {
    type: GraphNodeType;
    id: string;
    edge: GraphEdgeType;
    first?: number;
    after?: string | null;
}) {
    return withPolicyAction(Policies.spexare.requireRead, async () => {
        return getNeighbours(args);
    });
}
