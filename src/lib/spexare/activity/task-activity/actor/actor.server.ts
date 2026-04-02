import 'server-only';

import {getClient} from '@/lib/urql.server';
import {ActorCreate, ActorUpdate} from "@/gql/graphql";

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
        actorDelete(spexareId: $spexareId,, activityId: $activityId, taskActivityId: $taskActivityId, vocalId: $vocalId, id: $id)
    }
`;

export async function create(spexareId: string, activityId: string, taskActivityId: string, vocalId: string, input: ActorCreate) {
    const result = await getClient()
        .mutation(CreateMutation, {spexareId, activityId, taskActivityId, vocalId, input})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.actorCreate) {
        throw new Error("No data created");
    }

    return result.data?.actorCreate;
}

export async function update(spexareId: string, activityId: string, taskActivityId: string, vocalId: string, id: string, input: ActorUpdate) {
    const result = await getClient()
        .mutation(UpdateMutation, {
            spexareId,
            activityId,
            taskActivityId,
            vocalId,
            input: {
                ...input,
                id
            }
        })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.actorUpdate) {
        throw new Error("No data updated");
    }

    return result.data?.actorUpdate;
}

export async function del(spexareId: string, activityId: string, taskActivityId: string, vocalId: string, id: string) {
    const result = await getClient()
        .mutation(DeleteMutation, {spexareId, activityId, taskActivityId, vocalId, id})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.actorDelete;
}
