import "server-only";

import { AuditedType, SortDirection, Task, TaskEdge } from "@/gql/schema";
import { graphql } from "@/gql";
import { createResourceClient } from "@/lib/graphql.server";

export const TaskSummary = graphql(`
    fragment TaskSummary on Task {
        id
        name
        retired
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
            totalCount
        }
    }
`);

const TaskPagedFull = graphql(`
    query TaskPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        taskPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
            edges { cursor node { ...TaskFull } }
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
            totalCount
        }
    }
`);

const TaskGetQuery = graphql(`
    query TaskGet($id: ID!) {
        task(id: $id) { ...TaskFull }
    }
`);

const client = createResourceClient<Task, TaskEdge, never, { id?: unknown }>({
  singular: "task",
  pagedSummaryQuery: TaskPagedSummary,
  pagedFullQuery: TaskPagedFull,
  getQuery: TaskGetQuery,
  auditedType: AuditedType.Task,
  cacheTag: "task",
  restPath: "tasks",
  defaultSort: ["name"],
  defaultDirection: SortDirection.Asc,
  defaultFilter: "",
});

// Read only: Spexipedia keeps base data
export const { getPaged, get, getAll } = client;
