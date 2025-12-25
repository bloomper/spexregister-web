import 'server-only';

import {getClient} from '@/lib/urql.server';
import {Spex, SpexEdge, SortDirection, SpexConnection} from "@/gql/graphql";
import {SpexPage} from "@/types/pagination";

const SpexSummaryFields = `
    id
    year
    title
`;

const SpexFullFields = `
    ${SpexSummaryFields}
    revival
    createdAt
    createdBy
    lastModifiedAt
    lastModifiedBy
`;

const SpexCreateMutation = /* GraphQL */ `
    mutation SpexCreate($input: SpexCreate!) {
        spexCreate(input: $input) {
            ${SpexFullFields}
        }
    }
`;

const SpexUpdateMutation = /* GraphQL */ `
    mutation SpexUpdate($input: SpexUpdate!) {
        spexUpdate(input: $input) {
            ${SpexFullFields}
        }
    }
`;

const SpexDeleteMutation = /* GraphQL */ `
    mutation SpexDelete($id: ID!) {
        spexDelete(id: $id)
    }
`;

const createQuery = (fields: string) => /* GraphQL */ `
    query SpexPaged($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        spexPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
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

export async function getSpexPaged(args: {
    first?: number;
    last?: number;
    after?: string | null;
    before?: string | null;
    sort?: string[];
    direction?: SortDirection;
    filter?: string;
    full?: boolean
}): Promise<SpexPage> {
    const query = createQuery(args.full ? SpexFullFields : SpexSummaryFields);

    const result = await getClient()
        .query<{ spexPaged: SpexConnection }>(query, {
            first: args.first,
            last: args.last,
            after: args.after ?? null,
            before: args.before ?? null,
            sort: args.sort ?? ["year"],
            direction: args.direction ?? SortDirection.Desc,
            filter: args.filter ?? "",
        }, {
            fetchOptions: {
                next: {tags: ['spex']}
            }
        })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    const conn = result.data?.spexPaged;
    const validEdges = (conn?.edges ?? [])
        .filter((e): e is SpexEdge & { node: Spex } => Boolean(e?.cursor && e?.node?.id));

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

export async function createSpex(input: any) {
    const result = await getClient()
        .mutation(SpexCreateMutation, {input})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.spexCreate) {
        throw new Error("No data created");
    }

    return result.data?.spexCreate;
}

export async function updateSpex(id: string, input: any) {
    const result = await getClient()
        .mutation(SpexUpdateMutation, {
            input: {
                ...input,
                id
            }})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.spexUpdate) {
        throw new Error("No data updated");
    }

    return result.data?.spexUpdate;
}

export async function deleteSpex(id: string) {
    const result = await getClient()
        .mutation(SpexDeleteMutation, {id})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.spexDelete;
}
