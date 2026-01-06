import 'server-only';

import {getClient} from '@/lib/urql.server';
import {SortDirection, Spex, SpexConnection, SpexEdge} from "@/gql/graphql";
import {SpexPage} from "@/types/pagination";
import axios from "@/lib/axios.server";
import {mapConnection} from "@/utils/utils.server";

const SummaryFields = `
    id
    year
    title
    posterUrl
    revival
    revivals {
      id
      year
    }
    category {
      id
      name
    }
`;

const FullFields = `
    ${SummaryFields}
    revival
    createdAt
    createdBy
    lastModifiedAt
    lastModifiedBy
`;

const CreateMutation = /* GraphQL */ `
    mutation ($input: SpexCreate!) {
        spexCreate(input: $input) {
            ${FullFields}
        }
    }
`;

const UpdateMutation = /* GraphQL */ `
    mutation ($input: SpexUpdate!) {
        spexUpdate(input: $input) {
            ${FullFields}
        }
    }
`;

const DeleteMutation = /* GraphQL */ `
    mutation ($id: ID!) {
        spexDelete(id: $id)
    }
`;

const AddCategoryMutation = /* GraphQL */ `
    mutation ($id: ID!, $categoryId: ID!) {
        spexCategoryAdd(spexId: $id, id: $categoryId)
    }
`;

const RemoveCategoryMutation = /* GraphQL */ `
    mutation ($id: ID!) {
        spexCategoryRemove(spexId: $id)
    }
`;

const CreateRevivalMutation = /* GraphQL */ `
    mutation ($spexId: ID!, $year: Year!) {
        spexRevivalCreate(spexId: $spexId, year: $year) {
            id
            year
        }
    }
`;

const DeleteRevivalMutation = /* GraphQL */ `
    mutation ($id: ID!, $spexId: ID!) {
        spexRevivalDelete(spexId: $spexId, id: $id)
    }
`;

const createQuery = (fields: string) => /* GraphQL */ `
    query ($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
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

export async function getPaged(args: {
    first?: number;
    last?: number;
    after?: string | null;
    before?: string | null;
    sort?: string[];
    direction?: SortDirection;
    filter?: string;
    full?: boolean
}): Promise<SpexPage> {
    const query = createQuery(args.full ? FullFields : SummaryFields);

    const result = await getClient()
        .query<{ spexPaged: SpexConnection }>(query, {
            first: args.first,
            last: args.last,
            after: args.after ?? null,
            before: args.before ?? null,
            sort: args.sort ?? ["year"],
            direction: args.direction ?? SortDirection.Desc,
            filter: args.filter ?? "parent:NULL",
        }, {
            fetchOptions: {
                next: {tags: ['spex']}
            }
        })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return mapConnection<Spex, SpexEdge>(result.data?.spexPaged);
}

export async function getAll(args?: { full?: boolean }): Promise<Spex[]> {
    const items: Spex[] = [];
    let hasNextPage = true;
    let after: string | null = null;

    while (hasNextPage) {
        const page = await getPaged({
            first: 100,
            after,
            full: args?.full,
            filter: ""
        });

        items.push(...page.items);
        hasNextPage = page.pageInfo.hasNextPage;
        after = page.pageInfo.endCursor;
    }

    return items;
}

export async function create(input: any) {
    const result = await getClient()
        .mutation(CreateMutation, {input})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.spexCreate) {
        throw new Error("No data created");
    }

    return result.data?.spexCreate;
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

    if (!result.data?.spexUpdate) {
        throw new Error("No data updated");
    }

    return result.data?.spexUpdate;
}

export async function del(id: string) {
    const result = await getClient()
        .mutation(DeleteMutation, {id})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.spexDelete;
}

export async function addCategory(id: string, categoryId: string) {
    const result = await getClient()
        .mutation(AddCategoryMutation, {id, categoryId})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.spexCategoryAdd;
}

export async function removeCategory(id: string) {
    const result = await getClient()
        .mutation(RemoveCategoryMutation, {id})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.spexCategoryRemove;
}

export async function createRevival(spexId: string, year: string) {
    const result = await getClient()
        .mutation(CreateRevivalMutation, {spexId, year})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.spexRevivalCreate;
}

export async function deleteRevival(spexId: string, id: string) {
    const result = await getClient()
        .mutation(DeleteRevivalMutation, {spexId, id})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.spexRevivalDelete;
}

export async function uploadPoster(id: string, file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const response = await axios.put(`${process.env.API_REST_BASE_URL}/api/spex/${id}/poster`, arrayBuffer, {
        headers: {
            'Content-Type': file.type,
        }
    });
    return response.data;
}

export async function deletePoster(id: string) {
    await axios.delete(`${process.env.API_REST_BASE_URL}/api/spex/${id}/poster`);
    return {success: true};
}
