import 'server-only';

import {runMutationField} from "@/lib/graphql.server";

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
    return runMutationField(CreateMutation, {spexareId, tagId}, 'taggingCreate');
}

export async function del(spexareId: string, tagId: string) {
    return runMutationField(DeleteMutation, {spexareId, tagId}, 'taggingDelete');
}

