import 'server-only';

import type {AnyVariables, OperationContext} from '@urql/core';
import {getClient} from '@/lib/urql.server';
import {mapConnection} from '@/utils/utils.server';
import {Event, ImpexType, JobReference, PageInfo, SortDirection} from '@/gql/graphql';
import {CursorPage} from '@/types/pagination';
import axios from '@/lib/axios.server';

export async function runQuery<TData>(
    query: string,
    variables: AnyVariables = {},
    context?: Partial<OperationContext>,
): Promise<TData | undefined> {
    const result = await getClient().query<TData>(query, variables, context).toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data;
}

export async function runMutation<TData>(
    mutation: string,
    variables: AnyVariables = {},
): Promise<TData | undefined> {
    const result = await getClient().mutation<TData>(mutation, variables).toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data;
}

export async function runMutationField<TValue>(
    mutation: string,
    variables: AnyVariables,
    field: string,
): Promise<TValue | undefined> {
    const data = await runMutation<Record<string, TValue>>(mutation, variables);
    return data?.[field];
}

export async function mutateForData<TValue>(
    mutation: string,
    variables: AnyVariables,
    field: string,
    errorMessage: string,
): Promise<TValue> {
    const data = await runMutation<Record<string, TValue>>(mutation, variables);
    const value = data?.[field];

    if (!value) {
        throw new Error(errorMessage);
    }

    return value;
}

export async function collectAllPages<TItem>(
    fetchPage: (after: string | null) => Promise<CursorPage<TItem>>,
): Promise<TItem[]> {
    const items: TItem[] = [];
    let hasNextPage = true;
    let after: string | null = null;

    while (hasNextPage) {
        const page = await fetchPage(after);
        items.push(...page.items);
        hasNextPage = page.pageInfo.hasNextPage;
        after = page.pageInfo.endCursor;
    }

    return items;
}

export function buildPagedQuery(pagedField: string, fields: string, fragment?: string): string {
    return /* GraphQL */ `
    query ($first: Int, $last: Int, $after: String, $before: String, $sort: [String], $direction: SortDirection, $filter: String) {
        ${pagedField}(first: $first, last: $last, after: $after, before: $before, sort: $sort, direction: $direction, filter: $filter) {
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
    ${fragment ?? ''}
`;
}

export function buildEventsQuery(eventsField: string): string {
    return /* GraphQL */ `
    query ($sourceId: ID!) {
        ${eventsField}(sourceId: $sourceId) {
            id
            eventType
            createdAt
            createdBy
        }
    }
`;
}

export function buildExportQuery(exportField: string): string {
    return /* GraphQL */ `
    query ($ids: [ID], $filter: String, $type: ImpexType!) {
        ${exportField}(ids: $ids, filter: $filter, type: $type) {
            id
        }
    }
`;
}

type ConnectionShape<TEdge> = {
    edges: (TEdge | null | undefined)[];
    pageInfo: PageInfo;
};

export type PagedArgs = {
    first?: number;
    last?: number;
    after?: string | null;
    before?: string | null;
    sort?: string[];
    direction?: SortDirection;
    filter?: string;
    full?: boolean;
};

export type ResourceConfig = {
    /** camelCase operation prefix, e.g. `spex`, `taskCategory`, `spexCategory`. */
    singular: string;
    /** GraphQL input type for `create`, e.g. `SpexCreate`. */
    createInputType: string;
    /** GraphQL input type for `update`, e.g. `SpexUpdate`. */
    updateInputType: string;
    /** Field selection (or `...Fragment` spread) used by summary/list views. */
    summaryFields: string;
    /** Field selection (or `...Fragment` spread) used by full/detail views. */
    fullFields: string;
    /** Fragment definitions to append when `summaryFields` is a spread. */
    summaryFragment?: string;
    /** Fragment definitions to append when `fullFields` is a spread. */
    fullFragment?: string;
    /** Next.js cache tag applied to list reads. */
    cacheTag: string;
    /** REST path segment for impex import, e.g. `spex`, `tasks`, `spex/categories`. */
    restPath: string;
    defaultSort: string[];
    defaultDirection: SortDirection;
    defaultFilter: string;
};

export function createResourceClient<
    TNode,
    TEdge extends {cursor: string; node: TNode},
    TCreateInput,
    TUpdateInput extends {id?: unknown},
>(config: ResourceConfig) {
    const {singular} = config;
    const pagedField = `${singular}Paged`;
    const createField = `${singular}Create`;
    const updateField = `${singular}Update`;
    const deleteField = `${singular}Delete`;
    const exportField = `${singular}Export`;
    const eventsField = `${singular}Events`;

    const CreateMutation = /* GraphQL */ `
    mutation ($input: ${config.createInputType}!) {
        ${createField}(input: $input) {
            ${config.fullFields}
        }
    }
    ${config.fullFragment ?? ''}
`;

    const UpdateMutation = /* GraphQL */ `
    mutation ($input: ${config.updateInputType}!) {
        ${updateField}(input: $input) {
            ${config.fullFields}
        }
    }
    ${config.fullFragment ?? ''}
`;

    const DeleteMutation = /* GraphQL */ `
    mutation ($id: ID!) {
        ${deleteField}(id: $id)
    }
`;

    async function getPaged(args: PagedArgs): Promise<CursorPage<TNode> & {edges: TEdge[]}> {
        const query = buildPagedQuery(
            pagedField,
            args.full ? config.fullFields : config.summaryFields,
            args.full ? config.fullFragment : config.summaryFragment,
        );

        const data = await runQuery<Record<string, ConnectionShape<TEdge>>>(query, {
            first: args.first,
            last: args.last,
            after: args.after ?? null,
            before: args.before ?? null,
            sort: args.sort ?? config.defaultSort,
            direction: args.direction ?? config.defaultDirection,
            filter: args.filter ?? config.defaultFilter,
        }, {
            fetchOptions: {
                next: {tags: [config.cacheTag]},
            },
        });

        return mapConnection<TNode, TEdge>(data?.[pagedField]);
    }

    async function getAll(args?: {full?: boolean}): Promise<TNode[]> {
        return collectAllPages<TNode>((after) =>
            getPaged({first: 100, after, full: args?.full, filter: ''}),
        );
    }

    async function create(input: TCreateInput): Promise<TNode> {
        return mutateForData<TNode>(CreateMutation, {input}, createField, 'No data created');
    }

    async function update(id: string, input: Omit<TUpdateInput, 'id'>): Promise<TNode> {
        return mutateForData<TNode>(UpdateMutation, {input: {...input, id}}, updateField, 'No data updated');
    }

    async function del(id: string): Promise<boolean | undefined> {
        return runMutationField<boolean>(DeleteMutation, {id}, deleteField);
    }

    async function exp(ids: string[] | null, filter: string | null, type: ImpexType): Promise<JobReference> {
        const data = await runQuery<Record<string, JobReference>>(buildExportQuery(exportField), {ids, filter, type});
        return data![exportField];
    }

    async function imp(type: ImpexType, file: File): Promise<JobReference> {
        const arrayBuffer = await file.arrayBuffer();
        const response = await axios.post(`${process.env.API_REST_BASE_URL}/api/${config.restPath}?type=${type}`, arrayBuffer, {
            headers: {
                'Content-Type': file.type,
            },
        });
        return response.data;
    }

    async function events(sourceId: string): Promise<Event[]> {
        const data = await runQuery<Record<string, Event[]>>(buildEventsQuery(eventsField), {sourceId});
        return data?.[eventsField] ?? [];
    }

    return {getPaged, getAll, create, update, del, exp, imp, events};
}
