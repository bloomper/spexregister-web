import "server-only";

import {graphql} from "@/gql";
import {runMutationField} from "@/lib/graphql.server";

export const TaggingSummary = graphql(`
    fragment TaggingSummary on Tag {
        id
        name
    }
`);

export const TaggingFull = graphql(`
    fragment TaggingFull on Tag {
        ...TaggingSummary
        createdAt
        createdBy
        lastModifiedAt
        lastModifiedBy
    }
`);

const TaggingCreateMutation = graphql(`
    mutation TaggingCreate($spexareId: ID!, $tagId: ID!) {
        taggingCreate(spexareId: $spexareId, tagId: $tagId)
    }
`);

const TaggingDeleteMutation = graphql(`
    mutation TaggingDelete($spexareId: ID!, $tagId: ID!) {
        taggingDelete(spexareId: $spexareId, tagId: $tagId)
    }
`);

export async function create(spexareId: string, tagId: string) {
    return runMutationField(TaggingCreateMutation, {spexareId, tagId}, "taggingCreate");
}

export async function del(spexareId: string, tagId: string) {
    return runMutationField(TaggingDeleteMutation, {spexareId, tagId}, "taggingDelete");
}
