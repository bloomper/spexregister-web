import 'server-only';

import {getClient} from '@/lib/urql.server';
import {Event, ImpexType, JobReference, SortDirection, Task, TaskConnection, TaskCreate, TaskEdge, TaskUpdate} from "@/gql/graphql";
import {TaskPage} from "@/types/pagination";
import {mapConnection} from "@/utils/utils.server";
import axios from "@/lib/axios.server";

const SummaryFields = `
    id
    name
    category {
      id
      name
      actorPresent
    }
`;

const FullFields = `
    ${SummaryFields}
    createdAt
    createdBy
    lastModifiedAt
    lastModifiedBy
`;

const CreateMutation = /* GraphQL */ `
    mutation ($input: TaskCreate!) {
        taskCreate(input: $input) {
            ${FullFields}
        }
    }
`;

const UpdateMutation = /* GraphQL */ `
    mutation ($input: TaskUpdate!) {
        taskUpdate(input: $input) {
            ${FullFields}
        }
    }
`;

const DeleteMutation = /* GraphQL */ `
    mutation ($id: ID!) {
        taskDelete(id: $id)
    }
`;

const ExportQuery = /* GraphQL */ `
  query ($ids: [ID], $filter: String, $type: ImpexType!) {
    taskExport(ids: $ids, filter: $filter, type: $type) {
        id
    }
  }
`;

const AddCategoryMutation = /* GraphQL */ `
    mutation ($id: ID!, $categoryId: ID!) {
        taskCategoryAdd(taskId: $id, id: $categoryId)
    }
`;

const RemoveCategoryMutation = /* GraphQL */ `
    mutation ($id: ID!) {
        taskCategoryRemove(taskId: $id)
    }
`;

const EventsQuery = /* GraphQL */ `
    query ($sourceId: ID!) {
        taskEvents(sourceId: $sourceId) {
            id
            eventType
            createdAt
            createdBy
        }
    }
`;

const createQuery = (fields: string) => /* GraphQL */ `
    query ($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        taskPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
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
}): Promise<TaskPage> {
    const query = createQuery(args.full ? FullFields : SummaryFields);

    const result = await getClient()
        .query<{ taskPaged: TaskConnection }>(query, {
            first: args.first,
            last: args.last,
            after: args.after ?? null,
            before: args.before ?? null,
            sort: args.sort ?? ["name"],
            direction: args.direction ?? SortDirection.Asc,
            filter: args.filter ?? "",
        }, {
            fetchOptions: {
                next: {tags: ['task']}
            }
        })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return mapConnection<Task, TaskEdge>(result.data?.taskPaged);
}

export async function getAll(args?: { full?: boolean }): Promise<Task[]> {
    const items: Task[] = [];
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

export async function create(input: TaskCreate) {
    const result = await getClient()
        .mutation(CreateMutation, {input})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.taskCreate) {
        throw new Error("No data created");
    }

    return result.data?.taskCreate;
}

export async function update(id: string, input: Omit<TaskUpdate, "id">) {
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

    if (!result.data?.taskUpdate) {
        throw new Error("No data updated");
    }

    return result.data?.taskUpdate;
}

export async function del(id: string) {
    const result = await getClient()
        .mutation(DeleteMutation, {id})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.taskDelete;
}

export async function exp(ids: string[] | null, filter: string | null, type: ImpexType): Promise<JobReference> {
    const result = await getClient()
        .query<{ taskExport: JobReference }>(ExportQuery, { ids, filter, type })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data!.taskExport;
}

export async function imp(type: ImpexType, file: File): Promise<JobReference> {
    const arrayBuffer = await file.arrayBuffer();
    const response = await axios.post(`${process.env.API_REST_BASE_URL}/api/tasks?type=${type}`, arrayBuffer, {
        headers: {
            'Content-Type': file.type,
        }
    });
    return response.data;
}

export async function addCategory(id: string, categoryId: string) {
    const result = await getClient()
        .mutation(AddCategoryMutation, {id, categoryId})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.taskCategoryAdd;
}

export async function removeCategory(id: string) {
    const result = await getClient()
        .mutation(RemoveCategoryMutation, {id})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.taskCategoryRemove;
}

export async function events(sourceId: string): Promise<Event[]> {
    const result = await getClient()
        .query<{ taskEvents: Event[] }>(EventsQuery, {sourceId})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.taskEvents ?? [];
}
