import 'server-only';

import {getClient} from '@/lib/urql.server';
import {News, NewsConnection, NewsEdge} from "@/gql/graphql";
import {NewsPage} from "@/types/pagination";

const NewsPagedQuery = /* GraphQL */`
    query NewsPaged($first: Int!, $after: String) {
        newsPaged(first: $first, after: $after) {
            edges {
                cursor
                node {
                    id
                    visibleFrom
                    subject
                    text
                }
            }
            pageInfo {
                hasNextPage
                endCursor
            }
        }
    }
`;

export async function getNewsPaged(args: { first: number; after?: string | null }): Promise<NewsPage> {
    const result = await getClient()
        .query<{ newsPaged: NewsConnection }>(NewsPagedQuery, {first: args.first, after: args.after ?? null})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    const conn = result.data?.newsPaged;
    const validEdges = (conn?.edges ?? [])
        .filter((e): e is NewsEdge & { node: News } => Boolean(e?.cursor && e?.node?.id));

    return {
        items: validEdges.map(e => e.node),
        edges: validEdges,
        pageInfo: {
            hasNextPage: Boolean(conn?.pageInfo?.hasNextPage),
            endCursor: conn?.pageInfo?.endCursor ?? null,
        },
    };
}
