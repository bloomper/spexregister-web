import 'server-only';

import {getClient} from '@/lib/urql.server';

export const SummaryFields = `
    ...TaggingSummary
`;

export const FullFields = `
    ...TaggingFull
`;

export const SummaryFragment = /* GraphQL */ `
    fragment TaggingSummary on Tag {
        id
        name
    }
`;

export const FullFragment = /* GraphQL */ `
    fragment TaggingFull on Tag {
        ...TaggingSummary
        createdAt
        createdBy
        lastModifiedAt
        lastModifiedBy
    }
    ${SummaryFragment}
`;

const CreateMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $tagId: ID!) {
        taggingCreate(spexareId: $spexareId, tagId: $tagId)
    }
`;

const DeleteMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $tagId: ID!) {
        taggingDelete(spexareId: $spexareId, tagId: $tagId)
    }
`;

export async function create(spexareId: string, tagId: string) {
    const result = await getClient()
        .mutation(CreateMutation, {spexareId, tagId})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.taggingCreate) {
        throw new Error("No data created");
    }

    return result.data?.taggingCreate;
}

export async function del(spexareId: string, tagId: string) {
    const result = await getClient()
        .mutation(DeleteMutation, {spexareId, tagId})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.taggingDelete;
}

