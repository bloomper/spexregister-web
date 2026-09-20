import "server-only";

import {BulkResult, SpexareBulkInput} from "@/gql/schema";
import {graphql} from "@/gql";
import {auditReason, mutateForData, runQuery} from "@/lib/graphql.server";

export const BulkResultFull = graphql(`
    fragment BulkResultFull on BulkResult {
        operation
        requested
        applied
        unchanged
        blocked
        entries {
            id
            label
            outcome
            detail
        }
    }
`);

const SpexareBulkPreviewQuery = graphql(`
    query SpexareBulkPreview($input: SpexareBulkInput!) {
        spexareBulkPreview(input: $input) {
            ...BulkResultFull
        }
    }
`);

const SpexareBulkApplyMutation = graphql(`
    mutation SpexareBulkApply($input: SpexareBulkInput!) {
        spexareBulkApply(input: $input) {
            ...BulkResultFull
        }
    }
`);

export async function preview(input: SpexareBulkInput): Promise<BulkResult> {
    const data = await runQuery(SpexareBulkPreviewQuery, {input}, {
        fetchOptions: {cache: "no-store"},
    });

    if (!data?.spexareBulkPreview) {
        throw new Error("No preview returned");
    }

    return data.spexareBulkPreview as BulkResult;
}

export async function apply(input: SpexareBulkInput, reason?: string): Promise<BulkResult> {
    return mutateForData(
        SpexareBulkApplyMutation,
        {input},
        "spexareBulkApply",
        "No data updated",
        auditReason(reason),
    ) as Promise<BulkResult>;
}
