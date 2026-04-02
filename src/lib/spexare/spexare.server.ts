import 'server-only';

import {getClient} from '@/lib/urql.server';
import {
    AggregationFilterInput,
    Event,
    Facet,
    ImpexType,
    JobReference,
    ReportType,
    SortDirection,
    Spexare,
    SpexareConnection,
    SpexareCreate,
    SpexareEdge,
    SpexareUpdate,
    SpexareWithFacetsConnection
} from "@/gql/graphql";
import {SpexarePage, SpexareWithFacetsPage} from "@/types/pagination";
import {mapConnection} from "@/utils/utils.server";
import axios from "@/lib/axios.server";
import {FullFragment as ActivityFullFragment} from "@/lib/spexare/activity";
import {FullFragment as AddressFullFragment} from "@/lib/spexare/address";
import {FullFragment as ConsentFullFragment} from "@/lib/spexare/consent";
import {FullFragment as MembershipFullFragment} from "@/lib/spexare/membership";
import {FullFragment as TaggingFullFragment} from "@/lib/spexare/tagging";
import {FullFragment as ToggleFullFragment} from "@/lib/spexare/toggle";

export const SummaryFields = `
    ...SpexareSummary
`;

export const FullFields = `
    ...SpexareFull
`;


const BaseFragment = /* GraphQL */ `
    fragment SpexareBase on Spexare {
        id
        firstName
        lastName
        nickName
        socialSecurityNumber
        deceased
        published
        graduation
        comment
        imageUrl
        partner {
            id
            firstName
            lastName
            nickName
            deceased
            published
            imageUrl
        }
    }
`;

const SummaryFragment = /* GraphQL */ `
    fragment SpexareSummary on Spexare {
        ...SpexareBase
    }
    ${BaseFragment}
`;

export const FullFragment = /* GraphQL */ `
    fragment SpexareFull on Spexare {
        ...SpexareBase
        activities {
            ...ActivityFull
        }
        addresses {
            ...AddressFull
        }
        consents {
            ...ConsentFull
        }
        memberships {
            ...MembershipFull
        }
        taggings {
            ...TaggingFull
        }
        toggles {
            ...ToggleFull
        }
        createdAt
        createdBy
        lastModifiedAt
        lastModifiedBy
    }
    ${BaseFragment}
    ${ActivityFullFragment}
    ${AddressFullFragment}
    ${ConsentFullFragment}
    ${MembershipFullFragment}
    ${TaggingFullFragment}
    ${ToggleFullFragment}
`;

const CreateMutation = /* GraphQL */ `
    mutation ($input: SpexareCreate!) {
        spexareCreate(input: $input) {
            ${FullFields}
        }
    }
    ${FullFragment}
`;

const GetQuery = /* GraphQL */ `
    query ($id: ID!) {
        spexare(id: $id) {
            ${FullFields}
        }
    }
    ${FullFragment}
`;

const UpdateMutation = /* GraphQL */ `
    mutation ($input: SpexareUpdate!) {
        spexareUpdate(input: $input) {
            ${FullFields}
        }
    }
    ${FullFragment}
`;

const DeleteMutation = /* GraphQL */ `
    mutation ($id: ID!) {
        spexareDelete(id: $id)
    }
`;

const ExportQuery = /* GraphQL */ `
    query ($ids: [ID], $filter: String, $type: ImpexType!, $reportType: ReportType) {
        spexareExport(ids: $ids, filter: $filter, type: $type, reportType: $reportType) {
            id
        }
    }
`;

const AddPartnerMutation = /* GraphQL */ `
    mutation ($spexareId: ID!, $id: ID!) {
        spexarePartnerAdd(spexareId: $spexareId, id: $id)
    }
`;

const RemovePartnerMutation = /* GraphQL */ `
    mutation ($spexareId: ID!) {
        spexarePartnerRemove(spexareId: $spexareId)
    }
`;

const SearchQuery = /* GraphQL */ `
    query ($q: String!, $aggregationFilters: [AggregationFilterInput], $limit: Int, $offset: Int, $sort: [String], $direction: SortDirection) {
        spexareSearchPaged(q: $q, aggregationFilters: $aggregationFilters, limit: $limit, offset: $offset, sort: $sort, direction: $direction) {
            edges {
                cursor
                node { ${SummaryFields} }
            }
            facets {
                id
                label
                groups {
                    id
                    label
                    values {
                        id
                        label
                        count
                    }
                }
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
        }
    }
    ${SummaryFragment}
`;

const EventsQuery = /* GraphQL */ `
    query ($sourceId: ID!) {
        spexareEvents(sourceId: $sourceId) {
            id
            eventType
            createdAt
            createdBy
        }
    }
`;

const createQuery = (fields: string, fragment: string) => /* GraphQL */ `
    query ($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        spexarePaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
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
    ${fragment}
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
}): Promise<SpexarePage> {
    const query = createQuery(
        args.full ? FullFields : SummaryFields,
        args.full ? FullFragment : SummaryFragment
    );

    const result = await getClient()
        .query<{ spexarePaged: SpexareConnection }>(query, {
            first: args.first,
            last: args.last,
            after: args.after ?? null,
            before: args.before ?? null,
            sort: args.sort ?? ["firstName"],
            direction: args.direction ?? SortDirection.Asc,
            filter: args.filter ?? "published:TRUE",
        }, {
            fetchOptions: {
                next: {tags: ['spexare']}
            }
        })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return mapConnection<Spexare, SpexareEdge>(result.data?.spexarePaged);
}

export async function search(args: {
    q: string;
    aggregationFilters?: AggregationFilterInput[];
    limit?: number;
    offset?: number;
    sort?: string[];
    direction?: SortDirection;
}): Promise<SpexareWithFacetsPage> {
    const result = await getClient()
        .query<{ spexareSearchPaged: SpexareWithFacetsConnection }>(SearchQuery, {
            q: args.q,
            aggregationFilters: args.aggregationFilters ?? [],
            limit: args.limit ?? 24,
            offset: args.offset ?? 0,
            sort: args.sort ?? ["score"],
            direction: args.direction ?? SortDirection.Desc,
        }, {
            fetchOptions: {
                next: {tags: ['spexare']}
            }
        })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    const connection = result.data?.spexareSearchPaged;
    const safeConnection = connection
        ? {
            edges: connection.edges ?? [],
            pageInfo: connection.pageInfo ?? {
                hasNextPage: false,
                hasPreviousPage: false,
                startCursor: null,
                endCursor: null,
            },
        }
        : undefined;
    const page = mapConnection<Spexare, SpexareEdge>(safeConnection);

    return {
        ...page,
        facets: (connection?.facets ?? []).filter((f): f is Facet => Boolean(f))
    };
}

export async function create(input: SpexareCreate) {
    const result = await getClient()
        .mutation(CreateMutation, {input})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.spexareCreate) {
        throw new Error("No data created");
    }

    return result.data?.spexareCreate;
}

export async function get(id: string) {
    const result = await getClient()
        .query(GetQuery, {id})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.spexare;
}

export async function update(id: string, input: Omit<SpexareUpdate, "id">) {
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

    if (!result.data?.spexareUpdate) {
        throw new Error("No data updated");
    }

    return result.data?.spexareUpdate;
}

export async function del(id: string) {
    const result = await getClient()
        .mutation(DeleteMutation, {id})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.spexareDelete;
}

export async function exp(ids: string[] | null, filter: string | null, type: ImpexType, reportType: ReportType): Promise<JobReference> {
    const result = await getClient()
        .query<{ spexareExport: JobReference }>(ExportQuery, {ids, filter, type, reportType})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data!.spexareExport;
}

export async function imp(type: ImpexType, file: File): Promise<JobReference> {
    const arrayBuffer = await file.arrayBuffer();
    const response = await axios.post(`${process.env.API_REST_BASE_URL}/api/spexare?type=${type}`, arrayBuffer, {
        headers: {
            'Content-Type': file.type,
        }
    });
    return response.data;
}

export async function addPartner(spexareId: string, id: string) {
    const result = await getClient()
        .mutation(AddPartnerMutation, {spexareId, id})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.spexarePartnerAdd;
}

export async function removePartner(spexareId: string) {
    const result = await getClient()
        .mutation(RemovePartnerMutation, {spexareId})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.spexarePartnerRemove;
}

export async function uploadImage(id: string, file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const response = await axios.put(`${process.env.API_REST_BASE_URL}/api/spexare/${id}/image`, arrayBuffer, {
        headers: {
            'Content-Type': file.type,
        }
    });
    return response.data;
}

export async function deleteImage(id: string) {
    await axios.delete(`${process.env.API_REST_BASE_URL}/api/spexare/${id}/image`);
    return {success: true};
}

export async function events(sourceId: string): Promise<Event[]> {
    const result = await getClient()
        .query<{ spexareEvents: Event[] }>(EventsQuery, {sourceId})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.spexareEvents ?? [];
}
