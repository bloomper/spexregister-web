import "server-only";

import {Actor, ActorCreate, ActorUpdate} from "@/gql/schema";
import {graphql} from "@/gql";
import {mutateForData, runMutationField} from "@/lib/graphql.server";

export const ActorSummary = graphql(`
    fragment ActorSummary on Actor {
        id
        role
        vocal {
            id
            label
        }
    }
`);

export const ActorFull = graphql(`
    fragment ActorFull on Actor {
        ...ActorSummary
        createdAt
        createdBy
        lastModifiedAt
        lastModifiedBy
    }
`);

const ActorCreateMutation = graphql(`
    mutation ActorCreate($spexareId: ID!, $activityId: ID!, $taskActivityId: ID!, $vocalId: ID!, $input: ActorCreate!) {
        actorCreate(spexareId: $spexareId, activityId: $activityId, taskActivityId: $taskActivityId, vocalId: $vocalId, input: $input) {
            ...ActorFull
        }
    }
`);

const ActorUpdateMutation = graphql(`
    mutation ActorUpdate($spexareId: ID!, $activityId: ID!, $taskActivityId: ID!, $vocalId: ID!, $input: ActorUpdate!) {
        actorUpdate(spexareId: $spexareId, activityId: $activityId, taskActivityId: $taskActivityId, vocalId: $vocalId, input: $input) {
            ...ActorFull
        }
    }
`);

const ActorDeleteMutation = graphql(`
    mutation ActorDelete($spexareId: ID!, $activityId: ID!, $taskActivityId: ID!, $vocalId: ID!, $id: ID!) {
        actorDelete(spexareId: $spexareId, activityId: $activityId, taskActivityId: $taskActivityId, vocalId: $vocalId, id: $id)
    }
`);

export async function create(spexareId: string, activityId: string, taskActivityId: string, vocalId: string, input: ActorCreate): Promise<Actor> {
    return mutateForData(ActorCreateMutation, {
        spexareId,
        activityId,
        taskActivityId,
        vocalId,
        input
    }, "actorCreate", "No data created") as Promise<Actor>;
}

export async function update(spexareId: string, activityId: string, taskActivityId: string, vocalId: string, id: string, input: Omit<ActorUpdate, "id">): Promise<Actor> {
    return mutateForData(ActorUpdateMutation, {
        spexareId,
        activityId,
        taskActivityId,
        vocalId,
        input: {...input, id}
    }, "actorUpdate", "No data updated") as Promise<Actor>;
}

export async function del(spexareId: string, activityId: string, taskActivityId: string, vocalId: string, id: string) {
    return runMutationField(ActorDeleteMutation, {spexareId, activityId, taskActivityId, vocalId, id}, "actorDelete");
}
