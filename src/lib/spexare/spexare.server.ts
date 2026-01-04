import 'server-only';

import {getClient} from '@/lib/urql.server';
import {SortDirection, Spexare, SpexareConnection, SpexareEdge} from "@/gql/graphql";
import {SpexarePage} from "@/types/pagination";
import {mapConnection} from "@/utils/utils.server";
import axios from "@/lib/axios.server";

const SummaryFields = `
    id
    firstName
    lastName
    nickName
    socialSecurityNumber
    deceased
    published
    graduation
    comment
    imageUrl
`;

const FullFields = `
    ${SummaryFields}
    createdAt
    createdBy
    lastModifiedAt
    lastModifiedBy
`;

const CreateMutation = /* GraphQL */ `
    mutation ($input: SpexareCreate!) {
        spexareCreate(input: $input) {
            ${FullFields}
        }
    }
`;

const UpdateMutation = /* GraphQL */ `
    mutation ($input: SpexareUpdate!) {
        spexareUpdate(input: $input) {
            ${FullFields}
        }
    }
`;

const DeleteMutation = /* GraphQL */ `
    mutation ($id: ID!) {
        spexareDelete(id: $id)
    }
`;

const createQuery = (fields: string) => /* GraphQL */ `
    query ($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        spexarePaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
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
}): Promise<SpexarePage> {
    const query = createQuery(args.full ? FullFields : SummaryFields);

    const result = await getClient()
        .query<{ spexarePaged: SpexareConnection }>(query, {
            first: args.first,
            last: args.last,
            after: args.after ?? null,
            before: args.before ?? null,
            sort: args.sort ?? ["firstName"],
            direction: args.direction ?? SortDirection.Asc,
            filter: args.filter ?? "published:TRUE",
        }, {
            fetchOptions: {
                next: {tags: ['spexare']}
            }
        })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return mapConnection<Spexare, SpexareEdge>(result.data?.spexarePaged);
}

export async function create(input: any) {
    const result = await getClient()
        .mutation(CreateMutation, {input})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.spexareCreate) {
        throw new Error("No data created");
    }

    return result.data?.spexareCreate;
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

    if (!result.data?.spexareUpdate) {
        throw new Error("No data updated");
    }

    return result.data?.spexareUpdate;
}

export async function del(id: string) {
    const result = await getClient()
        .mutation(DeleteMutation, {id})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.spexareDelete;
}

export async function uploadImage(id: string, file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const response = await axios.put(`${process.env.API_REST_BASE_URL}/api/spexare/${id}/image`, arrayBuffer, {
        headers: {
            'Content-Type': file.type,
        }
    });
    return response.data;
}

export async function deleteImage(id: string) {
    await axios.delete(`${process.env.API_REST_BASE_URL}/api/spexare/${id}/image`);
    return {success: true};
}
