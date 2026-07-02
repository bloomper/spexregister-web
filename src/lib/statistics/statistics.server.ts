import "server-only";

import {Statistics} from "@/gql/schema";
import {graphql} from "@/gql";
import {runQuery} from "@/lib/graphql.server";

export const StatisticsFields = graphql(`
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
`);

const StatisticsQuery = graphql(`
    query Statistics {
        statistics {
            ...StatisticsFields
        }
    }
`);

export async function get(): Promise<Statistics | undefined> {
    const data = await runQuery(StatisticsQuery, {}, {
        fetchOptions: {
            next: {tags: ["spexare", "spex", "task", "user"]}
        }
    });

    return data?.statistics as Statistics | undefined;
}
