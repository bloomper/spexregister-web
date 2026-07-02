import "server-only";

import {SortDirection, TaskCategory, TaskCategoryCreate, TaskCategoryEdge, TaskCategoryUpdate} from "@/gql/schema";
import {graphql} from "@/gql";
import {createResourceClient} from "@/lib/graphql.server";

export const TaskCategorySummary = graphql(`
    fragment TaskCategorySummary on TaskCategory {
        id
        name
        actorPresent
    }
`);

export const TaskCategoryFull = graphql(`
    fragment TaskCategoryFull on TaskCategory {
        ...TaskCategorySummary
        createdAt
        createdBy
        lastModifiedAt
        lastModifiedBy
    }
`);

const TaskCategoryPagedSummary = graphql(`
    query TaskCategoryPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        taskCategoryPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
            edges { cursor node { ...TaskCategorySummary } }
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
        }
    }
`);

const TaskCategoryPagedFull = graphql(`
    query TaskCategoryPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        taskCategoryPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
            edges { cursor node { ...TaskCategoryFull } }
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
        }
    }
`);

const TaskCategoryCreateMutation = graphql(`
    mutation TaskCategoryCreate($input: TaskCategoryCreate!) {
        taskCategoryCreate(input: $input) { ...TaskCategoryFull }
    }
`);

const TaskCategoryUpdateMutation = graphql(`
    mutation TaskCategoryUpdate($input: TaskCategoryUpdate!) {
        taskCategoryUpdate(input: $input) { ...TaskCategoryFull }
    }
`);

const TaskCategoryDeleteMutation = graphql(`
    mutation TaskCategoryDelete($id: ID!) {
        taskCategoryDelete(id: $id)
    }
`);

const TaskCategoryExportQuery = graphql(`
    query TaskCategoryExport($ids: [ID], $filter: String, $type: ImpexType!) {
        taskCategoryExport(ids: $ids, filter: $filter, type: $type) { id }
    }
`);

const TaskCategoryEventsQuery = graphql(`
    query TaskCategoryEvents($sourceId: ID!) {
        taskCategoryEvents(sourceId: $sourceId) { id eventType createdAt createdBy }
    }
`);

const client = createResourceClient<TaskCategory, TaskCategoryEdge, TaskCategoryCreate, TaskCategoryUpdate>({
    singular: "taskCategory",
    pagedSummaryQuery: TaskCategoryPagedSummary,
    pagedFullQuery: TaskCategoryPagedFull,
    createMutation: TaskCategoryCreateMutation,
    updateMutation: TaskCategoryUpdateMutation,
    deleteMutation: TaskCategoryDeleteMutation,
    exportQuery: TaskCategoryExportQuery,
    eventsQuery: TaskCategoryEventsQuery,
    cacheTag: "task-category",
    restPath: "tasks/categories",
    defaultSort: ["name"],
    defaultDirection: SortDirection.Asc,
    defaultFilter: "",
});

export const {getPaged, getAll, create, update, del, exp, imp, events} = client;
