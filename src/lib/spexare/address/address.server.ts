import 'server-only';

import {getClient} from '@/lib/urql.server';

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

export async function create(spexareId: string, typeId: string, input: any) {
    const result = await getClient()
        .mutation(CreateMutation, {spexareId, typeId, input})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.addressCreate) {
        throw new Error("No data created");
    }

    return result.data?.addressCreate;
}

export async function update(spexareId: string, typeId: string, id: string, input: any) {
    const result = await getClient()
        .mutation(UpdateMutation, {
            spexareId,
            typeId,
            input: {
                ...input,
                id
            }
        })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.addressUpdate) {
        throw new Error("No data updated");
    }

    return result.data?.addressUpdate;
}

export async function del(spexareId: string, typeId: string, id: string) {
    const result = await getClient()
        .mutation(DeleteMutation, {spexareId, typeId, id})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.addressDelete;
}

