import 'server-only';

import {getClient} from '@/lib/urql.server';
import {Authority, ImpexType, JobReference, SortDirection, State, User, UserConnection, UserEdge} from "@/gql/graphql";
import {UserPage} from "@/types/pagination";
import {mapConnection} from "@/utils/utils.server";
import {FullFragment as SpexareFullFragment} from "@/lib/spexare";
import axios from "@/lib/axios.server";

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

const CreateMutation = /* GraphQL */ `
    mutation ($input: UserCreate!) {
        userCreate(input: $input) {
            ${FullFields}
        }
    }
`;

const UpdateMutation = /* GraphQL */ `
    mutation ($input: UserUpdate!) {
        userUpdate(input: $input) {
            ${FullFields}
        }
    }
`;

const DeleteMutation = /* GraphQL */ `
    mutation ($id: ID!) {
        userDelete(id: $id)
    }
`;

const ExportQuery = /* GraphQL */ `
  query ($ids: [ID], $filter: String, $type: ImpexType!) {
    userExport(ids: $ids, filter: $filter, type: $type) {
        id
    }
  }
`;

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

const EventsQuery = /* GraphQL */ `
    query ($sourceId: ID!) {
        userEvents(sourceId: $sourceId) {
            id
            eventType
            createdAt
            createdBy
        }
    }
`;

const createQuery = (fields: string) => /* GraphQL */ `
    query ($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        userPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
            edges {
                cursor
                node { ${fields} }
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
        }
    }
`;

export async function getPaged(args: {
    first?: number;
    last?: number;
    after?: string | null;
    before?: string | null;
    sort?: string[];
    direction?: SortDirection;
    filter?: string;
    full?: boolean
}): Promise<UserPage> {
    const query = createQuery(args.full ? FullFields : SummaryFields);

    const result = await getClient()
        .query<{ userPaged: UserConnection }>(query, {
            first: args.first,
            last: args.last,
            after: args.after ?? null,
            before: args.before ?? null,
            sort: args.sort ?? ["id"],
            direction: args.direction ?? SortDirection.Asc,
            filter: args.filter ?? "",
        }, {
            fetchOptions: {
                next: {tags: ['user']}
            }
        })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return mapConnection<User, UserEdge>(result.data?.userPaged);
}

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

    const result = await getClient()
        .query<{ me: User }>(query, {}, {
            fetchOptions: {
                next: {tags: ['me']}
            }
        })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.me;
}

export async function create(input: any) {
    const result = await getClient()
        .mutation(CreateMutation, {input})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.userCreate) {
        throw new Error("No data created");
    }

    return result.data?.userCreate;
}

export async function update(id: string, input: any) {
    const result = await getClient()
        .mutation(UpdateMutation, {
            input: {
                ...input,
                id
            }
        })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.userUpdate) {
        throw new Error("No data updated");
    }

    return result.data?.userUpdate;
}

export async function del(id: string) {
    const result = await getClient()
        .mutation(DeleteMutation, {id})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.userDelete;
}

export async function exp(ids: string[] | null, filter: string | null, type: ImpexType): Promise<JobReference> {
    const result = await getClient()
        .query<{ userExport: JobReference }>(ExportQuery, { ids, filter, type })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data!.userExport;
}

export async function imp(type: ImpexType, file: File): Promise<JobReference> {
    const arrayBuffer = await file.arrayBuffer();
    const response = await axios.post(`${process.env.API_REST_BASE_URL}/api/users?type=${type}`, arrayBuffer, {
        headers: {
            'Content-Type': file.type,
        }
    });
    return response.data;
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

    const result = await getClient()
        .query<{ authorities: Authority[] }>(query, {})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.authorities ?? [];
}

export async function addAuthorities(userId: string, ids: string[]) {
    const result = await getClient()
        .mutation(AuthoritiesAddMutation, {userId, ids})
        .toPromise();
    if (result.error) {
        throw result.error;
    }
    return result.data?.userAuthoritiesAdd;
}

export async function removeAuthorities(userId: string, ids: string[]) {
    const result = await getClient()
        .mutation(AuthoritiesRemoveMutation, {userId, ids})
        .toPromise();
    if (result.error) {
        throw result.error;
    }
    return result.data?.userAuthoritiesRemove;
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

    const result = await getClient()
        .query<{ states: State[] }>(query, {})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.states ?? [];
}

export async function setState(userId: string, id: string) {
    const result = await getClient()
        .mutation(StateSetMutation, {userId, id})
        .toPromise();
    if (result.error) {
        throw result.error;
    }
    return result.data?.userStateSet;
}

export async function addSpexare(userId: string, id: string) {
    const result = await getClient()
        .mutation(SpexareAddMutation, {userId, id})
        .toPromise();
    if (result.error) {
        throw result.error;
    }
    return result.data?.userSpexareAdd;
}

export async function removeSpexare(userId: string) {
    const result = await getClient()
        .mutation(SpexareRemoveMutation, {userId})
        .toPromise();
    if (result.error) {
        throw result.error;
    }
    return result.data?.userSpexareRemove;
}

export async function events(sourceId: string): Promise<Event[]> {
    const result = await getClient()
        .query<{ userEvents: Event[] }>(EventsQuery, {sourceId})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.userEvents ?? [];
}
