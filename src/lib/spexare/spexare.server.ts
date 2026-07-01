import 'server-only';

import {
    AggregationFilterInput,
    Facet,
    ImpexType,
    JobReference,
    ReportType,
    SortDirection,
    Spexare,
    SpexareCreate,
    SpexareEdge,
    SpexareUpdate,
    SpexareWithFacetsConnection
} from "@/gql/graphql";
import {SpexareWithFacetsPage} from "@/types/pagination";
import {mapConnection} from "@/utils/utils.server";
import axios from "@/lib/axios.server";
import {createResourceClient, runMutationField, runQuery} from "@/lib/graphql.server";
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

const client = createResourceClient<Spexare, SpexareEdge, SpexareCreate, SpexareUpdate>({
    singular: 'spexare',
    createInputType: 'SpexareCreate',
    updateInputType: 'SpexareUpdate',
    summaryFields: SummaryFields,
    fullFields: FullFields,
    summaryFragment: SummaryFragment,
    fullFragment: FullFragment,
    cacheTag: 'spexare',
    restPath: 'spexare',
    defaultSort: ['firstName'],
    defaultDirection: SortDirection.Asc,
    defaultFilter: 'published:TRUE',
});

export const {getPaged, create, update, del, imp, events} = client;

const GetQuery = /* GraphQL */ `
    query ($id: ID!) {
        spexare(id: $id) {
            ${FullFields}
        }
    }
    ${FullFragment}
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

const ExportQuery = /* GraphQL */ `
    query ($ids: [ID], $filter: String, $type: ImpexType!, $reportType: ReportType) {
        spexareExport(ids: $ids, filter: $filter, type: $type, reportType: $reportType) {
            id
        }
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

export async function search(args: {
    q: string;
    aggregationFilters?: AggregationFilterInput[];
    limit?: number;
    offset?: number;
    sort?: string[];
    direction?: SortDirection;
}): Promise<SpexareWithFacetsPage> {
    const data = await runQuery<{ spexareSearchPaged: SpexareWithFacetsConnection }>(SearchQuery, {
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
    });

    const connection = data?.spexareSearchPaged;
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

export async function get(id: string) {
    const data = await runQuery<{ spexare: Spexare }>(GetQuery, {id});
    return data?.spexare;
}

export async function exp(ids: string[] | null, filter: string | null, type: ImpexType, reportType: ReportType): Promise<JobReference> {
    const data = await runQuery<{ spexareExport: JobReference }>(ExportQuery, {ids, filter, type, reportType});
    return data!.spexareExport;
}

export async function addPartner(spexareId: string, id: string) {
    return runMutationField(AddPartnerMutation, {spexareId, id}, 'spexarePartnerAdd');
}

export async function removePartner(spexareId: string) {
    return runMutationField(RemovePartnerMutation, {spexareId}, 'spexarePartnerRemove');
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
