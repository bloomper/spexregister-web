import "server-only";

import {AuditedType, SortDirection, SpexCategory, SpexCategoryEdge} from "@/gql/schema";
import {graphql} from "@/gql";
import {createResourceClient} from "@/lib/graphql.server";

export const SpexCategorySummary = graphql(`
    fragment SpexCategorySummary on SpexCategory {
        id
        name
        logoUrl
        firstYear
        retired
    }
`);

export const SpexCategoryFull = graphql(`
    fragment SpexCategoryFull on SpexCategory {
        ...SpexCategorySummary
        createdAt
        createdBy
        lastModifiedAt
        lastModifiedBy
    }
`);

const SpexCategoryPagedSummary = graphql(`
    query SpexCategoryPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        spexCategoryPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
            edges { cursor node { ...SpexCategorySummary } }
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
            totalCount
        }
    }
`);

const SpexCategoryPagedFull = graphql(`
    query SpexCategoryPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        spexCategoryPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
            edges { cursor node { ...SpexCategoryFull } }
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
            totalCount
        }
    }
`);

const SpexCategoryGetQuery = graphql(`
    query SpexCategoryGet($id: ID!) {
        spexCategory(id: $id) { ...SpexCategoryFull }
    }
`);

const SpexCategoryExportQuery = graphql(`
    query SpexCategoryExport($ids: [ID], $filter: String, $type: ImpexType!) {
        spexCategoryExport(ids: $ids, filter: $filter, type: $type) { id }
    }
`);

const client = createResourceClient<SpexCategory, SpexCategoryEdge, never, {id?: unknown}>({
    singular: "spexCategory",
    pagedSummaryQuery: SpexCategoryPagedSummary,
    pagedFullQuery: SpexCategoryPagedFull,
    getQuery: SpexCategoryGetQuery,
    exportQuery: SpexCategoryExportQuery,
    auditedType: AuditedType.SpexCategory,
    cacheTag: "spex-category",
    restPath: "spex/categories",
    defaultSort: ["name"],
    defaultDirection: SortDirection.Asc,
    defaultFilter: "",
});

// Read only: Spexipedia keeps base data
export const {getPaged, get, getAll, exp, revisions} = client;

