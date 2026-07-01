import 'server-only';

import {Activity} from "@/gql/graphql";
import {mutateForData, runMutationField} from "@/lib/graphql.server";
import {
    FullFragment as TaskActivityFullFragment,
    SummaryFragment as TaskActivitySummaryFragment
} from "@/lib/spexare/activity/task-activity";
import {
    FullFragment as SpexActivityFullFragment,
    SummaryFragment as SpexActivitySummaryFragment
} from "@/lib/spexare/activity/spex-activity";

export const SummaryFields = `
    ...ActivitySummary
`;

export const FullFields = `
    ...ActivityFull
`;

const BaseFragment = /* GraphQL */ `
    fragment ActivityBase on Activity {
        id
    }
`;

export const SummaryFragment = /* GraphQL */ `
    fragment ActivitySummary on Activity {
        ...ActivityBase
        spexActivity {
            ...SpexActivitySummary
        }
        taskActivities {
            ...TaskActivitySummary
        }
    }
    ${BaseFragment}
    ${SpexActivitySummaryFragment}
    ${TaskActivitySummaryFragment}
`;

export const FullFragment = /* GraphQL */ `
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
    ${BaseFragment}
    ${SpexActivityFullFragment}
    ${TaskActivityFullFragment}
`;

const CreateMutation = /* GraphQL */ `
    mutation ($spexareId: ID!) {
        activityCreate(spexareId: $spexareId) {
            ${FullFields}
        }
    }
    ${FullFragment}
`;

const DeleteMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $id: ID!) {
        activityDelete(spexareId: $spexareId, id: $id)
    }
`;

export async function create(spexareId: string) {
    return mutateForData<Activity>(CreateMutation, {spexareId}, 'activityCreate', 'No data created');
}

export async function del(spexareId: string, id: string) {
    return runMutationField(DeleteMutation, {spexareId, id}, 'activityDelete');
}
