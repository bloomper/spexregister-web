import 'server-only';

import {Statistics} from "@/gql/graphql";
import {runQuery} from "@/lib/graphql.server";

const Fields = /* GraphQL */ `
    fragment StatisticsFields on Statistics {
        spexareCount
        spexareCountHistory {
            label
            count
        }
        userCount
        userCountHistory {
            label
            count
        }
        spexCount
        spexCountHistory {
            label
            count
        }
        spexRevivalCount
        spexRevivalCountHistory {
            label
            count
        }
        taskCount
        taskCountHistory {
            label
            count
        }
    }
`;

const Query = /* GraphQL */ `
    query Statistics {
        statistics {
            ...StatisticsFields
        }
    }
    ${Fields}
`;

export async function get(): Promise<Statistics | undefined> {
    const data = await runQuery<{ statistics: Statistics }>(Query, {}, {
        fetchOptions: {
            next: {tags: ['spexare', 'spex', 'task', 'user']}
        }
    });

    return data?.statistics;
}