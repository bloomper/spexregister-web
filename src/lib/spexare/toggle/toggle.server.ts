import 'server-only';

import {Toggle, ToggleCreate, ToggleUpdate} from "@/gql/graphql";
import {mutateForData, runMutationField} from "@/lib/graphql.server";

export const SummaryFields = `
    ...ToggleSummary
`;

export const FullFields = `
    ...ToggleFull
`;

export const SummaryFragment = /* GraphQL */ `
    fragment ToggleSummary on Toggle {
        id
        value
        type {
            id
            label
        }
    }
`;

export const FullFragment = /* GraphQL */ `
    fragment ToggleFull on Toggle {
        ...ToggleSummary
        createdAt
        createdBy
        lastModifiedAt
        lastModifiedBy
    }
    ${SummaryFragment}
`;

const CreateMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $typeId: ID!, $input: ToggleCreate!) {
        toggleCreate(spexareId: $spexareId, typeId: $typeId, input: $input) {
            ${FullFields}
        }
    }
    ${FullFragment}
`;

const UpdateMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $typeId: ID!, $input: ToggleUpdate!) {
        toggleUpdate(spexareId: $spexareId, typeId: $typeId, input: $input) {
            ${FullFields}
        }
    }
    ${FullFragment}
`;

const DeleteMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $typeId: ID!, $id: ID!) {
        toggleDelete(spexareId: $spexareId, typeId: $typeId, id: $id)
    }
`;

export async function create(spexareId: string, typeId: string, input: ToggleCreate) {
    return mutateForData<Toggle>(CreateMutation, {spexareId, typeId, input}, 'toggleCreate', 'No data created');
}

export async function update(spexareId: string, typeId: string, id: string, input: Omit<ToggleUpdate, "id">) {
    return mutateForData<Toggle>(UpdateMutation, {spexareId, typeId, input: {...input, id}}, 'toggleUpdate', 'No data updated');
}

export async function del(spexareId: string, typeId: string, id: string) {
    return runMutationField(DeleteMutation, {spexareId, typeId, id}, 'toggleDelete');
}
