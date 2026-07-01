import 'server-only';

import {Membership, MembershipCreate} from "@/gql/graphql";
import {mutateForData, runMutationField} from "@/lib/graphql.server";

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

export async function create(spexareId: string, typeId: string, input: MembershipCreate) {
    return mutateForData<Membership>(CreateMutation, {spexareId, typeId, input}, 'membershipCreate', 'No data created');
}

export async function update(spexareId: string, typeId: string, id: string, input: MembershipCreate) {
    return mutateForData<Membership>(UpdateMutation, {spexareId, typeId, input: {...input, id}}, 'membershipUpdate', 'No data updated');
}

export async function del(spexareId: string, typeId: string, id: string) {
    return runMutationField(DeleteMutation, {spexareId, typeId, id}, 'membershipDelete');
}
