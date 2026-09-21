import "server-only";

import {Analytics} from "@/gql/schema";
import {graphql} from "@/gql";
import {runQuery} from "@/lib/graphql.server";

export const BucketFields = graphql(`
    fragment BucketFields on Bucket {
        key
        label
        count
        facet
    }
`);

export const TotalsFields = graphql(`
    fragment TotalsFields on Totals {
        spexareCount
        spexareCountHistory { label count }
        userCount
        userCountHistory { label count }
        spexCount
        spexCountHistory { label count }
        spexRevivalCount
        spexRevivalCountHistory { label count }
        taskCount
        taskCountHistory { label count }
    }
`);

export const AnalyticsFields = graphql(`
    fragment AnalyticsFields on Analytics {
        totals { ...TotalsFields }
        participation {
            bySpexYear { ...BucketFields }
            bySpexCategory { ...BucketFields }
            topSpex { ...BucketFields }
            byTaskCategory { ...BucketFields }
            topTask { ...BucketFields }
            byVocal { ...BucketFields }
        }
        demographics {
            byCountry { ...BucketFields }
            byAddressType { ...BucketFields }
            byMembership { ...BucketFields }
            byTag { ...BucketFields }
            byToggle { ...BucketFields }
            byStatus { ...BucketFields }
            consentCompletion {
                key
                label
                granted
                denied
                missing
            }
        }
        lifecycle {
            newcomersByYear { ...BucketFields }
            lastActiveByYear { ...BucketFields }
            byEngagement { ...BucketFields }
            byDormancy { ...BucketFields }
            oneTimers
            returning
            veterans
            neverActive
        }
        dataQuality {
            total
            issues { ...BucketFields }
            complete
        }
        operations {
            usersByState { ...BucketFields }
            usersWithoutSpexare
            spexareWithoutUser
            revisionsByMonth { ...BucketFields }
            revisionsBySource { ...BucketFields }
            topEditors { ...BucketFields }
        }
    }
`);

const AnalyticsQuery = graphql(`
    query Analytics {
        analytics {
            ...AnalyticsFields
        }
    }
`);

const AnalyticsSummaryQuery = graphql(`
    query AnalyticsSummary {
        analytics {
            totals { ...TotalsFields }
            participation {
                bySpexYear { ...BucketFields }
            }
            dataQuality {
                issues { ...BucketFields }
            }
        }
    }
`);

const context = {
    fetchOptions: {
        next: {tags: ["spexare", "spex", "task", "tag", "user"]}
    }
};

export async function get(): Promise<Analytics | undefined> {
    const data = await runQuery(AnalyticsQuery, {}, context);

    return data?.analytics as Analytics | undefined;
}

export async function getSummary(): Promise<Analytics | undefined> {
    const data = await runQuery(AnalyticsSummaryQuery, {}, context);

    return data?.analytics as Analytics | undefined;
}
