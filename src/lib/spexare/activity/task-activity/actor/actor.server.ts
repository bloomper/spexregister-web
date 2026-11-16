import "server-only";

import {Actor, ActorCreate, ActorUpdate, SpexCharacter} from "@/gql/schema";
import {graphql} from "@/gql";
import {mutateForData, runMutationField, runQuery} from "@/lib/graphql.server";

export const ActorSummary = graphql(`
    fragment ActorSummary on Actor {
        id
        role
        vocal {
            id
            label
        }
        character {
            id
            name
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
    mutation ActorCreate($spexareId: ID!, $activityId: ID!, $taskActivityId: ID!, $vocalId: ID!, $input: ActorCreate!, $characterId: ID) {
        actorCreate(spexareId: $spexareId, activityId: $activityId, taskActivityId: $taskActivityId, vocalId: $vocalId, input: $input, characterId: $characterId) {
            ...ActorFull
        }
    }
`);

const ActorUpdateMutation = graphql(`
    mutation ActorUpdate($spexareId: ID!, $activityId: ID!, $taskActivityId: ID!, $vocalId: ID!, $input: ActorUpdate!, $characterId: ID) {
        actorUpdate(spexareId: $spexareId, activityId: $activityId, taskActivityId: $taskActivityId, vocalId: $vocalId, input: $input, characterId: $characterId) {
            ...ActorFull
        }
    }
`);

const SpexCharactersQuery = graphql(`
    query SpexCharacters($spexId: ID!) {
        spexCharacters(spexId: $spexId) {
            id
            name
            position
            retired
            spexId
        }
    }
`);

const ActorDeleteMutation = graphql(`
    mutation ActorDelete($spexareId: ID!, $activityId: ID!, $taskActivityId: ID!, $vocalId: ID!, $id: ID!) {
        actorDelete(spexareId: $spexareId, activityId: $activityId, taskActivityId: $taskActivityId, vocalId: $vocalId, id: $id)
    }
`);

/**
 * The characters an actor of the spex may play, copied from Spexipedia: its own and, for a revival, its parent's.
 */
export async function getCharacters(spexId: string): Promise<SpexCharacter[]> {
    const data = await runQuery(SpexCharactersQuery, {spexId});

    return (data?.spexCharacters ?? []) as SpexCharacter[];
}

export async function create(spexareId: string, activityId: string, taskActivityId: string, vocalId: string, input: ActorCreate, characterId?: string | null): Promise<Actor> {
    return mutateForData(ActorCreateMutation, {
        spexareId,
        activityId,
        taskActivityId,
        vocalId,
        input,
        characterId: characterId ?? null
    }, "actorCreate", "No data created") as Promise<Actor>;
}

/**
 * Changes the actor. A null characterId clears the character.
 */
export async function update(spexareId: string, activityId: string, taskActivityId: string, vocalId: string, id: string, input: Omit<ActorUpdate, "id">, characterId: string | null): Promise<Actor> {
    return mutateForData(ActorUpdateMutation, {
        spexareId,
        activityId,
        taskActivityId,
        vocalId,
        input: {...input, id},
        characterId
    }, "actorUpdate", "No data updated") as Promise<Actor>;
}

export async function del(spexareId: string, activityId: string, taskActivityId: string, vocalId: string, id: string) {
    return runMutationField(ActorDeleteMutation, {spexareId, activityId, taskActivityId, vocalId, id}, "actorDelete");
}
