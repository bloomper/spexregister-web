import "server-only";

import {AuditedType, SortDirection, Spex, SpexEdge} from "@/gql/schema";
import {graphql} from "@/gql";
import {createResourceClient} from "@/lib/graphql.server";

export const SpexSummary = graphql(`
    fragment SpexSummary on Spex {
        id
        year
        title
        posterUrl
        revival
        retired
        revivals {
            id
            year
        }
        category {
            id
            name
        }
    }
`);

export const SpexFull = graphql(`
    fragment SpexFull on Spex {
        ...SpexSummary
        createdAt
        createdBy
        lastModifiedAt
        lastModifiedBy
    }
`);

const SpexPagedSummary = graphql(`
    query SpexPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        spexPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
            edges { cursor node { ...SpexSummary } }
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
            totalCount
        }
    }
`);

const SpexPagedFull = graphql(`
    query SpexPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        spexPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
            edges { cursor node { ...SpexFull } }
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
            totalCount
        }
    }
`);

const SpexGetQuery = graphql(`
    query SpexGet($id: ID!) {
        spex(id: $id) { ...SpexFull }
    }
`);


const client = createResourceClient<Spex, SpexEdge, never, {id?: unknown}>({
    singular: "spex",
    pagedSummaryQuery: SpexPagedSummary,
    pagedFullQuery: SpexPagedFull,
    getQuery: SpexGetQuery,
    auditedType: AuditedType.Spex,
    cacheTag: "spex",
    restPath: "spex",
    defaultSort: ["year"],
    defaultDirection: SortDirection.Desc,
    defaultFilter: "parent:NULL",
});

// Read only: Spexipedia keeps spex and revivals
export const {getPaged, get, getAll} = client;

