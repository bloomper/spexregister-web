import 'server-only';

import {getClient} from '@/lib/urql.server';
import {Statistics} from "@/gql/graphql";

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
    const result = await getClient()
        .query<{ statistics: Statistics }>(Query, {}, {
            fetchOptions: {
                next: {tags: ['spexare', 'spex', 'task', 'user']}
            }
        })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.statistics;
}