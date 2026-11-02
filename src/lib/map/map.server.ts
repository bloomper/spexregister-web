import "server-only";

import {graphql} from "@/gql";
import {runQuery} from "@/lib/graphql.server";

const SpexareLocationsQuery = graphql(`
    query SpexareLocations {
        spexareLocations {
            id
            firstName
            lastName
            nickName
            latitude
            longitude
        }
    }
`);

/**
 * A spexare placed on the map at their address.
 */
export type SpexareLocation = {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    nickName?: string | null;
    latitude: number;
    longitude: number;
};

/**
 * Every spexare the caller may see whose address has been located.
 */
export async function getSpexareLocations(): Promise<SpexareLocation[]> {
    const data = await runQuery(SpexareLocationsQuery, {});

    return data?.spexareLocations ?? [];
}
