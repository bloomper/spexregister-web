import "server-only";

import {SortDirection, SpexCategory, SpexCategoryCreate, SpexCategoryEdge, SpexCategoryUpdate} from "@/gql/schema";
import {graphql} from "@/gql";
import {createResourceClient} from "@/lib/graphql.server";
import axios from "@/lib/axios.server";

export const SpexCategorySummary = graphql(`
    fragment SpexCategorySummary on SpexCategory {
        id
        name
        logoUrl
        firstYear
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
        }
    }
`);

const SpexCategoryPagedFull = graphql(`
    query SpexCategoryPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        spexCategoryPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
            edges { cursor node { ...SpexCategoryFull } }
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
        }
    }
`);

const SpexCategoryCreateMutation = graphql(`
    mutation SpexCategoryCreate($input: SpexCategoryCreate!) {
        spexCategoryCreate(input: $input) { ...SpexCategoryFull }
    }
`);

const SpexCategoryUpdateMutation = graphql(`
    mutation SpexCategoryUpdate($input: SpexCategoryUpdate!) {
        spexCategoryUpdate(input: $input) { ...SpexCategoryFull }
    }
`);

const SpexCategoryDeleteMutation = graphql(`
    mutation SpexCategoryDelete($id: ID!) {
        spexCategoryDelete(id: $id)
    }
`);

const SpexCategoryExportQuery = graphql(`
    query SpexCategoryExport($ids: [ID], $filter: String, $type: ImpexType!) {
        spexCategoryExport(ids: $ids, filter: $filter, type: $type) { id }
    }
`);

const SpexCategoryEventsQuery = graphql(`
    query SpexCategoryEvents($sourceId: ID!) {
        spexCategoryEvents(sourceId: $sourceId) { id eventType createdAt createdBy }
    }
`);

const client = createResourceClient<SpexCategory, SpexCategoryEdge, SpexCategoryCreate, SpexCategoryUpdate>({
    singular: "spexCategory",
    pagedSummaryQuery: SpexCategoryPagedSummary,
    pagedFullQuery: SpexCategoryPagedFull,
    createMutation: SpexCategoryCreateMutation,
    updateMutation: SpexCategoryUpdateMutation,
    deleteMutation: SpexCategoryDeleteMutation,
    exportQuery: SpexCategoryExportQuery,
    eventsQuery: SpexCategoryEventsQuery,
    cacheTag: "spex-category",
    restPath: "spex/categories",
    defaultSort: ["name"],
    defaultDirection: SortDirection.Asc,
    defaultFilter: "",
});

export const {getPaged, getAll, create, update, del, exp, imp, events} = client;

export async function uploadLogo(id: string, file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const response = await axios.put(`${process.env.API_REST_BASE_URL}/api/spex/categories/${id}/logo`, arrayBuffer, {
        headers: {
            "Content-Type": file.type,
        }
    });
    return response.data;
}

export async function deleteLogo(id: string) {
    await axios.delete(`${process.env.API_REST_BASE_URL}/api/spex/categories/${id}/logo`);
    return {success: true};
}
