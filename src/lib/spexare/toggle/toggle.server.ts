import 'server-only';

import {Toggle, ToggleCreate, ToggleUpdate} from "@/gql/schema";
import {graphql} from "@/gql";
import {mutateForData, runMutationField} from "@/lib/graphql.server";

export const ToggleSummary = graphql(`
    fragment ToggleSummary on Toggle {
        id
        value
        type {
            id
            label
        }
    }
`);

export const ToggleFull = graphql(`
    fragment ToggleFull on Toggle {
        ...ToggleSummary
        createdAt
        createdBy
        lastModifiedAt
        lastModifiedBy
    }
`);

const ToggleCreateMutation = graphql(`
    mutation ToggleCreate($spexareId: ID!, $typeId: ID!, $input: ToggleCreate!) {
        toggleCreate(spexareId: $spexareId, typeId: $typeId, input: $input) {
            ...ToggleFull
        }
    }
`);

const ToggleUpdateMutation = graphql(`
    mutation ToggleUpdate($spexareId: ID!, $typeId: ID!, $input: ToggleUpdate!) {
        toggleUpdate(spexareId: $spexareId, typeId: $typeId, input: $input) {
            ...ToggleFull
        }
    }
`);

const ToggleDeleteMutation = graphql(`
    mutation ToggleDelete($spexareId: ID!, $typeId: ID!, $id: ID!) {
        toggleDelete(spexareId: $spexareId, typeId: $typeId, id: $id)
    }
`);

export async function create(spexareId: string, typeId: string, input: ToggleCreate): Promise<Toggle> {
    return mutateForData(ToggleCreateMutation, {spexareId, typeId, input}, 'toggleCreate', 'No data created') as Promise<Toggle>;
}

export async function update(spexareId: string, typeId: string, id: string, input: Omit<ToggleUpdate, "id">): Promise<Toggle> {
    return mutateForData(ToggleUpdateMutation, {spexareId, typeId, input: {...input, id}}, 'toggleUpdate', 'No data updated') as Promise<Toggle>;
}

export async function del(spexareId: string, typeId: string, id: string) {
    return runMutationField(ToggleDeleteMutation, {spexareId, typeId, id}, 'toggleDelete');
}
