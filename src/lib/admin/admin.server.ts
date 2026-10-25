import "server-only";

import {graphql} from "@/gql";
import {runMutationField} from "@/lib/graphql.server";

const IndexSpexareMutation = graphql(`
    mutation IndexSpexare {
        indexSpexare
    }
`);

/**
 * Asks the server to rebuild the spexare search index in the background.
 */
export async function indexSpexare() {
    return runMutationField(IndexSpexareMutation, {}, "indexSpexare");
}
