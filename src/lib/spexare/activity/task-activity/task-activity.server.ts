import 'server-only';

import {getClient} from '@/lib/urql.server';
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
    const result = await getClient()
        .mutation(CreateMutation, {spexareId, activityId, taskId})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.taskActivityCreate) {
        throw new Error("No data created");
    }

    return result.data?.taskActivityCreate;
}

export async function update(spexareId: string, activityId: string, taskId: string, id: string) {
    const result = await getClient()
        .mutation(UpdateMutation, {
            spexareId,
            activityId,
            taskId,
            id
        })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.taskActivityUpdate) {
        throw new Error("No data updated");
    }

    return result.data?.taskActivityUpdate;
}

export async function del(spexareId: string, activityId: string, id: string) {
    const result = await getClient()
        .mutation(DeleteMutation, {spexareId, activityId, id})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.taskActivityDelete;
}
