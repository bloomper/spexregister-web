import "server-only";

import {SortDirection, Spex, SpexCreate, SpexEdge, SpexUpdate} from "@/gql/schema";
import {graphql} from "@/gql";
import {createResourceClient, runMutationField} from "@/lib/graphql.server";
import axios from "@/lib/axios.server";

export const SpexSummary = graphql(`
    fragment SpexSummary on Spex {
        id
        year
        title
        posterUrl
        revival
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
        }
    }
`);

const SpexPagedFull = graphql(`
    query SpexPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        spexPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
            edges { cursor node { ...SpexFull } }
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
        }
    }
`);

const SpexCreateMutation = graphql(`
    mutation SpexCreate($input: SpexCreate!) {
        spexCreate(input: $input) { ...SpexFull }
    }
`);

const SpexUpdateMutation = graphql(`
    mutation SpexUpdate($input: SpexUpdate!) {
        spexUpdate(input: $input) { ...SpexFull }
    }
`);

const SpexDeleteMutation = graphql(`
    mutation SpexDelete($id: ID!) {
        spexDelete(id: $id)
    }
`);

const SpexExportQuery = graphql(`
    query SpexExport($ids: [ID], $filter: String, $type: ImpexType!) {
        spexExport(ids: $ids, filter: $filter, type: $type) { id }
    }
`);

const SpexEventsQuery = graphql(`
    query SpexEvents($sourceId: ID!) {
        spexEvents(sourceId: $sourceId) { id eventType createdAt createdBy }
    }
`);

const client = createResourceClient<Spex, SpexEdge, SpexCreate, SpexUpdate>({
    singular: "spex",
    pagedSummaryQuery: SpexPagedSummary,
    pagedFullQuery: SpexPagedFull,
    createMutation: SpexCreateMutation,
    updateMutation: SpexUpdateMutation,
    deleteMutation: SpexDeleteMutation,
    exportQuery: SpexExportQuery,
    eventsQuery: SpexEventsQuery,
    cacheTag: "spex",
    restPath: "spex",
    defaultSort: ["year"],
    defaultDirection: SortDirection.Desc,
    defaultFilter: "parent:NULL",
});

export const {getPaged, getAll, create, update, del, exp, imp, events} = client;

const SpexCategoryAddMutation = graphql(`
    mutation SpexCategoryAdd($id: ID!, $categoryId: ID!) {
        spexCategoryAdd(spexId: $id, id: $categoryId)
    }
`);

const SpexCategoryRemoveMutation = graphql(`
    mutation SpexCategoryRemove($id: ID!) {
        spexCategoryRemove(spexId: $id)
    }
`);

const SpexRevivalCreateMutation = graphql(`
    mutation SpexRevivalCreate($spexId: ID!, $year: Year!) {
        spexRevivalCreate(spexId: $spexId, year: $year) {
            id
            year
        }
    }
`);

const SpexRevivalDeleteMutation = graphql(`
    mutation SpexRevivalDelete($id: ID!, $spexId: ID!) {
        spexRevivalDelete(spexId: $spexId, id: $id)
    }
`);

export async function addCategory(id: string, categoryId: string) {
    return runMutationField(SpexCategoryAddMutation, {id, categoryId}, "spexCategoryAdd");
}

export async function removeCategory(id: string) {
    return runMutationField(SpexCategoryRemoveMutation, {id}, "spexCategoryRemove");
}

export async function createRevival(spexId: string, year: string) {
    return runMutationField(SpexRevivalCreateMutation, {spexId, year}, "spexRevivalCreate");
}

export async function deleteRevival(spexId: string, id: string) {
    return runMutationField(SpexRevivalDeleteMutation, {spexId, id}, "spexRevivalDelete");
}

export async function uploadPoster(id: string, file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const response = await axios.put(`${process.env.API_REST_BASE_URL}/api/spex/${id}/poster`, arrayBuffer, {
        headers: {
            "Content-Type": file.type,
        }
    });
    return response.data;
}

export async function deletePoster(id: string) {
    await axios.delete(`${process.env.API_REST_BASE_URL}/api/spex/${id}/poster`);
    return {success: true};
}
