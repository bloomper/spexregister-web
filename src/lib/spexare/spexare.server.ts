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
} from "@/gql/schema";
import {SpexareWithFacetsPage} from "@/types/pagination";
import {mapConnection} from "@/utils/utils.server";
import axios from "@/lib/axios.server";
import {graphql} from "@/gql";
import {createResourceClient, runMutationField, runQuery} from "@/lib/graphql.server";

export const SpexareBase = graphql(`
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
`);

export const SpexareSummary = graphql(`
    fragment SpexareSummary on Spexare {
        ...SpexareBase
    }
`);

export const SpexareFull = graphql(`
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
`);

const SpexarePagedSummary = graphql(`
    query SpexarePagedSummary($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        spexarePaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
            edges { cursor node { ...SpexareSummary } }
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
        }
    }
`);

const SpexarePagedFull = graphql(`
    query SpexarePagedFull($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        spexarePaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
            edges { cursor node { ...SpexareFull } }
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
        }
    }
`);

const SpexareCreateMutation = graphql(`
    mutation SpexareCreate($input: SpexareCreate!) {
        spexareCreate(input: $input) { ...SpexareFull }
    }
`);

const SpexareUpdateMutation = graphql(`
    mutation SpexareUpdate($input: SpexareUpdate!) {
        spexareUpdate(input: $input) { ...SpexareFull }
    }
`);

const SpexareDeleteMutation = graphql(`
    mutation SpexareDelete($id: ID!) {
        spexareDelete(id: $id)
    }
`);

const SpexareEventsQuery = graphql(`
    query SpexareEvents($sourceId: ID!) {
        spexareEvents(sourceId: $sourceId) { id eventType createdAt createdBy }
    }
`);

const client = createResourceClient<Spexare, SpexareEdge, SpexareCreate, SpexareUpdate>({
    singular: 'spexare',
    pagedSummaryQuery: SpexarePagedSummary,
    pagedFullQuery: SpexarePagedFull,
    createMutation: SpexareCreateMutation,
    updateMutation: SpexareUpdateMutation,
    deleteMutation: SpexareDeleteMutation,
    eventsQuery: SpexareEventsQuery,
    cacheTag: 'spexare',
    restPath: 'spexare',
    defaultSort: ['firstName'],
    defaultDirection: SortDirection.Asc,
    defaultFilter: 'published:TRUE',
});

export const {getPaged, create, update, del, imp, events} = client;

const GetQuery = graphql(`
    query SpexareGet($id: ID!) {
        spexare(id: $id) { ...SpexareFull }
    }
`);

const AddPartnerMutation = graphql(`
    mutation SpexarePartnerAdd($spexareId: ID!, $id: ID!) {
        spexarePartnerAdd(spexareId: $spexareId, id: $id)
    }
`);

const RemovePartnerMutation = graphql(`
    mutation SpexarePartnerRemove($spexareId: ID!) {
        spexarePartnerRemove(spexareId: $spexareId)
    }
`);

const ExportQuery = graphql(`
    query SpexareExport($ids: [ID], $filter: String, $type: ImpexType!, $reportType: ReportType) {
        spexareExport(ids: $ids, filter: $filter, type: $type, reportType: $reportType) { id }
    }
`);

const SearchQuery = graphql(`
    query SpexareSearch($q: String!, $aggregationFilters: [AggregationFilterInput], $limit: Int, $offset: Int, $sort: [String], $direction: SortDirection) {
        spexareSearchPaged(q: $q, aggregationFilters: $aggregationFilters, limit: $limit, offset: $offset, sort: $sort, direction: $direction) {
            edges { cursor node { ...SpexareSummary } }
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
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
        }
    }
`);

export async function search(args: {
    q: string;
    aggregationFilters?: AggregationFilterInput[];
    limit?: number;
    offset?: number;
    sort?: string[];
    direction?: SortDirection;
}): Promise<SpexareWithFacetsPage> {
    const data = await runQuery(SearchQuery, {
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
    const page = mapConnection<Spexare, SpexareEdge>(safeConnection as Parameters<typeof mapConnection<Spexare, SpexareEdge>>[0]);

    return {
        ...page,
        facets: (connection?.facets ?? []).filter(Boolean) as Facet[],
    };
}

export async function get(id: string) {
    const data = await runQuery(GetQuery, {id});
    return data?.spexare as Spexare | undefined;
}

export async function exp(ids: string[] | null, filter: string | null, type: ImpexType, reportType: ReportType): Promise<JobReference> {
    const data = await runQuery(ExportQuery, {ids, filter, type, reportType});
    return data!.spexareExport as JobReference;
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
