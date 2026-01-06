import 'server-only';

import {getClient} from '@/lib/urql.server';

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

export async function create(spexareId: string, typeId: string, input: any) {
    const result = await getClient()
        .mutation(CreateMutation, {spexareId, typeId, input})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.consentCreate) {
        throw new Error("No data created");
    }

    return result.data?.consentCreate;
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

    if (!result.data?.consentUpdate) {
        throw new Error("No data updated");
    }

    return result.data?.consentUpdate;
}

export async function del(spexareId: string, typeId: string, id: string) {
    const result = await getClient()
        .mutation(DeleteMutation, {spexareId, typeId, id})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.consentDelete;
}

