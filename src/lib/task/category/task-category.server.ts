import "server-only";

import { AuditedType, SortDirection, TaskCategory, TaskCategoryEdge } from "@/gql/schema";
import { graphql } from "@/gql";
import { createResourceClient } from "@/lib/graphql.server";

export const TaskCategorySummary = graphql(`
    fragment TaskCategorySummary on TaskCategory {
        id
        name
        actorPresent
        retired
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
            totalCount
        }
    }
`);

const TaskCategoryPagedFull = graphql(`
    query TaskCategoryPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        taskCategoryPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
            edges { cursor node { ...TaskCategoryFull } }
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
            totalCount
        }
    }
`);

const TaskCategoryGetQuery = graphql(`
    query TaskCategoryGet($id: ID!) {
        taskCategory(id: $id) { ...TaskCategoryFull }
    }
`);

const client = createResourceClient<TaskCategory, TaskCategoryEdge, never, { id?: unknown }>({
  singular: "taskCategory",
  pagedSummaryQuery: TaskCategoryPagedSummary,
  pagedFullQuery: TaskCategoryPagedFull,
  getQuery: TaskCategoryGetQuery,
  auditedType: AuditedType.TaskCategory,
  cacheTag: "task-category",
  restPath: "tasks/categories",
  defaultSort: ["name"],
  defaultDirection: SortDirection.Asc,
  defaultFilter: "",
});

// Read only: Spexipedia keeps base data
export const { getPaged, get, getAll } = client;
