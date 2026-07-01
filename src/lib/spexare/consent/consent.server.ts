import 'server-only';

import {Consent, ConsentCreate, ConsentUpdate} from "@/gql/graphql";
import {mutateForData, runMutationField} from "@/lib/graphql.server";

export const SummaryFields = `
    ...ConsentSummary
`;

export const FullFields = `
    ...ConsentFull
`;

export const SummaryFragment = /* GraphQL */ `
    fragment ConsentSummary on Consent {
        id
        value
        type {
            id
            label
        }
    }
`;

export const FullFragment = /* GraphQL */ `
    fragment ConsentFull on Consent {
        ...ConsentSummary
        createdAt
        createdBy
        lastModifiedAt
        lastModifiedBy
    }
    ${SummaryFragment}
`;

const CreateMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $typeId: ID!, $input: ConsentCreate!) {
        consentCreate(spexareId: $spexareId, typeId: $typeId, input: $input) {
            ${FullFields}
        }
    }
    ${FullFragment}
`;

const UpdateMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $typeId: ID!, $input: ConsentUpdate!) {
        consentUpdate(spexareId: $spexareId, typeId: $typeId, input: $input) {
            ${FullFields}
        }
    }
    ${FullFragment}
`;

const DeleteMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $typeId: ID!, $id: ID!) {
        consentDelete(spexareId: $spexareId, typeId: $typeId, id: $id)
    }
`;

export async function create(spexareId: string, typeId: string, input: ConsentCreate) {
    return mutateForData<Consent>(CreateMutation, {spexareId, typeId, input}, 'consentCreate', 'No data created');
}

export async function update(spexareId: string, typeId: string, id: string, input: Omit<ConsentUpdate, "id">) {
    return mutateForData<Consent>(UpdateMutation, {spexareId, typeId, input: {...input, id}}, 'consentUpdate', 'No data updated');
}

export async function del(spexareId: string, typeId: string, id: string) {
    return runMutationField(DeleteMutation, {spexareId, typeId, id}, 'consentDelete');
}
