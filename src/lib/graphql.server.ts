import 'server-only';

import type {AnyVariables, OperationContext} from '@urql/core';
import type {TypedDocumentNode} from '@graphql-typed-document-node/core';
import {getClient} from '@/lib/urql.server';
import {mapConnection} from '@/utils/utils.server';
import {Event, ImpexType, JobReference, PageInfo, SortDirection} from '@/gql/schema';
import {CursorPage} from '@/types/pagination';
import axios from '@/lib/axios.server';

export async function runQuery<TData, TVariables extends AnyVariables>(
    query: TypedDocumentNode<TData, TVariables>,
    variables: TVariables,
    context?: Partial<OperationContext>,
): Promise<TData | undefined>;
export async function runQuery<TData>(
    query: string,
    variables?: AnyVariables,
    context?: Partial<OperationContext>,
): Promise<TData | undefined>;
export async function runQuery<TData>(
    query: string | TypedDocumentNode<TData, AnyVariables>,
    variables: AnyVariables = {},
    context?: Partial<OperationContext>,
): Promise<TData | undefined> {
    const result = await getClient().query<TData>(query, variables, context).toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data;
}

export async function runMutation<TData, TVariables extends AnyVariables>(
    mutation: TypedDocumentNode<TData, TVariables>,
    variables: TVariables,
): Promise<TData | undefined>;
export async function runMutation<TData>(
    mutation: string,
    variables?: AnyVariables,
): Promise<TData | undefined>;
export async function runMutation<TData>(
    mutation: string | TypedDocumentNode<TData, AnyVariables>,
    variables: AnyVariables = {},
): Promise<TData | undefined> {
    const result = await getClient().mutation<TData>(mutation, variables).toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data;
}

export async function runMutationField<TData, TVariables extends AnyVariables, TField extends keyof TData>(
    mutation: TypedDocumentNode<TData, TVariables>,
    variables: TVariables,
    field: TField,
): Promise<TData[TField] | undefined>;
export async function runMutationField<TValue>(
    mutation: string,
    variables: AnyVariables,
    field: string,
): Promise<TValue | undefined>;
export async function runMutationField(
    mutation: string | TypedDocumentNode<unknown, AnyVariables>,
    variables: AnyVariables,
    field: string,
): Promise<unknown> {
    const data = await runMutation<Record<string, unknown>>(mutation as string, variables);
    return data?.[field];
}

export async function mutateForData<TData, TVariables extends AnyVariables, TField extends keyof TData>(
    mutation: TypedDocumentNode<TData, TVariables>,
    variables: TVariables,
    field: TField,
    errorMessage: string,
): Promise<NonNullable<TData[TField]>>;
export async function mutateForData<TValue>(
    mutation: string,
    variables: AnyVariables,
    field: string,
    errorMessage: string,
): Promise<TValue>;
export async function mutateForData(
    mutation: string | TypedDocumentNode<unknown, AnyVariables>,
    variables: AnyVariables,
    field: string,
    errorMessage: string,
): Promise<unknown> {
    const data = await runMutation<Record<string, unknown>>(mutation as string, variables);
    const value = data?.[field];

    if (!value) {
        throw new Error(errorMessage);
    }

    return value;
}

const MAX_COLLECT_PAGES = 1000;

export async function collectAllPages<TItem>(
    fetchPage: (after: string | null) => Promise<CursorPage<TItem>>,
): Promise<TItem[]> {
    const items: TItem[] = [];
    let hasNextPage = true;
    let after: string | null = null;
    let pages = 0;

    while (hasNextPage) {
        if (pages++ >= MAX_COLLECT_PAGES) {
            throw new Error(`collectAllPages exceeded ${MAX_COLLECT_PAGES} pages; aborting to avoid an unbounded loop`);
        }
        const page = await fetchPage(after);
        items.push(...page.items);
        hasNextPage = page.pageInfo.hasNextPage;
        after = page.pageInfo.endCursor;
    }

    return items;
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

/** Variables shared by every `${singular}Paged` cursor query. */
export type PagedQueryVariables = {
    first?: number | null;
    last?: number | null;
    after?: string | null;
    before?: string | null;
    sort?: Array<string | null> | null;
    direction?: SortDirection | null;
    filter?: string | null;
};

export type ExportQueryVariables = {
    ids?: Array<string | null> | null;
    filter?: string | null;
    type: ImpexType;
};

/**
 * Documents + metadata for a standard CRUD resource. The resource module supplies
 * schema-validated `graphql()` documents (so operations, variables and input types are
 * type-checked against the schema); the factory owns the uniform execution shape
 * (pagination loop, `mapConnection`, error handling, cache tags, REST import). Result
 * types are cast to the domain `TNode` at extraction — the same trust boundary as before,
 * so consumers keep receiving whole domain objects.
 */
export type ResourceClientConfig<TCreateInput, TUpdateInput> = {
    /** camelCase operation prefix, e.g. `spex`, `taskCategory` — used to read `data[<field>]`. */
    singular: string;
    /** Paged cursor query selecting summary fields (list views). */
    pagedSummaryQuery: TypedDocumentNode<Record<string, ConnectionShape<unknown> | null | undefined>, PagedQueryVariables>;
    /** Paged cursor query selecting full fields (detail-heavy list reads). */
    pagedFullQuery: TypedDocumentNode<Record<string, ConnectionShape<unknown> | null | undefined>, PagedQueryVariables>;
    createMutation: TypedDocumentNode<Record<string, unknown>, {input: TCreateInput}>;
    updateMutation: TypedDocumentNode<Record<string, unknown>, {input: TUpdateInput}>;
    deleteMutation: TypedDocumentNode<Record<string, unknown>, {id: string}>;
    /** Optional: omit for resources with a bespoke export (e.g. spexare's report export). */
    exportQuery?: TypedDocumentNode<Record<string, unknown>, ExportQueryVariables>;
    eventsQuery: TypedDocumentNode<Record<string, unknown>, {sourceId: string}>;
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
>(config: ResourceClientConfig<TCreateInput, TUpdateInput>) {
    const {singular} = config;
    const pagedField = `${singular}Paged`;
    const createField = `${singular}Create`;
    const updateField = `${singular}Update`;
    const deleteField = `${singular}Delete`;
    const exportField = `${singular}Export`;
    const eventsField = `${singular}Events`;

    async function getPaged(args: PagedArgs): Promise<CursorPage<TNode> & {edges: TEdge[]}> {
        const data = await runQuery(args.full ? config.pagedFullQuery : config.pagedSummaryQuery, {
            first: args.first ?? null,
            last: args.last ?? null,
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

        return mapConnection<TNode, TEdge>(data?.[pagedField] as ConnectionShape<TEdge> | null | undefined);
    }

    async function getAll(args?: {full?: boolean}): Promise<TNode[]> {
        return collectAllPages<TNode>((after) =>
            getPaged({first: 100, after, full: args?.full, filter: ''}),
        );
    }

    async function create(input: TCreateInput): Promise<TNode> {
        const value = await mutateForData(config.createMutation, {input}, createField, 'No data created');
        return value as TNode;
    }

    async function update(id: string, input: Omit<TUpdateInput, 'id'>): Promise<TNode> {
        const value = await mutateForData(
            config.updateMutation,
            {input: {...input, id} as TUpdateInput},
            updateField,
            'No data updated',
        );
        return value as TNode;
    }

    async function del(id: string): Promise<boolean | undefined> {
        return runMutationField(config.deleteMutation, {id}, deleteField) as Promise<boolean | undefined>;
    }

    async function exp(ids: string[] | null, filter: string | null, type: ImpexType): Promise<JobReference> {
        if (!config.exportQuery) {
            throw new Error(`Resource '${singular}' has no export query configured`);
        }
        const data = await runQuery(config.exportQuery, {ids, filter, type});
        return data![exportField] as JobReference;
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
        const data = await runQuery(config.eventsQuery, {sourceId});
        return (data?.[eventsField] as Event[] | undefined) ?? [];
    }

    return {getPaged, getAll, create, update, del, exp, imp, events};
}
