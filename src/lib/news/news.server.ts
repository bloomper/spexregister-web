import 'server-only';

import {getClient} from '@/lib/urql.server';
import {News, NewsConnection, NewsEdge, SortDirection} from "@/gql/graphql";
import {NewsPage} from "@/types/pagination";

const SummaryFields = `
    id
    subject
    text
    visibleFrom
`;

const FullFields = `
    ${SummaryFields}
    published
    visibleTo
    createdAt
    createdBy
    lastModifiedAt
    lastModifiedBy
`;

const CreateMutation = /* GraphQL */ `
    mutation ($input: NewsCreate!) {
        newsCreate(input: $input) {
            ${FullFields}
        }
    }
`;

const UpdateMutation = /* GraphQL */ `
    mutation ($input: NewsUpdate!) {
        newsUpdate(input: $input) {
            ${FullFields}
        }
    }
`;

const DeleteMutation = /* GraphQL */ `
    mutation ($id: ID!) {
        newsDelete(id: $id)
    }
`;

const createQuery = (fields: string) => /* GraphQL */ `
    query ($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
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

export async function getPaged(args: {
    first?: number;
    last?: number;
    after?: string | null;
    before?: string | null;
    sort?: string[];
    direction?: SortDirection;
    filter?: string;
    full?: boolean
}): Promise<NewsPage> {
    const query = createQuery(args.full ? FullFields : SummaryFields);

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

export async function create(input: any) {
    const result = await getClient()
        .mutation(CreateMutation, {input})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.newsCreate) {
        throw new Error("No data created");
    }

    return result.data?.newsCreate;
}

export async function update(id: string, input: any) {
    const result = await getClient()
        .mutation(UpdateMutation, {
            input: {
                ...input,
                id
            }
        })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.newsUpdate) {
        throw new Error("No data updated");
    }

    return result.data?.newsUpdate;
}

export async function del(id: string) {
    const result = await getClient()
        .mutation(DeleteMutation, {id})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.newsDelete;
}
