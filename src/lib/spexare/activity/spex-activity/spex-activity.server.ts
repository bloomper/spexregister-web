import 'server-only';

import {getClient} from '@/lib/urql.server';

export const SummaryFields = `
    ...SpexActivitySummary
`;

export const FullFields = `
    ...SpexActivityFull
`;

const BaseFragment = /* GraphQL */ `
    fragment SpexActivityBase on SpexActivity {
        id
        spex {
            id
            year
            title
            revival
        }
    }
`;

export const SummaryFragment = /* GraphQL */ `
    fragment SpexActivitySummary on SpexActivity {
        ...SpexActivityBase
    }
    ${BaseFragment}
`;

export const FullFragment = /* GraphQL */ `
    fragment SpexActivityFull on SpexActivity {
        ...SpexActivityBase
        createdAt
        createdBy
        lastModifiedAt
        lastModifiedBy
    }
    ${BaseFragment}
`;

const CreateMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $activityId: ID!, $spexId: ID!) {
        spexActivityCreate(spexareId: $spexareId, activityId: $activityId, spexId: $spexId) {
            ${FullFields}
        }
    }
    ${FullFragment}
`;

const UpdateMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $activityId: ID!, $spexId: ID!, $id: ID!) {
        spexActivityUpdate(spexareId: $spexareId, activityId: $activityId, spexId: $spexId, id: $id) {
            ${FullFields}
        }
    }
    ${FullFragment}
`;

const DeleteMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $activityId: ID!, $id: ID!) {
        spexActivityDelete(spexareId: $spexareId, activityId: $activityId, id: $id)
    }
`;

export async function create(spexareId: string, activityId: string, spexId: string) {
    const result = await getClient()
        .mutation(CreateMutation, {spexareId, activityId, spexId})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.spexActivityCreate) {
        throw new Error("No data created");
    }

    return result.data?.spexActivityCreate;
}

export async function update(spexareId: string, activityId: string, spexId: string, id: string) {
    const result = await getClient()
        .mutation(UpdateMutation, {
            spexareId,
            activityId,
            spexId,
            id
        })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.spexActivityUpdate) {
        throw new Error("No data updated");
    }

    return result.data?.spexActivityUpdate;
}

export async function del(spexareId: string, activityId: string, id: string) {
    const result = await getClient()
        .mutation(DeleteMutation, {spexareId, activityId, id})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.spexActivityDelete;
}
