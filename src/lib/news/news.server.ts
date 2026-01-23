import 'server-only';

import {getClient} from '@/lib/urql.server';
import {ImpexType, JobReference, News, NewsConnection, NewsEdge, SortDirection} from "@/gql/graphql";
import {NewsPage} from "@/types/pagination";
import {mapConnection} from "@/utils/utils.server";
import axios from "@/lib/axios.server";

const SummaryFields = `
    id
    subject
    text
    visibleFrom
`;

const FullFields = `
    ${SummaryFields}
    published
    visibleTo
    createdAt
    createdBy
    lastModifiedAt
    lastModifiedBy
`;

const CreateMutation = /* GraphQL */ `
    mutation ($input: NewsCreate!) {
        newsCreate(input: $input) {
            ${FullFields}
        }
    }
`;

const UpdateMutation = /* GraphQL */ `
    mutation ($input: NewsUpdate!) {
        newsUpdate(input: $input) {
            ${FullFields}
        }
    }
`;

const DeleteMutation = /* GraphQL */ `
    mutation ($id: ID!) {
        newsDelete(id: $id)
    }
`;

const ExportQuery = /* GraphQL */ `
    query ($ids: [ID], $filter: String, $type: ImpexType!) {
        newsExport(ids: $ids, filter: $filter, type: $type) {
            id
        }
    }
`;

const EventsQuery = /* GraphQL */ `
    query ($sourceId: ID!) {
        newsEvents(sourceId: $sourceId) {
            id
            eventType
            createdAt
            createdBy
        }
    }
`;

const createQuery = (fields: string) => /* GraphQL */ `
    query ($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        newsPaged(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
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
}): Promise<NewsPage> {
    const query = createQuery(args.full ? FullFields : SummaryFields);

    const result = await getClient()
        .query<{ newsPaged: NewsConnection }>(query, {
            first: args.first,
            last: args.last,
            after: args.after ?? null,
            before: args.before ?? null,
            sort: args.sort ?? ["visibleFrom"],
            direction: args.direction ?? SortDirection.Desc,
            filter: args.filter ?? "published:TRUE",
        }, {
            fetchOptions: {
                next: {tags: ['news']}
            }
        })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return mapConnection<News, NewsEdge>(result.data?.newsPaged);
}

export async function create(input: any) {
    const result = await getClient()
        .mutation(CreateMutation, {input})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data?.newsCreate) {
        throw new Error("No data created");
    }

    return result.data?.newsCreate;
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

    if (!result.data?.newsUpdate) {
        throw new Error("No data updated");
    }

    return result.data?.newsUpdate;
}

export async function del(id: string) {
    const result = await getClient()
        .mutation(DeleteMutation, {id})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.newsDelete;
}

export async function exp(ids: string[] | null, filter: string | null, type: ImpexType): Promise<JobReference> {
    const result = await getClient()
        .query<{ newsExport: JobReference }>(ExportQuery, {ids, filter, type})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data!.newsExport;
}

export async function imp(type: ImpexType, file: File): Promise<JobReference> {
    const arrayBuffer = await file.arrayBuffer();
    const response = await axios.post(`${process.env.API_REST_BASE_URL}/api/news?type=${type}`, arrayBuffer, {
        headers: {
            'Content-Type': file.type,
        }
    });
    return response.data;
}

export async function events(sourceId: string): Promise<Event[]> {
    const result = await getClient()
        .query<{ newsEvents: Event[] }>(EventsQuery, {sourceId})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.newsEvents ?? [];
}
