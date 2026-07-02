import "server-only";

import {Activity} from "@/gql/schema";
import {graphql} from "@/gql";
import {mutateForData, runMutationField} from "@/lib/graphql.server";

export const ActivityBase = graphql(`
    fragment ActivityBase on Activity {
        id
    }
`);

export const ActivitySummary = graphql(`
    fragment ActivitySummary on Activity {
        ...ActivityBase
        spexActivity {
            ...SpexActivitySummary
        }
        taskActivities {
            ...TaskActivitySummary
        }
    }
`);

export const ActivityFull = graphql(`
    fragment ActivityFull on Activity {
        ...ActivityBase
        spexActivity {
            ...SpexActivityFull
        }
        taskActivities {
            ...TaskActivityFull
        }
        createdAt
        createdBy
        lastModifiedAt
        lastModifiedBy
    }
`);

const ActivityCreateMutation = graphql(`
    mutation ActivityCreate($spexareId: ID!) {
        activityCreate(spexareId: $spexareId) {
            ...ActivityFull
        }
    }
`);

const ActivityDeleteMutation = graphql(`
    mutation ActivityDelete($spexareId: ID!, $id: ID!) {
        activityDelete(spexareId: $spexareId, id: $id)
    }
`);

export async function create(spexareId: string): Promise<Activity> {
    return mutateForData(ActivityCreateMutation, {spexareId}, "activityCreate", "No data created") as Promise<Activity>;
}

export async function del(spexareId: string, id: string) {
    return runMutationField(ActivityDeleteMutation, {spexareId, id}, "activityDelete");
}
