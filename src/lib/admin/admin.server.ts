import "server-only";

import {graphql} from "@/gql";
import {runMutationField} from "@/lib/graphql.server";

const IndexSpexareMutation = graphql(`
    mutation IndexSpexare {
        indexSpexare
    }
`);

export async function indexSpexare() {
    return runMutationField(IndexSpexareMutation, {}, "indexSpexare");
}
