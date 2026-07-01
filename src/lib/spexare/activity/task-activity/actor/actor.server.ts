import 'server-only';

import {Actor, ActorCreate, ActorUpdate} from "@/gql/graphql";
import {mutateForData, runMutationField} from "@/lib/graphql.server";

export const SummaryFields = `
    ...ActorSummary
`;

export const FullFields = `
    ...ActorFull
`;

export const SummaryFragment = /* GraphQL */ `
    fragment ActorSummary on Actor {
        id
        role
        vocal {
            id
            label
        }
    }
`;

export const FullFragment = /* GraphQL */ `
    fragment ActorFull on Actor {
        ...ActorSummary
        createdAt
        createdBy
        lastModifiedAt
        lastModifiedBy
    }
    ${SummaryFragment}
`;

const CreateMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $activityId: ID!, $taskActivityId: ID!, $vocalId: ID!, $input: ActorCreate!) {
        actorCreate(spexareId: $spexareId, activityId: $activityId, taskActivityId: $taskActivityId, vocalId: $vocalId, input: $input) {
            ${FullFields}
        }
    }
    ${FullFragment}
`;

const UpdateMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $activityId: ID!, $taskActivityId: ID!, $vocalId: ID!, $input: ActorUpdate!) {
        actorUpdate(spexareId: $spexareId, activityId: $activityId, taskActivityId: $taskActivityId, vocalId: $vocalId, input: $input) {
            ${FullFields}
        }
    }
    ${FullFragment}
`;

const DeleteMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $activityId: ID!, $taskActivityId: ID!, $vocalId: ID!, $id: ID!) {
        actorDelete(spexareId: $spexareId, activityId: $activityId, taskActivityId: $taskActivityId, vocalId: $vocalId, id: $id)
    }
`;

export async function create(spexareId: string, activityId: string, taskActivityId: string, vocalId: string, input: ActorCreate) {
    return mutateForData<Actor>(CreateMutation, {spexareId, activityId, taskActivityId, vocalId, input}, 'actorCreate', 'No data created');
}

export async function update(spexareId: string, activityId: string, taskActivityId: string, vocalId: string, id: string, input: Omit<ActorUpdate, "id">) {
    return mutateForData<Actor>(UpdateMutation, {spexareId, activityId, taskActivityId, vocalId, input: {...input, id}}, 'actorUpdate', 'No data updated');
}

export async function del(spexareId: string, activityId: string, taskActivityId: string, vocalId: string, id: string) {
    return runMutationField(DeleteMutation, {spexareId, activityId, taskActivityId, vocalId, id}, 'actorDelete');
}
