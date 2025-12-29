import 'server-only';

import {PageInfo} from "@/gql/graphql";
import {CursorPage} from "@/types/pagination";

export function mapConnection<T, E extends { cursor: string; node: T }>(
    connection: { edges: (E | null | undefined)[]; pageInfo: PageInfo } | null | undefined
): CursorPage<T> & { edges: E[] } {
    const edges = (connection?.edges ?? []).filter((e): e is E => Boolean(e?.cursor && e?.node));

    return {
        items: edges.map(e => e.node),
        edges: edges,
        pageInfo: {
            hasNextPage: Boolean(connection?.pageInfo?.hasNextPage),
            hasPreviousPage: Boolean(connection?.pageInfo?.hasPreviousPage),
            startCursor: connection?.pageInfo?.startCursor ?? null,
            endCursor: connection?.pageInfo?.endCursor ?? null,
        },
    };
}