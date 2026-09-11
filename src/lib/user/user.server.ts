import "server-only";

import {AuditedType, Authority, SortDirection, State, User, UserCreate, UserEdge, UserUpdate} from "@/gql/schema";
import {graphql} from "@/gql";
import {createResourceClient, runMutationField, runQuery} from "@/lib/graphql.server";

export const UserSummary = graphql(`
    fragment UserSummary on User {
        id
        externalId
        email
        authorities {
            id
            label
        }
        state {
            id
            label
        }
        spexare {
            id
            firstName
            lastName
            nickName
        }
    }
`);

export const UserFull = graphql(`
    fragment UserFull on User {
        ...UserSummary
        temporaryPassword
        createdAt
        createdBy
        lastModifiedAt
        lastModifiedBy
    }
`);

const UserPagedSummary = graphql(`
    query UserPagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        userPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
            edges { cursor node { ...UserSummary } }
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
            totalCount
        }
    }
`);

const UserPagedFull = graphql(`
    query UserPagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        userPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
            edges { cursor node { ...UserFull } }
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
            totalCount
        }
    }
`);

const UserGetQuery = graphql(`
    query UserGet($id: ID!) {
        user(id: $id) { ...UserFull }
    }
`);

const UserCreateMutation = graphql(`
    mutation UserCreate($input: UserCreate!) {
        userCreate(input: $input) { ...UserFull }
    }
`);

const UserUpdateMutation = graphql(`
    mutation UserUpdate($input: UserUpdate!) {
        userUpdate(input: $input) { ...UserFull }
    }
`);

const UserDeleteMutation = graphql(`
    mutation UserDelete($id: ID!) {
        userDelete(id: $id)
    }
`);

const UserExportQuery = graphql(`
    query UserExport($ids: [ID], $filter: String, $type: ImpexType!) {
        userExport(ids: $ids, filter: $filter, type: $type) { id }
    }
`);

const client = createResourceClient<User, UserEdge, UserCreate, UserUpdate>({
    singular: "user",
    pagedSummaryQuery: UserPagedSummary,
    pagedFullQuery: UserPagedFull,
    getQuery: UserGetQuery,
    createMutation: UserCreateMutation,
    updateMutation: UserUpdateMutation,
    deleteMutation: UserDeleteMutation,
    exportQuery: UserExportQuery,
    auditedType: AuditedType.User,
    cacheTag: "user",
    restPath: "users",
    defaultSort: ["id"],
    defaultDirection: SortDirection.Asc,
    defaultFilter: "",
});

export const {getPaged, get, create, update, del, exp, imp, revisions} = client;

const AuthoritiesAddMutation = graphql(`
    mutation UserAuthoritiesAdd($userId: ID!, $ids: [ID]!) {
        userAuthoritiesAdd(userId: $userId, ids: $ids)
    }
`);

const AuthoritiesRemoveMutation = graphql(`
    mutation UserAuthoritiesRemove($userId: ID!, $ids: [ID]!) {
        userAuthoritiesRemove(userId: $userId, ids: $ids)
    }
`);

const StateSetMutation = graphql(`
    mutation UserStateSet($userId: ID!, $id: ID!) {
        userStateSet(userId: $userId, id: $id)
    }
`);

const SpexareAddMutation = graphql(`
    mutation UserSpexareAdd($userId: ID!, $id: ID!) {
        userSpexareAdd(userId: $userId, id: $id)
    }
`);

const SpexareRemoveMutation = graphql(`
    mutation UserSpexareRemove($userId: ID!) {
        userSpexareRemove(userId: $userId)
    }
`);

const MeQuery = graphql(`
    query UserMe {
        me {
            spexare {
                ...SpexareFull
            }
        }
    }
`);

const AuthoritiesQuery = graphql(`
    query Authorities {
        authorities {
            id
            label
        }
    }
`);

const StatesQuery = graphql(`
    query States {
        states {
            id
            label
        }
    }
`);

export async function me(): Promise<User | null | undefined> {
    const data = await runQuery(MeQuery, {}, {
        fetchOptions: {
            next: {tags: ["me"]}
        }
    });

    return data?.me as User | null | undefined;
}

export async function meOrNull(): Promise<User | null> {
    try {
        return (await me()) ?? null;
    } catch (error) {
        console.warn("Could not load the current user; rendering without it", error);
        return null;
    }
}

export async function getAuthorities(): Promise<Authority[]> {
    const data = await runQuery(AuthoritiesQuery, {});
    return (data?.authorities ?? []) as Authority[];
}

export async function addAuthorities(userId: string, ids: string[]) {
    return runMutationField(AuthoritiesAddMutation, {userId, ids}, "userAuthoritiesAdd");
}

export async function removeAuthorities(userId: string, ids: string[]) {
    return runMutationField(AuthoritiesRemoveMutation, {userId, ids}, "userAuthoritiesRemove");
}

export async function getStates(): Promise<State[]> {
    const data = await runQuery(StatesQuery, {});
    return (data?.states ?? []) as State[];
}

export async function setState(userId: string, id: string) {
    return runMutationField(StateSetMutation, {userId, id}, "userStateSet");
}

export async function addSpexare(userId: string, id: string) {
    return runMutationField(SpexareAddMutation, {userId, id}, "userSpexareAdd");
}

export async function removeSpexare(userId: string) {
    return runMutationField(SpexareRemoveMutation, {userId}, "userSpexareRemove");
}
