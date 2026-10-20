import "server-only";

import {graphql} from "@/gql";
import {runMutation, runQuery} from "@/lib/graphql.server";
import type {PermissionGrantCreate, PermissionGrantSummaryFragment, PermissionGrantUpdate} from "@/gql/graphql";
import type {SortDirection} from "@/gql/schema";
import type {CursorPage} from "@/types/pagination";

export const CACHE_TAG = "permission-grants";

export const PermissionGrantSummary = graphql(`
    fragment PermissionGrantSummary on PermissionGrant {
        id
        role
        permission
        scope
        validUntil
        expired
        createdBy
        createdAt
        lastModifiedBy
        lastModifiedAt
        user {
            id
            email
            spexare {
                id
                firstName
                lastName
            }
        }
        spexare {
            id
            firstName
            lastName
        }
        spex {
            id
            year
            title
        }
    }
`);

const PermissionGrantsPagedQuery = graphql(`
    query PermissionGrantsPaged($first: Int, $last: Int, $after: String, $before: String, $sort: [String]!, $direction: SortDirection, $filter: String!) {
        permissionGrantPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
            edges { cursor node { ...PermissionGrantSummary } }
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
            totalCount
        }
    }
`);

const PermissionGrantCreateMutation = graphql(`
    mutation PermissionGrantCreate($input: PermissionGrantCreate!) {
        permissionGrantCreate(input: $input) { ...PermissionGrantSummary }
    }
`);

const PermissionGrantUpdateMutation = graphql(`
    mutation PermissionGrantUpdate($input: PermissionGrantUpdate!) {
        permissionGrantUpdate(input: $input) { ...PermissionGrantSummary }
    }
`);

const PermissionGrantDeleteMutation = graphql(`
    mutation PermissionGrantDelete($id: ID!) {
        permissionGrantDelete(id: $id)
    }
`);

export type PermissionGrant = PermissionGrantSummaryFragment;

export async function getGrantsPage(args: {
    first?: number;
    last?: number;
    after?: string | null;
    before?: string | null;
    sort?: string[];
    direction?: SortDirection;
    filter?: string;
}): Promise<CursorPage<PermissionGrant>> {
    const data = await runQuery(PermissionGrantsPagedQuery, {
        ...args,
        sort: args.sort?.length ? args.sort : ["createdAt"],
        filter: args.filter ?? "",
    }, {
        fetchOptions: {next: {tags: [CACHE_TAG]}},
    });
    const connection = data?.permissionGrantPaged;

    return {
        items: (connection?.edges ?? [])
            .map((edge) => edge?.node)
            .filter((node): node is PermissionGrant => Boolean(node)),
        pageInfo: {
            hasNextPage: connection?.pageInfo.hasNextPage ?? false,
            hasPreviousPage: connection?.pageInfo.hasPreviousPage ?? false,
            startCursor: connection?.pageInfo.startCursor ?? null,
            endCursor: connection?.pageInfo.endCursor ?? null,
        },
        totalCount: connection?.totalCount ?? 0,
    };
}

export async function createGrant(input: PermissionGrantCreate) {
    return runMutation(PermissionGrantCreateMutation, {input});
}

export async function updateGrant(input: PermissionGrantUpdate) {
    return runMutation(PermissionGrantUpdateMutation, {input});
}

export async function deleteGrant(id: string) {
    return runMutation(PermissionGrantDeleteMutation, {id});
}
