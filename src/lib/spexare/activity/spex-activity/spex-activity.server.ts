import 'server-only';

import {SpexActivity} from "@/gql/schema";
import {graphql} from "@/gql";
import {mutateForData, runMutationField} from "@/lib/graphql.server";

export const SpexActivityBase = graphql(`
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
`);

export const SpexActivitySummary = graphql(`
    fragment SpexActivitySummary on SpexActivity {
        ...SpexActivityBase
    }
`);

export const SpexActivityFull = graphql(`
    fragment SpexActivityFull on SpexActivity {
        ...SpexActivityBase
        createdAt
        createdBy
        lastModifiedAt
        lastModifiedBy
    }
`);

const SpexActivityCreateMutation = graphql(`
    mutation SpexActivityCreate($spexareId: ID!, $activityId: ID!, $spexId: ID!) {
        spexActivityCreate(spexareId: $spexareId, activityId: $activityId, spexId: $spexId) {
            ...SpexActivityFull
        }
    }
`);

const SpexActivityUpdateMutation = graphql(`
    mutation SpexActivityUpdate($spexareId: ID!, $activityId: ID!, $spexId: ID!, $id: ID!) {
        spexActivityUpdate(spexareId: $spexareId, activityId: $activityId, spexId: $spexId, id: $id) {
            ...SpexActivityFull
        }
    }
`);

const SpexActivityDeleteMutation = graphql(`
    mutation SpexActivityDelete($spexareId: ID!, $activityId: ID!, $id: ID!) {
        spexActivityDelete(spexareId: $spexareId, activityId: $activityId, id: $id)
    }
`);

export async function create(spexareId: string, activityId: string, spexId: string): Promise<SpexActivity> {
    return mutateForData(SpexActivityCreateMutation, {spexareId, activityId, spexId}, 'spexActivityCreate', 'No data created') as Promise<SpexActivity>;
}

export async function update(spexareId: string, activityId: string, spexId: string, id: string): Promise<SpexActivity> {
    return mutateForData(SpexActivityUpdateMutation, {spexareId, activityId, spexId, id}, 'spexActivityUpdate', 'No data updated') as Promise<SpexActivity>;
}

export async function del(spexareId: string, activityId: string, id: string) {
    return runMutationField(SpexActivityDeleteMutation, {spexareId, activityId, id}, 'spexActivityDelete');
}
