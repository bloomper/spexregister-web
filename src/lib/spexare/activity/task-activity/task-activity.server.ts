import 'server-only';

import {TaskActivity} from "@/gql/schema";
import {graphql} from "@/gql";
import {mutateForData, runMutationField} from "@/lib/graphql.server";

export const TaskActivityBase = graphql(`
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
`);

export const TaskActivitySummary = graphql(`
    fragment TaskActivitySummary on TaskActivity {
        ...TaskActivityBase
        actors {
            ...ActorSummary
        }
    }
`);

export const TaskActivityFull = graphql(`
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
`);

const TaskActivityCreateMutation = graphql(`
    mutation TaskActivityCreate($spexareId: ID!, $activityId: ID!, $taskId: ID!) {
        taskActivityCreate(spexareId: $spexareId, activityId: $activityId, taskId: $taskId) {
            ...TaskActivityFull
        }
    }
`);

const TaskActivityUpdateMutation = graphql(`
    mutation TaskActivityUpdate($spexareId: ID!, $activityId: ID!, $taskId: ID!, $id: ID!) {
        taskActivityUpdate(spexareId: $spexareId, activityId: $activityId, taskId: $taskId, id: $id) {
            ...TaskActivityFull
        }
    }
`);

const TaskActivityDeleteMutation = graphql(`
    mutation TaskActivityDelete($spexareId: ID!, $activityId: ID!, $id: ID!) {
        taskActivityDelete(spexareId: $spexareId, activityId: $activityId, id: $id)
    }
`);

export async function create(spexareId: string, activityId: string, taskId: string): Promise<TaskActivity> {
    return mutateForData(TaskActivityCreateMutation, {spexareId, activityId, taskId}, 'taskActivityCreate', 'No data created') as Promise<TaskActivity>;
}

export async function update(spexareId: string, activityId: string, taskId: string, id: string): Promise<TaskActivity> {
    return mutateForData(TaskActivityUpdateMutation, {spexareId, activityId, taskId, id}, 'taskActivityUpdate', 'No data updated') as Promise<TaskActivity>;
}

export async function del(spexareId: string, activityId: string, id: string) {
    return runMutationField(TaskActivityDeleteMutation, {spexareId, activityId, id}, 'taskActivityDelete');
}
