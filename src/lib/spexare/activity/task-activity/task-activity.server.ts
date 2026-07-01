import 'server-only';

import {TaskActivity} from "@/gql/graphql";
import {mutateForData, runMutationField} from "@/lib/graphql.server";
import {
    FullFragment as ActorFullFragment,
    SummaryFragment as ActorSummaryFragment
} from "@/lib/spexare/activity/task-activity/actor";

export const SummaryFields = `
    ...TaskActivitySummary
`;

export const FullFields = `
    ...TaskActivityFull
`;

const BaseFragment = /* GraphQL */ `
    fragment TaskActivityBase on TaskActivity {
        id
        task {
            id
            name
            category {
                name
                actorPresent
            }
        }
    }
`;

export const SummaryFragment = /* GraphQL */ `
    fragment TaskActivitySummary on TaskActivity {
        ...TaskActivityBase
        actors {
            ...ActorSummary
        }
    }
    ${BaseFragment}
    ${ActorSummaryFragment}
`;

export const FullFragment = /* GraphQL */ `
    fragment TaskActivityFull on TaskActivity {
        ...TaskActivityBase
        actors {
            ...ActorFull
        }
        createdAt
        createdBy
        lastModifiedAt
        lastModifiedBy
    }
    ${BaseFragment}
    ${ActorFullFragment}
`;

const CreateMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $activityId: ID!, $taskId: ID!) {
        taskActivityCreate(spexareId: $spexareId, activityId: $activityId, taskId: $taskId) {
            ${FullFields}
        }
    }
    ${FullFragment}
`;

const UpdateMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $activityId: ID!, $taskId: ID!, $id: ID!) {
        taskActivityUpdate(spexareId: $spexareId, activityId: $activityId, taskId: $taskId, id: $id) {
            ${FullFields}
        }
    }
    ${FullFragment}
`;

const DeleteMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $activityId: ID!, $id: ID!) {
        taskActivityDelete(spexareId: $spexareId, activityId: $activityId, id: $id)
    }
`;

export async function create(spexareId: string, activityId: string, taskId: string) {
    return mutateForData<TaskActivity>(CreateMutation, {spexareId, activityId, taskId}, 'taskActivityCreate', 'No data created');
}

export async function update(spexareId: string, activityId: string, taskId: string, id: string) {
    return mutateForData<TaskActivity>(UpdateMutation, {spexareId, activityId, taskId, id}, 'taskActivityUpdate', 'No data updated');
}

export async function del(spexareId: string, activityId: string, id: string) {
    return runMutationField(DeleteMutation, {spexareId, activityId, id}, 'taskActivityDelete');
}
