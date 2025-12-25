import 'server-only';

import {getClient} from '@/lib/urql.server';
import {SpexCategory, SpexCategoryEdge, SortDirection, SpexCategoryConnection} from "@/gql/graphql";
import {SpexCategoryPage} from "@/types/pagination";

const SpexCategorySummaryFields = `
    id
    name
    logoUrl
    firstYear
`;

const SpexCategoryFullFields = `
    ${SpexCategorySummaryFields}
    createdAt
    createdBy
    lastModifiedAt
    lastModifiedBy
`;

const SpexCategoryCreateMutation = /* GraphQL */ `
    mutation SpexCategoryCreate($input: SpexCategoryCreate!) {
        spexCategoryCreate(input: $input) {
            ${SpexCategoryFullFields}
        }
    }
`;

const SpexCategoryUpdateMutation = /* GraphQL */ `
    mutation SpexCategoryUpdate($input: SpexCategoryUpdate!) {
        spexCategoryUpdate(input: $input) {
            ${SpexCategoryFullFields}
        }
    }
`;

const SpexCategoryDeleteMutation = /* GraphQL */ `
    mutation SpexCategoryDelete($id: ID!) {
        spexCategoryDelete(id: $id)
    }
`;

const createQuery = (fields: string) => /* GraphQL */ `
    query SpexCategoryPaged($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        spexCategoryPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
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

export async function getSpexCategoryPaged(args: {
    first?: number;
    last?: number;
    after?: string | null;
    before?: string | null;
    sort?: string[];
    direction?: SortDirection;
    filter?: string;
    full?: boolean
}): Promise<SpexCategoryPage> {
    const query = createQuery(args.full ? SpexCategoryFullFields : SpexCategorySummaryFields);

    const result = await getClient()
        .query<{ spexCategoryPaged: SpexCategoryConnection }>(query, {
            first: args.first,
            last: args.last,
            after: args.after ?? null,
            before: args.before ?? null,
            sort: args.sort ?? ["name"],
            direction: args.direction ?? SortDirection.Asc,
            filter: args.filter ?? "",
        }, {
            fetchOptions: {
                next: {tags: ['spex-category']}
            }
        })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    const conn = result.data?.spexCategoryPaged;
    const validEdges = (conn?.edges ?? [])
        .filter((e): e is SpexCategoryEdge & { node: SpexCategory } => Boolean(e?.cursor && e?.node?.id));

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

export async function createSpexCategory(input: any) {
    const result = await getClient()
        .mutation(SpexCategoryCreateMutation, {input})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.spexCategoryCreate) {
        throw new Error("No data created");
    }

    return result.data?.spexCategoryCreate;
}

export async function updateSpexCategory(id: string, input: any) {
    const result = await getClient()
        .mutation(SpexCategoryUpdateMutation, {
            input: {
                ...input,
                id
            }})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.spexCategoryUpdate) {
        throw new Error("No data updated");
    }

    return result.data?.spexCategoryUpdate;
}

export async function deleteSpexCategory(id: string) {
    const result = await getClient()
        .mutation(SpexCategoryDeleteMutation, {id})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.spexCategoryDelete;
}
