import 'server-only';

import {getClient} from '@/lib/urql.server';
import {News, NewsConnection, NewsEdge} from "@/gql/graphql";
import {NewsPage} from "@/types/pagination";

const NewsSummaryFields = `
    id
    subject
    text
    visibleFrom
`;

const NewsFullFields = `
    ${NewsSummaryFields}
    published
    visibleTo
    createdAt
    createdBy
    lastModifiedAt
    lastModifiedBy
`;

const NewsCreateMutation = /* GraphQL */ `
    mutation NewsCreate($input: NewsCreate!) {
        newsCreate(input: $input) {
            ${NewsFullFields}
        }
    }
`;

const NewsUpdateMutation = /* GraphQL */ `
    mutation NewsUpdate($id: ID!, $input: NewsUpdate!) {
        newsUpdate(id: $id, input: $input) {
            ${NewsFullFields}
        }
    }
`;

const NewsDeleteMutation = /* GraphQL */ `
    mutation NewsDelete($id: ID!) {
        newsDelete(id: $id)
    }
`;

const createQuery = (fields: string) => /* GraphQL */ `
    query NewsPaged($first: Int, $last: Int, $after: String, $before: String) {
        newsPaged(first: $first, last: $last, after: $after, before: $before) {
            edges {
                cursor
                node { ${fields} }
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
        }
    }
`;

export async function getNewsPaged(args: {
    first?: number;
    last?: number;
    after?: string | null;
    before?: string | null;
    full?: boolean
}): Promise<NewsPage> {
    const query = createQuery(args.full ? NewsFullFields : NewsSummaryFields);

    const result = await getClient()
        .query<{ newsPaged: NewsConnection }>(query, {
            first: args.first,
            last: args.last,
            after: args.after ?? null,
            before: args.before ?? null
        }, {
            fetchOptions: {
                next: {tags: ['news']}
            }
        })
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
            hasPreviousPage: Boolean(conn?.pageInfo?.hasPreviousPage),
            startCursor: conn?.pageInfo?.startCursor ?? null,
            endCursor: conn?.pageInfo?.endCursor ?? null,
        },
    };
}

export async function createNews(input: any) {
    const result = await getClient()
        .mutation(NewsCreateMutation, {input})
        .toPromise();

    if (result.error) throw result.error;
    return result.data?.newsCreate;
}

export async function updateNews(id: string, input: any) {
    const result = await getClient()
        .mutation(NewsUpdateMutation, {id, input})
        .toPromise();

    if (result.error) throw result.error;
    return result.data?.newsUpdate;
}

export async function deleteNews(id: string) {
    const result = await getClient()
        .mutation(NewsDeleteMutation, {id})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.newsDelete;
}
