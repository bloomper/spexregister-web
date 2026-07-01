import 'server-only';

import {Authority, SortDirection, State, User, UserCreate, UserEdge, UserUpdate} from "@/gql/graphql";
import {createResourceClient, runMutationField, runQuery} from "@/lib/graphql.server";
import {FullFragment as SpexareFullFragment} from "@/lib/spexare";

const SummaryFields = `
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
`;

const FullFields = `
    ${SummaryFields}
    temporaryPassword
    createdAt
    createdBy
    lastModifiedAt
    lastModifiedBy
`;

const client = createResourceClient<User, UserEdge, UserCreate, UserUpdate>({
    singular: 'user',
    createInputType: 'UserCreate',
    updateInputType: 'UserUpdate',
    summaryFields: SummaryFields,
    fullFields: FullFields,
    cacheTag: 'user',
    restPath: 'users',
    defaultSort: ['id'],
    defaultDirection: SortDirection.Asc,
    defaultFilter: '',
});

export const {getPaged, create, update, del, exp, imp, events} = client;

const AuthoritiesAddMutation = /* GraphQL */ `
    mutation ($userId: ID!, $ids: [ID]!) {
        userAuthoritiesAdd(userId: $userId, ids: $ids)
    }
`;

const AuthoritiesRemoveMutation = /* GraphQL */ `
    mutation ($userId: ID!, $ids: [ID]!) {
        userAuthoritiesRemove(userId: $userId, ids: $ids)
    }
`;

const StateSetMutation = /* GraphQL */ `
    mutation ($userId: ID!, $id: ID!) {
        userStateSet(userId: $userId, id: $id)
    }
`;

const SpexareAddMutation = /* GraphQL */ `
    mutation ($userId: ID!, $id: ID!) {
        userSpexareAdd(userId: $userId, id: $id)
    }
`;

const SpexareRemoveMutation = /* GraphQL */ `
    mutation ($userId: ID!) {
        userSpexareRemove(userId: $userId)
    }
`;

export async function me(): Promise<User | null | undefined> {
    const query = /* GraphQL */ `
        query {
            me {
                spexare {
                    ...SpexareFull
                }
            }
        }
        ${SpexareFullFragment}
    `;

    const data = await runQuery<{ me: User }>(query, {}, {
        fetchOptions: {
            next: {tags: ['me']}
        }
    });

    return data?.me;
}

export async function getAuthorities(): Promise<Authority[]> {
    const query = /* GraphQL */ `
        query {
            authorities {
                id
                label
            }
        }
    `;

    const data = await runQuery<{ authorities: Authority[] }>(query, {});
    return data?.authorities ?? [];
}

export async function addAuthorities(userId: string, ids: string[]) {
    return runMutationField(AuthoritiesAddMutation, {userId, ids}, 'userAuthoritiesAdd');
}

export async function removeAuthorities(userId: string, ids: string[]) {
    return runMutationField(AuthoritiesRemoveMutation, {userId, ids}, 'userAuthoritiesRemove');
}

export async function getStates(): Promise<State[]> {
    const query = /* GraphQL */ `
        query {
            states {
                id
                label
            }
        }
    `;

    const data = await runQuery<{ states: State[] }>(query, {});
    return data?.states ?? [];
}

export async function setState(userId: string, id: string) {
    return runMutationField(StateSetMutation, {userId, id}, 'userStateSet');
}

export async function addSpexare(userId: string, id: string) {
    return runMutationField(SpexareAddMutation, {userId, id}, 'userSpexareAdd');
}

export async function removeSpexare(userId: string) {
    return runMutationField(SpexareRemoveMutation, {userId}, 'userSpexareRemove');
}
