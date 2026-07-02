import "server-only";

import {SortDirection, Tag, TagCreate, TagEdge, TagUpdate} from "@/gql/schema";
import {graphql} from "@/gql";
import {createResourceClient} from "@/lib/graphql.server";

export const TagSummary = graphql(`
    fragment TagSummary on Tag {
        id
        name
    }
`);

export const TagFull = graphql(`
    fragment TagFull on Tag {
        ...TagSummary
        createdAt
        createdBy
        lastModifiedAt
        lastModifiedBy
    }
`);

const TagPagedSummary = graphql(`
    query TagPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        tagPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
            edges { cursor node { ...TagSummary } }
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
        }
    }
`);

const TagPagedFull = graphql(`
    query TagPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        tagPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
            edges { cursor node { ...TagFull } }
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
        }
    }
`);

const TagCreateMutation = graphql(`
    mutation TagCreate($input: TagCreate!) {
        tagCreate(input: $input) { ...TagFull }
    }
`);

const TagUpdateMutation = graphql(`
    mutation TagUpdate($input: TagUpdate!) {
        tagUpdate(input: $input) { ...TagFull }
    }
`);

const TagDeleteMutation = graphql(`
    mutation TagDelete($id: ID!) {
        tagDelete(id: $id)
    }
`);

const TagExportQuery = graphql(`
    query TagExport($ids: [ID], $filter: String, $type: ImpexType!) {
        tagExport(ids: $ids, filter: $filter, type: $type) { id }
    }
`);

const TagEventsQuery = graphql(`
    query TagEvents($sourceId: ID!) {
        tagEvents(sourceId: $sourceId) { id eventType createdAt createdBy }
    }
`);

const client = createResourceClient<Tag, TagEdge, TagCreate, TagUpdate>({
    singular: "tag",
    pagedSummaryQuery: TagPagedSummary,
    pagedFullQuery: TagPagedFull,
    createMutation: TagCreateMutation,
    updateMutation: TagUpdateMutation,
    deleteMutation: TagDeleteMutation,
    exportQuery: TagExportQuery,
    eventsQuery: TagEventsQuery,
    cacheTag: "tag",
    restPath: "tags",
    defaultSort: ["name"],
    defaultDirection: SortDirection.Desc,
    defaultFilter: "",
});

export const {getPaged, getAll, create, update, del, exp, imp, events} = client;
