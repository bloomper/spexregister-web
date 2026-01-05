import 'server-only';

import {getClient} from '@/lib/urql.server';

export const SummaryFields = `
    ...MembershipSummary
`;

export const FullFields = `
    ...MembershipFull
`;

export const SummaryFragment = /* GraphQL */ `
    fragment MembershipSummary on Membership {
        id
        year
        type {
            id
            label
        }
    }
`;

export const FullFragment = /* GraphQL */ `
    fragment MembershipFull on Membership {
        ...MembershipSummary
        createdAt
        createdBy
        lastModifiedAt
        lastModifiedBy
    }
    ${SummaryFragment}
`;

const CreateMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $typeId: ID!, $input: MembershipCreate!) {
        membershipCreate(spexareId: $spexareId, typeId: $typeId, input: $input) {
            ${FullFields}
        }
    }
    ${FullFragment}
`;

const UpdateMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $typeId: ID!, $input: MembershipUpdate!) {
        membershipUpdate(spexareId: $spexareId, typeId: $typeId, input: $input) {
            ${FullFields}
        }
    }
    ${FullFragment}
`;

const DeleteMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $typeId: ID!, $id: ID!) {
        membershipDelete(spexareId: $spexareId, typeId: $typeId, id: $id)
    }
`;

export async function create(spexareId: string, typeId: string, input: any) {
    const result = await getClient()
        .mutation(CreateMutation, {spexareId, typeId, input})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.membershipCreate) {
        throw new Error("No data created");
    }

    return result.data?.membershipCreate;
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

    if (!result.data?.membershipUpdate) {
        throw new Error("No data updated");
    }

    return result.data?.membershipUpdate;
}

export async function del(spexareId: string, typeId: string, id: string) {
    const result = await getClient()
        .mutation(DeleteMutation, {spexareId, typeId, id})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.membershipDelete;
}

