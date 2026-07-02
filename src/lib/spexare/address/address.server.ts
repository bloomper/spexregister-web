import "server-only";

import {Address, AddressCreate, AddressUpdate} from "@/gql/schema";
import {graphql} from "@/gql";
import {mutateForData, runMutationField} from "@/lib/graphql.server";

export const AddressSummary = graphql(`
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
`);

export const AddressFull = graphql(`
    fragment AddressFull on Address {
        ...AddressSummary
        createdAt
        createdBy
        lastModifiedAt
        lastModifiedBy
    }
`);

const AddressCreateMutation = graphql(`
    mutation AddressCreate($spexareId: ID!, $typeId: ID!, $input: AddressCreate!) {
        addressCreate(spexareId: $spexareId, typeId: $typeId, input: $input) {
            ...AddressFull
        }
    }
`);

const AddressUpdateMutation = graphql(`
    mutation AddressUpdate($spexareId: ID!, $typeId: ID!, $input: AddressUpdate!) {
        addressUpdate(spexareId: $spexareId, typeId: $typeId, input: $input) {
            ...AddressFull
        }
    }
`);

const AddressDeleteMutation = graphql(`
    mutation AddressDelete($spexareId: ID!, $typeId: ID!, $id: ID!) {
        addressDelete(spexareId: $spexareId, typeId: $typeId, id: $id)
    }
`);

export async function create(spexareId: string, typeId: string, input: AddressCreate): Promise<Address> {
    return mutateForData(AddressCreateMutation, {
        spexareId,
        typeId,
        input
    }, "addressCreate", "No data created") as Promise<Address>;
}

export async function update(spexareId: string, typeId: string, id: string, input: Omit<AddressUpdate, "id">): Promise<Address> {
    return mutateForData(AddressUpdateMutation, {
        spexareId,
        typeId,
        input: {...input, id}
    }, "addressUpdate", "No data updated") as Promise<Address>;
}

export async function del(spexareId: string, typeId: string, id: string) {
    return runMutationField(AddressDeleteMutation, {spexareId, typeId, id}, "addressDelete");
}
