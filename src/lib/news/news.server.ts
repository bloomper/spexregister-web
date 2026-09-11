import "server-only";

import {AuditedType, News, NewsCreate, NewsEdge, NewsUpdate, SortDirection} from "@/gql/schema";
import {graphql} from "@/gql";
import {createResourceClient} from "@/lib/graphql.server";

export const NewsSummary = graphql(`
    fragment NewsSummary on News {
        id
        subject
        text
        visibleFrom
    }
`);

export const NewsFull = graphql(`
    fragment NewsFull on News {
        ...NewsSummary
        published
        visibleTo
        createdAt
        createdBy
        lastModifiedAt
        lastModifiedBy
    }
`);

const NewsPagedSummary = graphql(`
    query NewsPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        newsPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
            edges { cursor node { ...NewsSummary } }
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
            totalCount
        }
    }
`);

const NewsPagedFull = graphql(`
    query NewsPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        newsPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
            edges { cursor node { ...NewsFull } }
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
            totalCount
        }
    }
`);

const NewsGetQuery = graphql(`
    query NewsGet($id: ID!) {
        news(id: $id) { ...NewsFull }
    }
`);

const NewsCreateMutation = graphql(`
    mutation NewsCreate($input: NewsCreate!) {
        newsCreate(input: $input) { ...NewsFull }
    }
`);

const NewsUpdateMutation = graphql(`
    mutation NewsUpdate($input: NewsUpdate!) {
        newsUpdate(input: $input) { ...NewsFull }
    }
`);

const NewsDeleteMutation = graphql(`
    mutation NewsDelete($id: ID!) {
        newsDelete(id: $id)
    }
`);

const NewsExportQuery = graphql(`
    query NewsExport($ids: [ID], $filter: String, $type: ImpexType!) {
        newsExport(ids: $ids, filter: $filter, type: $type) { id }
    }
`);

const client = createResourceClient<News, NewsEdge, NewsCreate, NewsUpdate>({
    singular: "news",
    pagedSummaryQuery: NewsPagedSummary,
    pagedFullQuery: NewsPagedFull,
    getQuery: NewsGetQuery,
    createMutation: NewsCreateMutation,
    updateMutation: NewsUpdateMutation,
    deleteMutation: NewsDeleteMutation,
    exportQuery: NewsExportQuery,
    auditedType: AuditedType.News,
    cacheTag: "news",
    restPath: "news",
    defaultSort: ["visibleFrom"],
    defaultDirection: SortDirection.Desc,
    defaultFilter: "published:TRUE",
});

export const {getPaged, get, create, update, del, exp, imp, revisions} = client;
