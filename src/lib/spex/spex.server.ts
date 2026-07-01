import 'server-only';

import {Spex, SpexCreate, SpexEdge, SpexUpdate, SortDirection} from "@/gql/graphql";
import {createResourceClient, runMutationField} from "@/lib/graphql.server";
import axios from "@/lib/axios.server";

const SummaryFields = `
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
`;

const FullFields = `
    ${SummaryFields}
    revival
    createdAt
    createdBy
    lastModifiedAt
    lastModifiedBy
`;

const client = createResourceClient<Spex, SpexEdge, SpexCreate, SpexUpdate>({
    singular: 'spex',
    createInputType: 'SpexCreate',
    updateInputType: 'SpexUpdate',
    summaryFields: SummaryFields,
    fullFields: FullFields,
    cacheTag: 'spex',
    restPath: 'spex',
    defaultSort: ['year'],
    defaultDirection: SortDirection.Desc,
    defaultFilter: 'parent:NULL',
});

export const {getPaged, getAll, create, update, del, exp, imp, events} = client;

const AddCategoryMutation = /* GraphQL */ `
    mutation ($id: ID!, $categoryId: ID!) {
        spexCategoryAdd(spexId: $id, id: $categoryId)
    }
`;

const RemoveCategoryMutation = /* GraphQL */ `
    mutation ($id: ID!) {
        spexCategoryRemove(spexId: $id)
    }
`;

const CreateRevivalMutation = /* GraphQL */ `
    mutation ($spexId: ID!, $year: Year!) {
        spexRevivalCreate(spexId: $spexId, year: $year) {
            id
            year
        }
    }
`;

const DeleteRevivalMutation = /* GraphQL */ `
    mutation ($id: ID!, $spexId: ID!) {
        spexRevivalDelete(spexId: $spexId, id: $id)
    }
`;

export async function addCategory(id: string, categoryId: string) {
    return runMutationField(AddCategoryMutation, {id, categoryId}, 'spexCategoryAdd');
}

export async function removeCategory(id: string) {
    return runMutationField(RemoveCategoryMutation, {id}, 'spexCategoryRemove');
}

export async function createRevival(spexId: string, year: string) {
    return runMutationField(CreateRevivalMutation, {spexId, year}, 'spexRevivalCreate');
}

export async function deleteRevival(spexId: string, id: string) {
    return runMutationField(DeleteRevivalMutation, {spexId, id}, 'spexRevivalDelete');
}

export async function uploadPoster(id: string, file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const response = await axios.put(`${process.env.API_REST_BASE_URL}/api/spex/${id}/poster`, arrayBuffer, {
        headers: {
            'Content-Type': file.type,
        }
    });
    return response.data;
}

export async function deletePoster(id: string) {
    await axios.delete(`${process.env.API_REST_BASE_URL}/api/spex/${id}/poster`);
    return {success: true};
}
