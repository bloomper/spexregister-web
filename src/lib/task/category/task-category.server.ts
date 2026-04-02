import 'server-only';

import {getClient} from '@/lib/urql.server';
import {
    ImpexType,
    JobReference,
    SortDirection,
    TaskCategory,
    TaskCategoryConnection,
    TaskCategoryCreate,
    TaskCategoryEdge,
    TaskCategoryUpdate
} from "@/gql/graphql";
import {TaskCategoryPage} from "@/types/pagination";
import {mapConnection} from "@/utils/utils.server";
import axios from "@/lib/axios.server";

const SummaryFields = `
    id
    name
    actorPresent
`;

const FullFields = `
    ${SummaryFields}
    createdAt
    createdBy
    lastModifiedAt
    lastModifiedBy
`;

const CreateMutation = /* GraphQL */ `
    mutation ($input: TaskCategoryCreate!) {
        taskCategoryCreate(input: $input) {
            ${FullFields}
        }
    }
`;

const UpdateMutation = /* GraphQL */ `
    mutation ($input: TaskCategoryUpdate!) {
        taskCategoryUpdate(input: $input) {
            ${FullFields}
        }
    }
`;

const DeleteMutation = /* GraphQL */ `
    mutation ($id: ID!) {
        taskCategoryDelete(id: $id)
    }
`;

const ExportQuery = /* GraphQL */ `
  query ($ids: [ID], $filter: String, $type: ImpexType!) {
    taskCategoryExport(ids: $ids, filter: $filter, type: $type) {
        id
    }
  }
`;

const EventsQuery = /* GraphQL */ `
    query ($sourceId: ID!) {
        taskCategoryEvents(sourceId: $sourceId) {
            id
            eventType
            createdAt
            createdBy
        }
    }
`;

const createQuery = (fields: string) => /* GraphQL */ `
    query ($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        taskCategoryPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
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
}): Promise<TaskCategoryPage> {
    const query = createQuery(args.full ? FullFields : SummaryFields);

    const result = await getClient()
        .query<{ taskCategoryPaged: TaskCategoryConnection }>(query, {
            first: args.first,
            last: args.last,
            after: args.after ?? null,
            before: args.before ?? null,
            sort: args.sort ?? ["name"],
            direction: args.direction ?? SortDirection.Asc,
            filter: args.filter ?? "",
        }, {
            fetchOptions: {
                next: {tags: ['task-category']}
            }
        })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return mapConnection<TaskCategory, TaskCategoryEdge>(result.data?.taskCategoryPaged);
}

export async function getAll(args?: { full?: boolean }): Promise<TaskCategory[]> {
    const items: TaskCategory[] = [];
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

export async function create(input: TaskCategoryCreate) {
    const result = await getClient()
        .mutation(CreateMutation, {input})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.taskCategoryCreate) {
        throw new Error("No data created");
    }

    return result.data?.taskCategoryCreate;
}

export async function update(id: string, input: TaskCategoryUpdate) {
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

    if (!result.data?.taskCategoryUpdate) {
        throw new Error("No data updated");
    }

    return result.data?.taskCategoryUpdate;
}

export async function del(id: string) {
    const result = await getClient()
        .mutation(DeleteMutation, {id})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.taskCategoryDelete;
}

export async function exp(ids: string[] | null, filter: string | null, type: ImpexType): Promise<JobReference> {
    const result = await getClient()
        .query<{ taskCategoryExport: JobReference }>(ExportQuery, { ids, filter, type })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data!.taskCategoryExport;
}

export async function imp(type: ImpexType, file: File): Promise<JobReference> {
    const arrayBuffer = await file.arrayBuffer();
    const response = await axios.post(`${process.env.API_REST_BASE_URL}/api/tasks/categories?type=${type}`, arrayBuffer, {
        headers: {
            'Content-Type': file.type,
        }
    });
    return response.data;
}

export async function events(sourceId: string): Promise<Event[]> {
    const result = await getClient()
        .query<{ taskCategoryEvents: Event[] }>(EventsQuery, {sourceId})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.taskCategoryEvents ?? [];
}
