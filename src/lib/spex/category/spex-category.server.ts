import 'server-only';

import {getClient} from '@/lib/urql.server';
import {
    Event,
    ImpexType,
    JobReference,
    SortDirection,
    SpexCategory,
    SpexCategoryConnection,
    SpexCategoryCreate,
    SpexCategoryEdge,
    SpexCategoryUpdate
} from "@/gql/graphql";
import {SpexCategoryPage} from "@/types/pagination";
import axios from "@/lib/axios.server";
import {mapConnection} from "@/utils/utils.server";

const SummaryFields = `
    id
    name
    logoUrl
    firstYear
`;

const FullFields = `
    ${SummaryFields}
    createdAt
    createdBy
    lastModifiedAt
    lastModifiedBy
`;

const CreateMutation = /* GraphQL */ `
    mutation ($input: SpexCategoryCreate!) {
        spexCategoryCreate(input: $input) {
            ${FullFields}
        }
    }
`;

const UpdateMutation = /* GraphQL */ `
    mutation ($input: SpexCategoryUpdate!) {
        spexCategoryUpdate(input: $input) {
            ${FullFields}
        }
    }
`;

const DeleteMutation = /* GraphQL */ `
    mutation ($id: ID!) {
        spexCategoryDelete(id: $id)
    }
`;

const ExportQuery = /* GraphQL */ `
  query ($ids: [ID], $filter: String, $type: ImpexType!) {
    spexCategoryExport(ids: $ids, filter: $filter, type: $type) {
        id
    }
  }
`;

const EventsQuery = /* GraphQL */ `
    query ($sourceId: ID!) {
        spexCategoryEvents(sourceId: $sourceId) {
            id
            eventType
            createdAt
            createdBy
        }
    }
`;

const createQuery = (fields: string) => /* GraphQL */ `
    query ($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
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

export async function getPaged(args: {
    first?: number;
    last?: number;
    after?: string | null;
    before?: string | null;
    sort?: string[];
    direction?: SortDirection;
    filter?: string;
    full?: boolean
}): Promise<SpexCategoryPage> {
    const query = createQuery(args.full ? FullFields : SummaryFields);

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

    return mapConnection<SpexCategory, SpexCategoryEdge>(result.data?.spexCategoryPaged);
}

export async function getAll(args?: { full?: boolean }): Promise<SpexCategory[]> {
    const items: SpexCategory[] = [];
    let hasNextPage = true;
    let after: string | null = null;

    while (hasNextPage) {
        const page = await getPaged({
            first: 100,
            after,
            full: args?.full
        });

        items.push(...page.items);
        hasNextPage = page.pageInfo.hasNextPage;
        after = page.pageInfo.endCursor;
    }

    return items;
}

export async function create(input: SpexCategoryCreate) {
    const result = await getClient()
        .mutation(CreateMutation, {input})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.spexCategoryCreate) {
        throw new Error("No data created");
    }

    return result.data?.spexCategoryCreate;
}

export async function update(id: string, input: Omit<SpexCategoryUpdate, "id">) {
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

    if (!result.data?.spexCategoryUpdate) {
        throw new Error("No data updated");
    }

    return result.data?.spexCategoryUpdate;
}

export async function del(id: string) {
    const result = await getClient()
        .mutation(DeleteMutation, {id})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.spexCategoryDelete;
}

export async function exp(ids: string[] | null, filter: string | null, type: ImpexType): Promise<JobReference> {
    const result = await getClient()
        .query<{ spexCategoryExport: JobReference }>(ExportQuery, { ids, filter, type })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data!.spexCategoryExport;
}

export async function imp(type: ImpexType, file: File): Promise<JobReference> {
    const arrayBuffer = await file.arrayBuffer();
    const response = await axios.post(`${process.env.API_REST_BASE_URL}/api/spex/categories?type=${type}`, arrayBuffer, {
        headers: {
            'Content-Type': file.type,
        }
    });
    return response.data;
}

export async function uploadLogo(id: string, file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const response = await axios.put(`${process.env.API_REST_BASE_URL}/api/spex/categories/${id}/logo`, arrayBuffer, {
        headers: {
            'Content-Type': file.type,
        }
    });
    return response.data;
}

export async function deleteLogo(id: string) {
    await axios.delete(`${process.env.API_REST_BASE_URL}/api/spex/categories/${id}/logo`);
    return {success: true};
}

export async function events(sourceId: string): Promise<Event[]> {
    const result = await getClient()
        .query<{ spexCategoryEvents: Event[] }>(EventsQuery, {sourceId})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.spexCategoryEvents ?? [];
}
