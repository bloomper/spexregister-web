import 'server-only';

import {getClient} from '@/lib/urql.server';

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

export async function create(spexareId: string, typeId: string, input: any) {
    const result = await getClient()
        .mutation(CreateMutation, {spexareId, typeId, input})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.toggleCreate) {
        throw new Error("No data created");
    }

    return result.data?.toggleCreate;
}

export async function update(spexareId: string, typeId: string, id: string, input: any) {
    const result = await getClient()
        .mutation(UpdateMutation, {
            input: {
                ...input,
                spexareId,
                typeId,
                id
            }
        })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.toggleUpdate) {
        throw new Error("No data updated");
    }

    return result.data?.toggleUpdate;
}

export async function del(spexareId: string, typeId: string, id: string) {
    const result = await getClient()
        .mutation(DeleteMutation, {spexareId, typeId, id})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.toggleDelete;
}

