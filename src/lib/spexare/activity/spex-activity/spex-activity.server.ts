import 'server-only';

import {SpexActivity} from "@/gql/graphql";
import {mutateForData, runMutationField} from "@/lib/graphql.server";

export const SummaryFields = `
    ...SpexActivitySummary
`;

export const FullFields = `
    ...SpexActivityFull
`;

const BaseFragment = /* GraphQL */ `
    fragment SpexActivityBase on SpexActivity {
        id
        spex {
            id
            year
            title
            revival
            category {
                name
            }
        }
    }
`;

export const SummaryFragment = /* GraphQL */ `
    fragment SpexActivitySummary on SpexActivity {
        ...SpexActivityBase
    }
    ${BaseFragment}
`;

export const FullFragment = /* GraphQL */ `
    fragment SpexActivityFull on SpexActivity {
        ...SpexActivityBase
        createdAt
        createdBy
        lastModifiedAt
        lastModifiedBy
    }
    ${BaseFragment}
`;

const CreateMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $activityId: ID!, $spexId: ID!) {
        spexActivityCreate(spexareId: $spexareId, activityId: $activityId, spexId: $spexId) {
            ${FullFields}
        }
    }
    ${FullFragment}
`;

const UpdateMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $activityId: ID!, $spexId: ID!, $id: ID!) {
        spexActivityUpdate(spexareId: $spexareId, activityId: $activityId, spexId: $spexId, id: $id) {
            ${FullFields}
        }
    }
    ${FullFragment}
`;

const DeleteMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $activityId: ID!, $id: ID!) {
        spexActivityDelete(spexareId: $spexareId, activityId: $activityId, id: $id)
    }
`;

export async function create(spexareId: string, activityId: string, spexId: string) {
    return mutateForData<SpexActivity>(CreateMutation, {spexareId, activityId, spexId}, 'spexActivityCreate', 'No data created');
}

export async function update(spexareId: string, activityId: string, spexId: string, id: string) {
    return mutateForData<SpexActivity>(UpdateMutation, {spexareId, activityId, spexId, id}, 'spexActivityUpdate', 'No data updated');
}

export async function del(spexareId: string, activityId: string, id: string) {
    return runMutationField(DeleteMutation, {spexareId, activityId, id}, 'spexActivityDelete');
}
