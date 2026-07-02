import "server-only";

import {SortDirection, Task, TaskCreate, TaskEdge, TaskUpdate} from "@/gql/schema";
import {graphql} from "@/gql";
import {createResourceClient, runMutationField} from "@/lib/graphql.server";

export const TaskSummary = graphql(`
    fragment TaskSummary on Task {
        id
        name
        category {
            id
            name
            actorPresent
        }
    }
`);

export const TaskFull = graphql(`
    fragment TaskFull on Task {
        ...TaskSummary
        createdAt
        createdBy
        lastModifiedAt
        lastModifiedBy
    }
`);

const TaskPagedSummary = graphql(`
    query TaskPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        taskPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
            edges { cursor node { ...TaskSummary } }
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
        }
    }
`);

const TaskPagedFull = graphql(`
    query TaskPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        taskPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
            edges { cursor node { ...TaskFull } }
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
        }
    }
`);

const TaskCreateMutation = graphql(`
    mutation TaskCreate($input: TaskCreate!) {
        taskCreate(input: $input) { ...TaskFull }
    }
`);

const TaskUpdateMutation = graphql(`
    mutation TaskUpdate($input: TaskUpdate!) {
        taskUpdate(input: $input) { ...TaskFull }
    }
`);

const TaskDeleteMutation = graphql(`
    mutation TaskDelete($id: ID!) {
        taskDelete(id: $id)
    }
`);

const TaskExportQuery = graphql(`
    query TaskExport($ids: [ID], $filter: String, $type: ImpexType!) {
        taskExport(ids: $ids, filter: $filter, type: $type) { id }
    }
`);

const TaskEventsQuery = graphql(`
    query TaskEvents($sourceId: ID!) {
        taskEvents(sourceId: $sourceId) { id eventType createdAt createdBy }
    }
`);

const client = createResourceClient<Task, TaskEdge, TaskCreate, TaskUpdate>({
    singular: "task",
    pagedSummaryQuery: TaskPagedSummary,
    pagedFullQuery: TaskPagedFull,
    createMutation: TaskCreateMutation,
    updateMutation: TaskUpdateMutation,
    deleteMutation: TaskDeleteMutation,
    exportQuery: TaskExportQuery,
    eventsQuery: TaskEventsQuery,
    cacheTag: "task",
    restPath: "tasks",
    defaultSort: ["name"],
    defaultDirection: SortDirection.Asc,
    defaultFilter: "",
});

export const {getPaged, getAll, create, update, del, exp, imp, events} = client;

const TaskCategoryAddMutation = graphql(`
    mutation TaskCategoryAdd($id: ID!, $categoryId: ID!) {
        taskCategoryAdd(taskId: $id, id: $categoryId)
    }
`);

const TaskCategoryRemoveMutation = graphql(`
    mutation TaskCategoryRemove($id: ID!) {
        taskCategoryRemove(taskId: $id)
    }
`);

export async function addCategory(id: string, categoryId: string) {
    return runMutationField(TaskCategoryAddMutation, {id, categoryId}, "taskCategoryAdd");
}

export async function removeCategory(id: string) {
    return runMutationField(TaskCategoryRemoveMutation, {id}, "taskCategoryRemove");
}
