import 'server-only';

import {getClient} from '@/lib/urql.server';
import {Event, ImpexType, JobReference, SortDirection, Tag, TagConnection, TagCreate, TagEdge, TagUpdate} from "@/gql/graphql";
import {TagPage} from "@/types/pagination";
import {mapConnection} from "@/utils/utils.server";
import axios from "@/lib/axios.server";

const SummaryFields = `
    id
    name
`;

const FullFields = `
    ${SummaryFields}
    createdAt
    createdBy
    lastModifiedAt
    lastModifiedBy
`;

const CreateMutation = /* GraphQL */ `
    mutation ($input: TagCreate!) {
        tagCreate(input: $input) {
            ${FullFields}
        }
    }
`;

const UpdateMutation = /* GraphQL */ `
    mutation ($input: TagUpdate!) {
        tagUpdate(input: $input) {
            ${FullFields}
        }
    }
`;

const DeleteMutation = /* GraphQL */ `
    mutation ($id: ID!) {
        tagDelete(id: $id)
    }
`;

const ExportQuery = /* GraphQL */ `
  query ($ids: [ID], $filter: String, $type: ImpexType!) {
    tagExport(ids: $ids, filter: $filter, type: $type) {
        id
    }
  }
`;

const EventsQuery = /* GraphQL */ `
    query ($sourceId: ID!) {
        tagEvents(sourceId: $sourceId) {
            id
            eventType
            createdAt
            createdBy
        }
    }
`;

const createQuery = (fields: string) => /* GraphQL */ `
    query ($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        tagPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
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
}): Promise<TagPage> {
    const query = createQuery(args.full ? FullFields : SummaryFields);

    const result = await getClient()
        .query<{ tagPaged: TagConnection }>(query, {
            first: args.first,
            last: args.last,
            after: args.after ?? null,
            before: args.before ?? null,
            sort: args.sort ?? ["name"],
            direction: args.direction ?? SortDirection.Desc,
            filter: args.filter ?? "",
        }, {
            fetchOptions: {
                next: {tags: ['tag']}
            }
        })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return mapConnection<Tag, TagEdge>(result.data?.tagPaged);
}

export async function getAll(args?: { full?: boolean }): Promise<Tag[]> {
    const items: Tag[] = [];
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

export async function create(input: TagCreate) {
    const result = await getClient()
        .mutation(CreateMutation, {input})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.tagCreate) {
        throw new Error("No data created");
    }

    return result.data?.tagCreate;
}

export async function update(id: string, input: Omit<TagUpdate, "id">) {
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

    if (!result.data?.tagUpdate) {
        throw new Error("No data updated");
    }

    return result.data?.tagUpdate;
}

export async function del(id: string) {
    const result = await getClient()
        .mutation(DeleteMutation, {id})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.tagDelete;
}

export async function exp(ids: string[] | null, filter: string | null, type: ImpexType): Promise<JobReference> {
    const result = await getClient()
        .query<{ tagExport: JobReference }>(ExportQuery, { ids, filter, type })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data!.tagExport;
}

export async function imp(type: ImpexType, file: File): Promise<JobReference> {
    const arrayBuffer = await file.arrayBuffer();
    const response = await axios.post(`${process.env.API_REST_BASE_URL}/api/tags?type=${type}`, arrayBuffer, {
        headers: {
            'Content-Type': file.type,
        }
    });
    return response.data;
}

export async function events(sourceId: string): Promise<Event[]> {
    const result = await getClient()
        .query<{ tagEvents: Event[] }>(EventsQuery, {sourceId})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.tagEvents ?? [];
}
