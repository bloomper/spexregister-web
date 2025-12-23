import 'server-only';

import {getClient} from '@/lib/urql.server';
import {News, NewsConnection, NewsEdge, SortDirection} from "@/gql/graphql";
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
    mutation NewsUpdate($input: NewsUpdate!) {
        newsUpdate(input: $input) {
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
    query NewsPaged($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        newsPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
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
    sort?: string[];
    direction?: SortDirection;
    filter?: string;
    full?: boolean
}): Promise<NewsPage> {
    const query = createQuery(args.full ? NewsFullFields : NewsSummaryFields);

    const result = await getClient()
        .query<{ newsPaged: NewsConnection }>(query, {
            first: args.first,
            last: args.last,
            after: args.after ?? null,
            before: args.before ?? null,
            sort: args.sort ?? ["visibleFrom"],
            direction: args.direction ?? SortDirection.Desc,
            filter: args.filter ?? "published:TRUE",
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

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.newsCreate) {
        throw new Error("No data created");
    }

    return result.data?.newsCreate;
}

export async function updateNews(id: string, input: any) {
    const result = await getClient()
        .mutation(NewsUpdateMutation, {
            input: {
                ...input,
                id
            }})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.newsUpdate) {
        throw new Error("No data updated");
    }

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
