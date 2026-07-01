import 'server-only';

import {Address, AddressCreate, AddressUpdate} from "@/gql/graphql";
import {mutateForData, runMutationField} from "@/lib/graphql.server";

export const SummaryFields = `
    ...AddressSummary
`;

export const FullFields = `
    ...AddressFull
`;

export const SummaryFragment = /* GraphQL */ `
    fragment AddressSummary on Address {
        id
        streetAddress
        postalCode
        city
        country
        phone
        phoneMobile
        emailAddress
        type {
            id
            label
        }
    }
`;

export const FullFragment = /* GraphQL */ `
    fragment AddressFull on Address {
        ...AddressSummary
        createdAt
        createdBy
        lastModifiedAt
        lastModifiedBy
    }
    ${SummaryFragment}
`;

const CreateMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $typeId: ID!, $input: AddressCreate!) {
        addressCreate(spexareId: $spexareId, typeId: $typeId, input: $input) {
            ${FullFields}
        }
    }
    ${FullFragment}
`;

const UpdateMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $typeId: ID!, $input: AddressUpdate!) {
        addressUpdate(spexareId: $spexareId, typeId: $typeId, input: $input) {
            ${FullFields}
        }
    }
    ${FullFragment}
`;

const DeleteMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $typeId: ID!, $id: ID!) {
        addressDelete(spexareId: $spexareId, typeId: $typeId, id: $id)
    }
`;

export async function create(spexareId: string, typeId: string, input: AddressCreate) {
    return mutateForData<Address>(CreateMutation, {spexareId, typeId, input}, 'addressCreate', 'No data created');
}

export async function update(spexareId: string, typeId: string, id: string, input: Omit<AddressUpdate, "id">) {
    return mutateForData<Address>(UpdateMutation, {spexareId, typeId, input: {...input, id}}, 'addressUpdate', 'No data updated');
}

export async function del(spexareId: string, typeId: string, id: string) {
    return runMutationField(DeleteMutation, {spexareId, typeId, id}, 'addressDelete');
}
