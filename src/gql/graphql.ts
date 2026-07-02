/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import {EventType, ImpexType, ReportType, SortDirection, TypeType} from './schema';
import {TypedDocumentNode as DocumentNode} from '@graphql-typed-document-node/core';

export type ActorCreate = {
    role?: string | null | undefined;
};

export type ActorUpdate = {
    id: string | number;
    role?: string | null | undefined;
};

export type AddressCreate = {
    city?: string | null | undefined;
    country?: any;
    emailAddress?: any;
    phone?: string | null | undefined;
    phoneMobile?: string | null | undefined;
    postalCode?: string | null | undefined;
    streetAddress?: string | null | undefined;
};

export type AddressUpdate = {
    city?: string | null | undefined;
    country?: any;
    emailAddress?: any;
    id: string | number;
    phone?: string | null | undefined;
    phoneMobile?: string | null | undefined;
    postalCode?: string | null | undefined;
    streetAddress?: string | null | undefined;
};

export type AggregationFilterInput = {
    name: string;
    value: string;
};

export type ConsentCreate = {
    value: boolean;
};

export type ConsentUpdate = {
    id: string | number;
    value: boolean;
};

export {EventType};

export {ImpexType};

export type MembershipCreate = {
    year: any;
};

export type NewsCreate = {
    subject: string;
    text: string;
    visibleFrom?: any;
    visibleTo?: any;
};

export type NewsUpdate = {
    id: string | number;
    subject: string;
    text: string;
    visibleFrom?: any;
    visibleTo?: any;
};

export {ReportType};

export {SortDirection};

export type SpexCategoryCreate = {
    firstYear: any;
    name: string;
};

export type SpexCategoryUpdate = {
    firstYear: any;
    id: string | number;
    name: string;
};

export type SpexCreate = {
    title: string;
    year: any;
};

export type SpexUpdate = {
    id: string | number;
    title: string;
    year: any;
};

export type SpexareCreate = {
    deceased: boolean;
    firstName: string;
    lastName: string;
    nickName?: string | null | undefined;
    published: boolean;
};

export type SpexareUpdate = {
    comment?: string | null | undefined;
    deceased: boolean;
    firstName: string;
    graduation?: string | null | undefined;
    id: string | number;
    imageUrl?: string | null | undefined;
    lastName: string;
    nickName?: string | null | undefined;
    published: boolean;
    socialSecurityNumber?: any;
};

export type TagCreate = {
    name: string;
};

export type TagUpdate = {
    id: string | number;
    name: string;
};

export type TaskCategoryCreate = {
    actorPresent: boolean;
    name: string;
};

export type TaskCategoryUpdate = {
    actorPresent: boolean;
    id: string | number;
    name: string;
};

export type TaskCreate = {
    name: string;
};

export type TaskUpdate = {
    id: string | number;
    name: string;
};

export type ToggleCreate = {
    value: boolean;
};

export type ToggleUpdate = {
    id: string | number;
    value: boolean;
};

export {TypeType};

export type UserCreate = {
    email: any;
};

export type UserUpdate = {
    email: any;
    id: string | number;
};

export type JobStatusFieldsFragment = { id: string, name: string, status: string, exitStatus: string | null };

export type JobFieldsFragment = {
    id: string,
    name: string,
    status: string,
    exitStatus: string | null,
    createdAt: any,
    startedAt: any,
    finishedAt: any,
    hasDownload: boolean | null,
    importResult: {
        success: boolean,
        errors: Array<string | null> | null,
        messages: Array<string | null> | null,
        data: any
    } | null
};

export type JobStatusQueryVariables = Exact<{
    id: string | number;
}>;


export type JobStatusQuery = {
    jobStatus: { id: string, name: string, status: string, exitStatus: string | null } | null
};

export type JobByIdQueryVariables = Exact<{
    id: string | number;
}>;


export type JobByIdQuery = {
    job: {
        id: string,
        name: string,
        status: string,
        exitStatus: string | null,
        createdAt: any,
        startedAt: any,
        finishedAt: any,
        hasDownload: boolean | null,
        importResult: {
            success: boolean,
            errors: Array<string | null> | null,
            messages: Array<string | null> | null,
            data: any
        } | null
    } | null
};

export type JobsQueryVariables = Exact<{ [key: string]: never; }>;


export type JobsQuery = {
    jobs: Array<{
        id: string,
        name: string,
        status: string,
        exitStatus: string | null,
        createdAt: any,
        startedAt: any,
        finishedAt: any,
        hasDownload: boolean | null,
        importResult: {
            success: boolean,
            errors: Array<string | null> | null,
            messages: Array<string | null> | null,
            data: any
        } | null
    } | null> | null
};

export type JobDeleteMutationVariables = Exact<{
    id: string | number;
}>;


export type JobDeleteMutation = { jobDelete: any };

export type NewsSummaryFragment = { id: string, subject: string, text: string, visibleFrom: any };

export type NewsFullFragment = {
    published: boolean | null,
    visibleTo: any,
    createdAt: any,
    createdBy: string,
    lastModifiedAt: any,
    lastModifiedBy: string | null,
    id: string,
    subject: string,
    text: string,
    visibleFrom: any
};

export type NewsPagedSummaryQueryVariables = Exact<{
    first?: number | null | undefined;
    last?: number | null | undefined;
    after?: string | null | undefined;
    before?: string | null | undefined;
    sort?: Array<string | null | undefined> | string | null | undefined;
    direction?: SortDirection | null | undefined;
    filter?: string | null | undefined;
}>;


export type NewsPagedSummaryQuery = {
    newsPaged: {
        edges: Array<{ cursor: string, node: { id: string, subject: string, text: string, visibleFrom: any } } | null>,
        pageInfo: {
            hasNextPage: boolean,
            hasPreviousPage: boolean,
            startCursor: string | null,
            endCursor: string | null
        }
    } | null
};

export type NewsPagedFullQueryVariables = Exact<{
    first?: number | null | undefined;
    last?: number | null | undefined;
    after?: string | null | undefined;
    before?: string | null | undefined;
    sort?: Array<string | null | undefined> | string | null | undefined;
    direction?: SortDirection | null | undefined;
    filter?: string | null | undefined;
}>;


export type NewsPagedFullQuery = {
    newsPaged: {
        edges: Array<{
            cursor: string,
            node: {
                published: boolean | null,
                visibleTo: any,
                createdAt: any,
                createdBy: string,
                lastModifiedAt: any,
                lastModifiedBy: string | null,
                id: string,
                subject: string,
                text: string,
                visibleFrom: any
            }
        } | null>,
        pageInfo: {
            hasNextPage: boolean,
            hasPreviousPage: boolean,
            startCursor: string | null,
            endCursor: string | null
        }
    } | null
};

export type NewsCreateMutationVariables = Exact<{
    input: NewsCreate;
}>;


export type NewsCreateMutation = {
    newsCreate: {
        published: boolean | null,
        visibleTo: any,
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        subject: string,
        text: string,
        visibleFrom: any
    } | null
};

export type NewsUpdateMutationVariables = Exact<{
    input: NewsUpdate;
}>;


export type NewsUpdateMutation = {
    newsUpdate: {
        published: boolean | null,
        visibleTo: any,
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        subject: string,
        text: string,
        visibleFrom: any
    } | null
};

export type NewsDeleteMutationVariables = Exact<{
    id: string | number;
}>;


export type NewsDeleteMutation = { newsDelete: any };

export type NewsExportQueryVariables = Exact<{
    ids?: Array<string | number | null | undefined> | string | number | null | undefined;
    filter?: string | null | undefined;
    type: ImpexType;
}>;


export type NewsExportQuery = { newsExport: { id: string } | null };

export type NewsEventsQueryVariables = Exact<{
    sourceId: string | number;
}>;


export type NewsEventsQuery = {
    newsEvents: Array<{ id: string, eventType: EventType, createdAt: any, createdBy: string } | null> | null
};

export type CountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CountriesQuery = { countries: Array<{ isoCode: any, label: string | null } | null> | null };

export type TypesQueryVariables = Exact<{ [key: string]: never; }>;


export type TypesQuery = { types: Array<{ id: string, label: string, type: TypeType } | null> | null };

export type SpexCategorySummaryFragment = { id: string, name: string, logoUrl: string | null, firstYear: any };

export type SpexCategoryFullFragment = {
    createdAt: any,
    createdBy: string,
    lastModifiedAt: any,
    lastModifiedBy: string | null,
    id: string,
    name: string,
    logoUrl: string | null,
    firstYear: any
};

export type SpexCategoryPagedSummaryQueryVariables = Exact<{
    first?: number | null | undefined;
    last?: number | null | undefined;
    after?: string | null | undefined;
    before?: string | null | undefined;
    sort?: Array<string | null | undefined> | string | null | undefined;
    direction?: SortDirection | null | undefined;
    filter?: string | null | undefined;
}>;


export type SpexCategoryPagedSummaryQuery = {
    spexCategoryPaged: {
        edges: Array<{
            cursor: string,
            node: { id: string, name: string, logoUrl: string | null, firstYear: any }
        } | null>,
        pageInfo: {
            hasNextPage: boolean,
            hasPreviousPage: boolean,
            startCursor: string | null,
            endCursor: string | null
        }
    } | null
};

export type SpexCategoryPagedFullQueryVariables = Exact<{
    first?: number | null | undefined;
    last?: number | null | undefined;
    after?: string | null | undefined;
    before?: string | null | undefined;
    sort?: Array<string | null | undefined> | string | null | undefined;
    direction?: SortDirection | null | undefined;
    filter?: string | null | undefined;
}>;


export type SpexCategoryPagedFullQuery = {
    spexCategoryPaged: {
        edges: Array<{
            cursor: string,
            node: {
                createdAt: any,
                createdBy: string,
                lastModifiedAt: any,
                lastModifiedBy: string | null,
                id: string,
                name: string,
                logoUrl: string | null,
                firstYear: any
            }
        } | null>,
        pageInfo: {
            hasNextPage: boolean,
            hasPreviousPage: boolean,
            startCursor: string | null,
            endCursor: string | null
        }
    } | null
};

export type SpexCategoryCreateMutationVariables = Exact<{
    input: SpexCategoryCreate;
}>;


export type SpexCategoryCreateMutation = {
    spexCategoryCreate: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        name: string,
        logoUrl: string | null,
        firstYear: any
    } | null
};

export type SpexCategoryUpdateMutationVariables = Exact<{
    input: SpexCategoryUpdate;
}>;


export type SpexCategoryUpdateMutation = {
    spexCategoryUpdate: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        name: string,
        logoUrl: string | null,
        firstYear: any
    } | null
};

export type SpexCategoryDeleteMutationVariables = Exact<{
    id: string | number;
}>;


export type SpexCategoryDeleteMutation = { spexCategoryDelete: any };

export type SpexCategoryExportQueryVariables = Exact<{
    ids?: Array<string | number | null | undefined> | string | number | null | undefined;
    filter?: string | null | undefined;
    type: ImpexType;
}>;


export type SpexCategoryExportQuery = { spexCategoryExport: { id: string } | null };

export type SpexCategoryEventsQueryVariables = Exact<{
    sourceId: string | number;
}>;


export type SpexCategoryEventsQuery = {
    spexCategoryEvents: Array<{ id: string, eventType: EventType, createdAt: any, createdBy: string } | null> | null
};

export type SpexSummaryFragment = {
    id: string,
    year: any,
    title: string,
    posterUrl: string | null,
    revival: boolean | null,
    revivals: Array<{ id: string, year: any } | null> | null,
    category: { id: string, name: string } | null
};

export type SpexFullFragment = {
    createdAt: any,
    createdBy: string,
    lastModifiedAt: any,
    lastModifiedBy: string | null,
    id: string,
    year: any,
    title: string,
    posterUrl: string | null,
    revival: boolean | null,
    revivals: Array<{ id: string, year: any } | null> | null,
    category: { id: string, name: string } | null
};

export type SpexPagedSummaryQueryVariables = Exact<{
    first?: number | null | undefined;
    last?: number | null | undefined;
    after?: string | null | undefined;
    before?: string | null | undefined;
    sort?: Array<string | null | undefined> | string | null | undefined;
    direction?: SortDirection | null | undefined;
    filter?: string | null | undefined;
}>;


export type SpexPagedSummaryQuery = {
    spexPaged: {
        edges: Array<{
            cursor: string,
            node: {
                id: string,
                year: any,
                title: string,
                posterUrl: string | null,
                revival: boolean | null,
                revivals: Array<{ id: string, year: any } | null> | null,
                category: { id: string, name: string } | null
            }
        } | null>,
        pageInfo: {
            hasNextPage: boolean,
            hasPreviousPage: boolean,
            startCursor: string | null,
            endCursor: string | null
        }
    } | null
};

export type SpexPagedFullQueryVariables = Exact<{
    first?: number | null | undefined;
    last?: number | null | undefined;
    after?: string | null | undefined;
    before?: string | null | undefined;
    sort?: Array<string | null | undefined> | string | null | undefined;
    direction?: SortDirection | null | undefined;
    filter?: string | null | undefined;
}>;


export type SpexPagedFullQuery = {
    spexPaged: {
        edges: Array<{
            cursor: string,
            node: {
                createdAt: any,
                createdBy: string,
                lastModifiedAt: any,
                lastModifiedBy: string | null,
                id: string,
                year: any,
                title: string,
                posterUrl: string | null,
                revival: boolean | null,
                revivals: Array<{ id: string, year: any } | null> | null,
                category: { id: string, name: string } | null
            }
        } | null>,
        pageInfo: {
            hasNextPage: boolean,
            hasPreviousPage: boolean,
            startCursor: string | null,
            endCursor: string | null
        }
    } | null
};

export type SpexCreateMutationVariables = Exact<{
    input: SpexCreate;
}>;


export type SpexCreateMutation = {
    spexCreate: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        year: any,
        title: string,
        posterUrl: string | null,
        revival: boolean | null,
        revivals: Array<{ id: string, year: any } | null> | null,
        category: { id: string, name: string } | null
    } | null
};

export type SpexUpdateMutationVariables = Exact<{
    input: SpexUpdate;
}>;


export type SpexUpdateMutation = {
    spexUpdate: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        year: any,
        title: string,
        posterUrl: string | null,
        revival: boolean | null,
        revivals: Array<{ id: string, year: any } | null> | null,
        category: { id: string, name: string } | null
    } | null
};

export type SpexDeleteMutationVariables = Exact<{
    id: string | number;
}>;


export type SpexDeleteMutation = { spexDelete: any };

export type SpexExportQueryVariables = Exact<{
    ids?: Array<string | number | null | undefined> | string | number | null | undefined;
    filter?: string | null | undefined;
    type: ImpexType;
}>;


export type SpexExportQuery = { spexExport: { id: string } | null };

export type SpexEventsQueryVariables = Exact<{
    sourceId: string | number;
}>;


export type SpexEventsQuery = {
    spexEvents: Array<{ id: string, eventType: EventType, createdAt: any, createdBy: string } | null> | null
};

export type SpexCategoryAddMutationVariables = Exact<{
    id: string | number;
    categoryId: string | number;
}>;


export type SpexCategoryAddMutation = { spexCategoryAdd: any };

export type SpexCategoryRemoveMutationVariables = Exact<{
    id: string | number;
}>;


export type SpexCategoryRemoveMutation = { spexCategoryRemove: any };

export type SpexRevivalCreateMutationVariables = Exact<{
    spexId: string | number;
    year: any;
}>;


export type SpexRevivalCreateMutation = { spexRevivalCreate: { id: string, year: any } | null };

export type SpexRevivalDeleteMutationVariables = Exact<{
    id: string | number;
    spexId: string | number;
}>;


export type SpexRevivalDeleteMutation = { spexRevivalDelete: any };

export type ActivityBaseFragment = { id: string };

export type ActivitySummaryFragment = {
    id: string,
    spexActivity: {
        id: string,
        spex: { id: string, year: any, title: string, revival: boolean | null, category: { name: string } | null }
    } | null,
    taskActivities: Array<{
        id: string,
        actors: Array<{ id: string, role: string | null, vocal: { id: string, label: string } | null } | null> | null,
        task: { id: string, name: string, category: { name: string, actorPresent: boolean } | null }
    } | null> | null
};

export type ActivityFullFragment = {
    createdAt: any,
    createdBy: string,
    lastModifiedAt: any,
    lastModifiedBy: string | null,
    id: string,
    spexActivity: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        spex: { id: string, year: any, title: string, revival: boolean | null, category: { name: string } | null }
    } | null,
    taskActivities: Array<{
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        actors: Array<{
            createdAt: any,
            createdBy: string,
            lastModifiedAt: any,
            lastModifiedBy: string | null,
            id: string,
            role: string | null,
            vocal: { id: string, label: string } | null
        } | null> | null,
        task: { id: string, name: string, category: { name: string, actorPresent: boolean } | null }
    } | null> | null
};

export type ActivityCreateMutationVariables = Exact<{
    spexareId: string | number;
}>;


export type ActivityCreateMutation = {
    activityCreate: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        spexActivity: {
            createdAt: any,
            createdBy: string,
            lastModifiedAt: any,
            lastModifiedBy: string | null,
            id: string,
            spex: { id: string, year: any, title: string, revival: boolean | null, category: { name: string } | null }
        } | null,
        taskActivities: Array<{
            createdAt: any,
            createdBy: string,
            lastModifiedAt: any,
            lastModifiedBy: string | null,
            id: string,
            actors: Array<{
                createdAt: any,
                createdBy: string,
                lastModifiedAt: any,
                lastModifiedBy: string | null,
                id: string,
                role: string | null,
                vocal: { id: string, label: string } | null
            } | null> | null,
            task: { id: string, name: string, category: { name: string, actorPresent: boolean } | null }
        } | null> | null
    } | null
};

export type ActivityDeleteMutationVariables = Exact<{
    spexareId: string | number;
    id: string | number;
}>;


export type ActivityDeleteMutation = { activityDelete: any };

export type SpexActivityBaseFragment = {
    id: string,
    spex: { id: string, year: any, title: string, revival: boolean | null, category: { name: string } | null }
};

export type SpexActivitySummaryFragment = {
    id: string,
    spex: { id: string, year: any, title: string, revival: boolean | null, category: { name: string } | null }
};

export type SpexActivityFullFragment = {
    createdAt: any,
    createdBy: string,
    lastModifiedAt: any,
    lastModifiedBy: string | null,
    id: string,
    spex: { id: string, year: any, title: string, revival: boolean | null, category: { name: string } | null }
};

export type SpexActivityCreateMutationVariables = Exact<{
    spexareId: string | number;
    activityId: string | number;
    spexId: string | number;
}>;


export type SpexActivityCreateMutation = {
    spexActivityCreate: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        spex: { id: string, year: any, title: string, revival: boolean | null, category: { name: string } | null }
    } | null
};

export type SpexActivityUpdateMutationVariables = Exact<{
    spexareId: string | number;
    activityId: string | number;
    spexId: string | number;
    id: string | number;
}>;


export type SpexActivityUpdateMutation = {
    spexActivityUpdate: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        spex: { id: string, year: any, title: string, revival: boolean | null, category: { name: string } | null }
    } | null
};

export type SpexActivityDeleteMutationVariables = Exact<{
    spexareId: string | number;
    activityId: string | number;
    id: string | number;
}>;


export type SpexActivityDeleteMutation = { spexActivityDelete: any };

export type ActorSummaryFragment = { id: string, role: string | null, vocal: { id: string, label: string } | null };

export type ActorFullFragment = {
    createdAt: any,
    createdBy: string,
    lastModifiedAt: any,
    lastModifiedBy: string | null,
    id: string,
    role: string | null,
    vocal: { id: string, label: string } | null
};

export type ActorCreateMutationVariables = Exact<{
    spexareId: string | number;
    activityId: string | number;
    taskActivityId: string | number;
    vocalId: string | number;
    input: ActorCreate;
}>;


export type ActorCreateMutation = {
    actorCreate: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        role: string | null,
        vocal: { id: string, label: string } | null
    } | null
};

export type ActorUpdateMutationVariables = Exact<{
    spexareId: string | number;
    activityId: string | number;
    taskActivityId: string | number;
    vocalId: string | number;
    input: ActorUpdate;
}>;


export type ActorUpdateMutation = {
    actorUpdate: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        role: string | null,
        vocal: { id: string, label: string } | null
    } | null
};

export type ActorDeleteMutationVariables = Exact<{
    spexareId: string | number;
    activityId: string | number;
    taskActivityId: string | number;
    vocalId: string | number;
    id: string | number;
}>;


export type ActorDeleteMutation = { actorDelete: any };

export type TaskActivityBaseFragment = {
    id: string,
    task: { id: string, name: string, category: { name: string, actorPresent: boolean } | null }
};

export type TaskActivitySummaryFragment = {
    id: string,
    actors: Array<{ id: string, role: string | null, vocal: { id: string, label: string } | null } | null> | null,
    task: { id: string, name: string, category: { name: string, actorPresent: boolean } | null }
};

export type TaskActivityFullFragment = {
    createdAt: any,
    createdBy: string,
    lastModifiedAt: any,
    lastModifiedBy: string | null,
    id: string,
    actors: Array<{
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        role: string | null,
        vocal: { id: string, label: string } | null
    } | null> | null,
    task: { id: string, name: string, category: { name: string, actorPresent: boolean } | null }
};

export type TaskActivityCreateMutationVariables = Exact<{
    spexareId: string | number;
    activityId: string | number;
    taskId: string | number;
}>;


export type TaskActivityCreateMutation = {
    taskActivityCreate: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        actors: Array<{
            createdAt: any,
            createdBy: string,
            lastModifiedAt: any,
            lastModifiedBy: string | null,
            id: string,
            role: string | null,
            vocal: { id: string, label: string } | null
        } | null> | null,
        task: { id: string, name: string, category: { name: string, actorPresent: boolean } | null }
    } | null
};

export type TaskActivityUpdateMutationVariables = Exact<{
    spexareId: string | number;
    activityId: string | number;
    taskId: string | number;
    id: string | number;
}>;


export type TaskActivityUpdateMutation = {
    taskActivityUpdate: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        actors: Array<{
            createdAt: any,
            createdBy: string,
            lastModifiedAt: any,
            lastModifiedBy: string | null,
            id: string,
            role: string | null,
            vocal: { id: string, label: string } | null
        } | null> | null,
        task: { id: string, name: string, category: { name: string, actorPresent: boolean } | null }
    } | null
};

export type TaskActivityDeleteMutationVariables = Exact<{
    spexareId: string | number;
    activityId: string | number;
    id: string | number;
}>;


export type TaskActivityDeleteMutation = { taskActivityDelete: any };

export type AddressSummaryFragment = {
    id: string,
    streetAddress: string | null,
    postalCode: string | null,
    city: string | null,
    country: any,
    phone: string | null,
    phoneMobile: string | null,
    emailAddress: string | null,
    type: { id: string, label: string }
};

export type AddressFullFragment = {
    createdAt: any,
    createdBy: string,
    lastModifiedAt: any,
    lastModifiedBy: string | null,
    id: string,
    streetAddress: string | null,
    postalCode: string | null,
    city: string | null,
    country: any,
    phone: string | null,
    phoneMobile: string | null,
    emailAddress: string | null,
    type: { id: string, label: string }
};

export type AddressCreateMutationVariables = Exact<{
    spexareId: string | number;
    typeId: string | number;
    input: AddressCreate;
}>;


export type AddressCreateMutation = {
    addressCreate: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        streetAddress: string | null,
        postalCode: string | null,
        city: string | null,
        country: any,
        phone: string | null,
        phoneMobile: string | null,
        emailAddress: string | null,
        type: { id: string, label: string }
    } | null
};

export type AddressUpdateMutationVariables = Exact<{
    spexareId: string | number;
    typeId: string | number;
    input: AddressUpdate;
}>;


export type AddressUpdateMutation = {
    addressUpdate: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        streetAddress: string | null,
        postalCode: string | null,
        city: string | null,
        country: any,
        phone: string | null,
        phoneMobile: string | null,
        emailAddress: string | null,
        type: { id: string, label: string }
    } | null
};

export type AddressDeleteMutationVariables = Exact<{
    spexareId: string | number;
    typeId: string | number;
    id: string | number;
}>;


export type AddressDeleteMutation = { addressDelete: any };

export type ConsentSummaryFragment = { id: string, value: boolean, type: { id: string, label: string } };

export type ConsentFullFragment = {
    createdAt: any,
    createdBy: string,
    lastModifiedAt: any,
    lastModifiedBy: string | null,
    id: string,
    value: boolean,
    type: { id: string, label: string }
};

export type ConsentCreateMutationVariables = Exact<{
    spexareId: string | number;
    typeId: string | number;
    input: ConsentCreate;
}>;


export type ConsentCreateMutation = {
    consentCreate: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        value: boolean,
        type: { id: string, label: string }
    } | null
};

export type ConsentUpdateMutationVariables = Exact<{
    spexareId: string | number;
    typeId: string | number;
    input: ConsentUpdate;
}>;


export type ConsentUpdateMutation = {
    consentUpdate: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        value: boolean,
        type: { id: string, label: string }
    } | null
};

export type ConsentDeleteMutationVariables = Exact<{
    spexareId: string | number;
    typeId: string | number;
    id: string | number;
}>;


export type ConsentDeleteMutation = { consentDelete: any };

export type MembershipSummaryFragment = { id: string, year: any, type: { id: string, label: string } };

export type MembershipFullFragment = {
    createdAt: any,
    createdBy: string,
    lastModifiedAt: any,
    lastModifiedBy: string | null,
    id: string,
    year: any,
    type: { id: string, label: string }
};

export type MembershipCreateMutationVariables = Exact<{
    spexareId: string | number;
    typeId: string | number;
    input: MembershipCreate;
}>;


export type MembershipCreateMutation = {
    membershipCreate: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        year: any,
        type: { id: string, label: string }
    } | null
};

export type MembershipDeleteMutationVariables = Exact<{
    spexareId: string | number;
    typeId: string | number;
    id: string | number;
}>;


export type MembershipDeleteMutation = { membershipDelete: any };

export type SpexareBaseFragment = {
    id: string,
    firstName: string,
    lastName: string,
    nickName: string | null,
    socialSecurityNumber: any,
    deceased: boolean,
    published: boolean,
    graduation: string | null,
    comment: string | null,
    imageUrl: string | null,
    partner: {
        id: string,
        firstName: string,
        lastName: string,
        nickName: string | null,
        deceased: boolean,
        published: boolean,
        imageUrl: string | null
    } | null
};

export type SpexareSummaryFragment = {
    id: string,
    firstName: string,
    lastName: string,
    nickName: string | null,
    socialSecurityNumber: any,
    deceased: boolean,
    published: boolean,
    graduation: string | null,
    comment: string | null,
    imageUrl: string | null,
    partner: {
        id: string,
        firstName: string,
        lastName: string,
        nickName: string | null,
        deceased: boolean,
        published: boolean,
        imageUrl: string | null
    } | null
};

export type SpexareFullFragment = {
    createdAt: any,
    createdBy: string,
    lastModifiedAt: any,
    lastModifiedBy: string | null,
    id: string,
    firstName: string,
    lastName: string,
    nickName: string | null,
    socialSecurityNumber: any,
    deceased: boolean,
    published: boolean,
    graduation: string | null,
    comment: string | null,
    imageUrl: string | null,
    activities: Array<{
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        spexActivity: {
            createdAt: any,
            createdBy: string,
            lastModifiedAt: any,
            lastModifiedBy: string | null,
            id: string,
            spex: { id: string, year: any, title: string, revival: boolean | null, category: { name: string } | null }
        } | null,
        taskActivities: Array<{
            createdAt: any,
            createdBy: string,
            lastModifiedAt: any,
            lastModifiedBy: string | null,
            id: string,
            actors: Array<{
                createdAt: any,
                createdBy: string,
                lastModifiedAt: any,
                lastModifiedBy: string | null,
                id: string,
                role: string | null,
                vocal: { id: string, label: string } | null
            } | null> | null,
            task: { id: string, name: string, category: { name: string, actorPresent: boolean } | null }
        } | null> | null
    } | null> | null,
    addresses: Array<{
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        streetAddress: string | null,
        postalCode: string | null,
        city: string | null,
        country: any,
        phone: string | null,
        phoneMobile: string | null,
        emailAddress: string | null,
        type: { id: string, label: string }
    } | null> | null,
    consents: Array<{
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        value: boolean,
        type: { id: string, label: string }
    } | null> | null,
    memberships: Array<{
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        year: any,
        type: { id: string, label: string }
    } | null> | null,
    taggings: Array<{
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        name: string
    } | null> | null,
    toggles: Array<{
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        value: boolean,
        type: { id: string, label: string }
    } | null> | null,
    partner: {
        id: string,
        firstName: string,
        lastName: string,
        nickName: string | null,
        deceased: boolean,
        published: boolean,
        imageUrl: string | null
    } | null
};

export type SpexarePagedSummaryQueryVariables = Exact<{
    first?: number | null | undefined;
    last?: number | null | undefined;
    after?: string | null | undefined;
    before?: string | null | undefined;
    sort?: Array<string | null | undefined> | string | null | undefined;
    direction?: SortDirection | null | undefined;
    filter?: string | null | undefined;
}>;


export type SpexarePagedSummaryQuery = {
    spexarePaged: {
        edges: Array<{
            cursor: string,
            node: {
                id: string,
                firstName: string,
                lastName: string,
                nickName: string | null,
                socialSecurityNumber: any,
                deceased: boolean,
                published: boolean,
                graduation: string | null,
                comment: string | null,
                imageUrl: string | null,
                partner: {
                    id: string,
                    firstName: string,
                    lastName: string,
                    nickName: string | null,
                    deceased: boolean,
                    published: boolean,
                    imageUrl: string | null
                } | null
            }
        } | null>,
        pageInfo: {
            hasNextPage: boolean,
            hasPreviousPage: boolean,
            startCursor: string | null,
            endCursor: string | null
        }
    } | null
};

export type SpexarePagedFullQueryVariables = Exact<{
    first?: number | null | undefined;
    last?: number | null | undefined;
    after?: string | null | undefined;
    before?: string | null | undefined;
    sort?: Array<string | null | undefined> | string | null | undefined;
    direction?: SortDirection | null | undefined;
    filter?: string | null | undefined;
}>;


export type SpexarePagedFullQuery = {
    spexarePaged: {
        edges: Array<{
            cursor: string, node: {
                createdAt: any,
                createdBy: string,
                lastModifiedAt: any,
                lastModifiedBy: string | null,
                id: string,
                firstName: string,
                lastName: string,
                nickName: string | null,
                socialSecurityNumber: any,
                deceased: boolean,
                published: boolean,
                graduation: string | null,
                comment: string | null,
                imageUrl: string | null,
                activities: Array<{
                    createdAt: any,
                    createdBy: string,
                    lastModifiedAt: any,
                    lastModifiedBy: string | null,
                    id: string,
                    spexActivity: {
                        createdAt: any,
                        createdBy: string,
                        lastModifiedAt: any,
                        lastModifiedBy: string | null,
                        id: string,
                        spex: {
                            id: string,
                            year: any,
                            title: string,
                            revival: boolean | null,
                            category: { name: string } | null
                        }
                    } | null,
                    taskActivities: Array<{
                        createdAt: any,
                        createdBy: string,
                        lastModifiedAt: any,
                        lastModifiedBy: string | null,
                        id: string,
                        actors: Array<{
                            createdAt: any,
                            createdBy: string,
                            lastModifiedAt: any,
                            lastModifiedBy: string | null,
                            id: string,
                            role: string | null,
                            vocal: { id: string, label: string } | null
                        } | null> | null,
                        task: { id: string, name: string, category: { name: string, actorPresent: boolean } | null }
                    } | null> | null
                } | null> | null,
                addresses: Array<{
                    createdAt: any,
                    createdBy: string,
                    lastModifiedAt: any,
                    lastModifiedBy: string | null,
                    id: string,
                    streetAddress: string | null,
                    postalCode: string | null,
                    city: string | null,
                    country: any,
                    phone: string | null,
                    phoneMobile: string | null,
                    emailAddress: string | null,
                    type: { id: string, label: string }
                } | null> | null,
                consents: Array<{
                    createdAt: any,
                    createdBy: string,
                    lastModifiedAt: any,
                    lastModifiedBy: string | null,
                    id: string,
                    value: boolean,
                    type: { id: string, label: string }
                } | null> | null,
                memberships: Array<{
                    createdAt: any,
                    createdBy: string,
                    lastModifiedAt: any,
                    lastModifiedBy: string | null,
                    id: string,
                    year: any,
                    type: { id: string, label: string }
                } | null> | null,
                taggings: Array<{
                    createdAt: any,
                    createdBy: string,
                    lastModifiedAt: any,
                    lastModifiedBy: string | null,
                    id: string,
                    name: string
                } | null> | null,
                toggles: Array<{
                    createdAt: any,
                    createdBy: string,
                    lastModifiedAt: any,
                    lastModifiedBy: string | null,
                    id: string,
                    value: boolean,
                    type: { id: string, label: string }
                } | null> | null,
                partner: {
                    id: string,
                    firstName: string,
                    lastName: string,
                    nickName: string | null,
                    deceased: boolean,
                    published: boolean,
                    imageUrl: string | null
                } | null
            }
        } | null>,
        pageInfo: {
            hasNextPage: boolean,
            hasPreviousPage: boolean,
            startCursor: string | null,
            endCursor: string | null
        }
    } | null
};

export type SpexareCreateMutationVariables = Exact<{
    input: SpexareCreate;
}>;


export type SpexareCreateMutation = {
    spexareCreate: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        firstName: string,
        lastName: string,
        nickName: string | null,
        socialSecurityNumber: any,
        deceased: boolean,
        published: boolean,
        graduation: string | null,
        comment: string | null,
        imageUrl: string | null,
        activities: Array<{
            createdAt: any,
            createdBy: string,
            lastModifiedAt: any,
            lastModifiedBy: string | null,
            id: string,
            spexActivity: {
                createdAt: any,
                createdBy: string,
                lastModifiedAt: any,
                lastModifiedBy: string | null,
                id: string,
                spex: {
                    id: string,
                    year: any,
                    title: string,
                    revival: boolean | null,
                    category: { name: string } | null
                }
            } | null,
            taskActivities: Array<{
                createdAt: any,
                createdBy: string,
                lastModifiedAt: any,
                lastModifiedBy: string | null,
                id: string,
                actors: Array<{
                    createdAt: any,
                    createdBy: string,
                    lastModifiedAt: any,
                    lastModifiedBy: string | null,
                    id: string,
                    role: string | null,
                    vocal: { id: string, label: string } | null
                } | null> | null,
                task: { id: string, name: string, category: { name: string, actorPresent: boolean } | null }
            } | null> | null
        } | null> | null,
        addresses: Array<{
            createdAt: any,
            createdBy: string,
            lastModifiedAt: any,
            lastModifiedBy: string | null,
            id: string,
            streetAddress: string | null,
            postalCode: string | null,
            city: string | null,
            country: any,
            phone: string | null,
            phoneMobile: string | null,
            emailAddress: string | null,
            type: { id: string, label: string }
        } | null> | null,
        consents: Array<{
            createdAt: any,
            createdBy: string,
            lastModifiedAt: any,
            lastModifiedBy: string | null,
            id: string,
            value: boolean,
            type: { id: string, label: string }
        } | null> | null,
        memberships: Array<{
            createdAt: any,
            createdBy: string,
            lastModifiedAt: any,
            lastModifiedBy: string | null,
            id: string,
            year: any,
            type: { id: string, label: string }
        } | null> | null,
        taggings: Array<{
            createdAt: any,
            createdBy: string,
            lastModifiedAt: any,
            lastModifiedBy: string | null,
            id: string,
            name: string
        } | null> | null,
        toggles: Array<{
            createdAt: any,
            createdBy: string,
            lastModifiedAt: any,
            lastModifiedBy: string | null,
            id: string,
            value: boolean,
            type: { id: string, label: string }
        } | null> | null,
        partner: {
            id: string,
            firstName: string,
            lastName: string,
            nickName: string | null,
            deceased: boolean,
            published: boolean,
            imageUrl: string | null
        } | null
    } | null
};

export type SpexareUpdateMutationVariables = Exact<{
    input: SpexareUpdate;
}>;


export type SpexareUpdateMutation = {
    spexareUpdate: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        firstName: string,
        lastName: string,
        nickName: string | null,
        socialSecurityNumber: any,
        deceased: boolean,
        published: boolean,
        graduation: string | null,
        comment: string | null,
        imageUrl: string | null,
        activities: Array<{
            createdAt: any,
            createdBy: string,
            lastModifiedAt: any,
            lastModifiedBy: string | null,
            id: string,
            spexActivity: {
                createdAt: any,
                createdBy: string,
                lastModifiedAt: any,
                lastModifiedBy: string | null,
                id: string,
                spex: {
                    id: string,
                    year: any,
                    title: string,
                    revival: boolean | null,
                    category: { name: string } | null
                }
            } | null,
            taskActivities: Array<{
                createdAt: any,
                createdBy: string,
                lastModifiedAt: any,
                lastModifiedBy: string | null,
                id: string,
                actors: Array<{
                    createdAt: any,
                    createdBy: string,
                    lastModifiedAt: any,
                    lastModifiedBy: string | null,
                    id: string,
                    role: string | null,
                    vocal: { id: string, label: string } | null
                } | null> | null,
                task: { id: string, name: string, category: { name: string, actorPresent: boolean } | null }
            } | null> | null
        } | null> | null,
        addresses: Array<{
            createdAt: any,
            createdBy: string,
            lastModifiedAt: any,
            lastModifiedBy: string | null,
            id: string,
            streetAddress: string | null,
            postalCode: string | null,
            city: string | null,
            country: any,
            phone: string | null,
            phoneMobile: string | null,
            emailAddress: string | null,
            type: { id: string, label: string }
        } | null> | null,
        consents: Array<{
            createdAt: any,
            createdBy: string,
            lastModifiedAt: any,
            lastModifiedBy: string | null,
            id: string,
            value: boolean,
            type: { id: string, label: string }
        } | null> | null,
        memberships: Array<{
            createdAt: any,
            createdBy: string,
            lastModifiedAt: any,
            lastModifiedBy: string | null,
            id: string,
            year: any,
            type: { id: string, label: string }
        } | null> | null,
        taggings: Array<{
            createdAt: any,
            createdBy: string,
            lastModifiedAt: any,
            lastModifiedBy: string | null,
            id: string,
            name: string
        } | null> | null,
        toggles: Array<{
            createdAt: any,
            createdBy: string,
            lastModifiedAt: any,
            lastModifiedBy: string | null,
            id: string,
            value: boolean,
            type: { id: string, label: string }
        } | null> | null,
        partner: {
            id: string,
            firstName: string,
            lastName: string,
            nickName: string | null,
            deceased: boolean,
            published: boolean,
            imageUrl: string | null
        } | null
    } | null
};

export type SpexareDeleteMutationVariables = Exact<{
    id: string | number;
}>;


export type SpexareDeleteMutation = { spexareDelete: any };

export type SpexareEventsQueryVariables = Exact<{
    sourceId: string | number;
}>;


export type SpexareEventsQuery = {
    spexareEvents: Array<{ id: string, eventType: EventType, createdAt: any, createdBy: string } | null> | null
};

export type SpexareGetQueryVariables = Exact<{
    id: string | number;
}>;


export type SpexareGetQuery = {
    spexare: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        firstName: string,
        lastName: string,
        nickName: string | null,
        socialSecurityNumber: any,
        deceased: boolean,
        published: boolean,
        graduation: string | null,
        comment: string | null,
        imageUrl: string | null,
        activities: Array<{
            createdAt: any,
            createdBy: string,
            lastModifiedAt: any,
            lastModifiedBy: string | null,
            id: string,
            spexActivity: {
                createdAt: any,
                createdBy: string,
                lastModifiedAt: any,
                lastModifiedBy: string | null,
                id: string,
                spex: {
                    id: string,
                    year: any,
                    title: string,
                    revival: boolean | null,
                    category: { name: string } | null
                }
            } | null,
            taskActivities: Array<{
                createdAt: any,
                createdBy: string,
                lastModifiedAt: any,
                lastModifiedBy: string | null,
                id: string,
                actors: Array<{
                    createdAt: any,
                    createdBy: string,
                    lastModifiedAt: any,
                    lastModifiedBy: string | null,
                    id: string,
                    role: string | null,
                    vocal: { id: string, label: string } | null
                } | null> | null,
                task: { id: string, name: string, category: { name: string, actorPresent: boolean } | null }
            } | null> | null
        } | null> | null,
        addresses: Array<{
            createdAt: any,
            createdBy: string,
            lastModifiedAt: any,
            lastModifiedBy: string | null,
            id: string,
            streetAddress: string | null,
            postalCode: string | null,
            city: string | null,
            country: any,
            phone: string | null,
            phoneMobile: string | null,
            emailAddress: string | null,
            type: { id: string, label: string }
        } | null> | null,
        consents: Array<{
            createdAt: any,
            createdBy: string,
            lastModifiedAt: any,
            lastModifiedBy: string | null,
            id: string,
            value: boolean,
            type: { id: string, label: string }
        } | null> | null,
        memberships: Array<{
            createdAt: any,
            createdBy: string,
            lastModifiedAt: any,
            lastModifiedBy: string | null,
            id: string,
            year: any,
            type: { id: string, label: string }
        } | null> | null,
        taggings: Array<{
            createdAt: any,
            createdBy: string,
            lastModifiedAt: any,
            lastModifiedBy: string | null,
            id: string,
            name: string
        } | null> | null,
        toggles: Array<{
            createdAt: any,
            createdBy: string,
            lastModifiedAt: any,
            lastModifiedBy: string | null,
            id: string,
            value: boolean,
            type: { id: string, label: string }
        } | null> | null,
        partner: {
            id: string,
            firstName: string,
            lastName: string,
            nickName: string | null,
            deceased: boolean,
            published: boolean,
            imageUrl: string | null
        } | null
    } | null
};

export type SpexarePartnerAddMutationVariables = Exact<{
    spexareId: string | number;
    id: string | number;
}>;


export type SpexarePartnerAddMutation = { spexarePartnerAdd: any };

export type SpexarePartnerRemoveMutationVariables = Exact<{
    spexareId: string | number;
}>;


export type SpexarePartnerRemoveMutation = { spexarePartnerRemove: any };

export type SpexareExportQueryVariables = Exact<{
    ids?: Array<string | number | null | undefined> | string | number | null | undefined;
    filter?: string | null | undefined;
    type: ImpexType;
    reportType?: ReportType | null | undefined;
}>;


export type SpexareExportQuery = { spexareExport: { id: string } | null };

export type SpexareSearchQueryVariables = Exact<{
    q: string;
    aggregationFilters?: Array<AggregationFilterInput | null | undefined> | AggregationFilterInput | null | undefined;
    limit?: number | null | undefined;
    offset?: number | null | undefined;
    sort?: Array<string | null | undefined> | string | null | undefined;
    direction?: SortDirection | null | undefined;
}>;


export type SpexareSearchQuery = {
    spexareSearchPaged: {
        edges: Array<{
            cursor: string,
            node: {
                id: string,
                firstName: string,
                lastName: string,
                nickName: string | null,
                socialSecurityNumber: any,
                deceased: boolean,
                published: boolean,
                graduation: string | null,
                comment: string | null,
                imageUrl: string | null,
                partner: {
                    id: string,
                    firstName: string,
                    lastName: string,
                    nickName: string | null,
                    deceased: boolean,
                    published: boolean,
                    imageUrl: string | null
                } | null
            }
        } | null> | null,
        facets: Array<{
            id: string,
            label: string,
            groups: Array<{
                id: string,
                label: string,
                values: Array<{ id: string, label: string, count: number } | null>
            } | null>
        } | null> | null,
        pageInfo: {
            hasNextPage: boolean,
            hasPreviousPage: boolean,
            startCursor: string | null,
            endCursor: string | null
        } | null
    } | null
};

export type TaggingSummaryFragment = { id: string, name: string };

export type TaggingFullFragment = {
    createdAt: any,
    createdBy: string,
    lastModifiedAt: any,
    lastModifiedBy: string | null,
    id: string,
    name: string
};

export type TaggingCreateMutationVariables = Exact<{
    spexareId: string | number;
    tagId: string | number;
}>;


export type TaggingCreateMutation = { taggingCreate: any };

export type TaggingDeleteMutationVariables = Exact<{
    spexareId: string | number;
    tagId: string | number;
}>;


export type TaggingDeleteMutation = { taggingDelete: any };

export type ToggleSummaryFragment = { id: string, value: boolean, type: { id: string, label: string } };

export type ToggleFullFragment = {
    createdAt: any,
    createdBy: string,
    lastModifiedAt: any,
    lastModifiedBy: string | null,
    id: string,
    value: boolean,
    type: { id: string, label: string }
};

export type ToggleCreateMutationVariables = Exact<{
    spexareId: string | number;
    typeId: string | number;
    input: ToggleCreate;
}>;


export type ToggleCreateMutation = {
    toggleCreate: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        value: boolean,
        type: { id: string, label: string }
    } | null
};

export type ToggleUpdateMutationVariables = Exact<{
    spexareId: string | number;
    typeId: string | number;
    input: ToggleUpdate;
}>;


export type ToggleUpdateMutation = {
    toggleUpdate: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        value: boolean,
        type: { id: string, label: string }
    } | null
};

export type ToggleDeleteMutationVariables = Exact<{
    spexareId: string | number;
    typeId: string | number;
    id: string | number;
}>;


export type ToggleDeleteMutation = { toggleDelete: any };

export type StatisticsFieldsFragment = {
    spexareCount: any,
    userCount: any,
    spexCount: any,
    spexRevivalCount: any,
    taskCount: any,
    spexareCountHistory: Array<{ label: string, count: any } | null> | null,
    userCountHistory: Array<{ label: string, count: any } | null> | null,
    spexCountHistory: Array<{ label: string, count: any } | null> | null,
    spexRevivalCountHistory: Array<{ label: string, count: any } | null> | null,
    taskCountHistory: Array<{ label: string, count: any } | null> | null
};

export type StatisticsQueryVariables = Exact<{ [key: string]: never; }>;


export type StatisticsQuery = {
    statistics: {
        spexareCount: any,
        userCount: any,
        spexCount: any,
        spexRevivalCount: any,
        taskCount: any,
        spexareCountHistory: Array<{ label: string, count: any } | null> | null,
        userCountHistory: Array<{ label: string, count: any } | null> | null,
        spexCountHistory: Array<{ label: string, count: any } | null> | null,
        spexRevivalCountHistory: Array<{ label: string, count: any } | null> | null,
        taskCountHistory: Array<{ label: string, count: any } | null> | null
    } | null
};

export type TagSummaryFragment = { id: string, name: string };

export type TagFullFragment = {
    createdAt: any,
    createdBy: string,
    lastModifiedAt: any,
    lastModifiedBy: string | null,
    id: string,
    name: string
};

export type TagPagedSummaryQueryVariables = Exact<{
    first?: number | null | undefined;
    last?: number | null | undefined;
    after?: string | null | undefined;
    before?: string | null | undefined;
    sort?: Array<string | null | undefined> | string | null | undefined;
    direction?: SortDirection | null | undefined;
    filter?: string | null | undefined;
}>;


export type TagPagedSummaryQuery = {
    tagPaged: {
        edges: Array<{ cursor: string, node: { id: string, name: string } } | null>,
        pageInfo: {
            hasNextPage: boolean,
            hasPreviousPage: boolean,
            startCursor: string | null,
            endCursor: string | null
        }
    } | null
};

export type TagPagedFullQueryVariables = Exact<{
    first?: number | null | undefined;
    last?: number | null | undefined;
    after?: string | null | undefined;
    before?: string | null | undefined;
    sort?: Array<string | null | undefined> | string | null | undefined;
    direction?: SortDirection | null | undefined;
    filter?: string | null | undefined;
}>;


export type TagPagedFullQuery = {
    tagPaged: {
        edges: Array<{
            cursor: string,
            node: {
                createdAt: any,
                createdBy: string,
                lastModifiedAt: any,
                lastModifiedBy: string | null,
                id: string,
                name: string
            }
        } | null>,
        pageInfo: {
            hasNextPage: boolean,
            hasPreviousPage: boolean,
            startCursor: string | null,
            endCursor: string | null
        }
    } | null
};

export type TagCreateMutationVariables = Exact<{
    input: TagCreate;
}>;


export type TagCreateMutation = {
    tagCreate: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        name: string
    } | null
};

export type TagUpdateMutationVariables = Exact<{
    input: TagUpdate;
}>;


export type TagUpdateMutation = {
    tagUpdate: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        name: string
    } | null
};

export type TagDeleteMutationVariables = Exact<{
    id: string | number;
}>;


export type TagDeleteMutation = { tagDelete: any };

export type TagExportQueryVariables = Exact<{
    ids?: Array<string | number | null | undefined> | string | number | null | undefined;
    filter?: string | null | undefined;
    type: ImpexType;
}>;


export type TagExportQuery = { tagExport: { id: string } | null };

export type TagEventsQueryVariables = Exact<{
    sourceId: string | number;
}>;


export type TagEventsQuery = {
    tagEvents: Array<{ id: string, eventType: EventType, createdAt: any, createdBy: string } | null> | null
};

export type TaskCategorySummaryFragment = { id: string, name: string, actorPresent: boolean };

export type TaskCategoryFullFragment = {
    createdAt: any,
    createdBy: string,
    lastModifiedAt: any,
    lastModifiedBy: string | null,
    id: string,
    name: string,
    actorPresent: boolean
};

export type TaskCategoryPagedSummaryQueryVariables = Exact<{
    first?: number | null | undefined;
    last?: number | null | undefined;
    after?: string | null | undefined;
    before?: string | null | undefined;
    sort?: Array<string | null | undefined> | string | null | undefined;
    direction?: SortDirection | null | undefined;
    filter?: string | null | undefined;
}>;


export type TaskCategoryPagedSummaryQuery = {
    taskCategoryPaged: {
        edges: Array<{ cursor: string, node: { id: string, name: string, actorPresent: boolean } } | null>,
        pageInfo: {
            hasNextPage: boolean,
            hasPreviousPage: boolean,
            startCursor: string | null,
            endCursor: string | null
        }
    } | null
};

export type TaskCategoryPagedFullQueryVariables = Exact<{
    first?: number | null | undefined;
    last?: number | null | undefined;
    after?: string | null | undefined;
    before?: string | null | undefined;
    sort?: Array<string | null | undefined> | string | null | undefined;
    direction?: SortDirection | null | undefined;
    filter?: string | null | undefined;
}>;


export type TaskCategoryPagedFullQuery = {
    taskCategoryPaged: {
        edges: Array<{
            cursor: string,
            node: {
                createdAt: any,
                createdBy: string,
                lastModifiedAt: any,
                lastModifiedBy: string | null,
                id: string,
                name: string,
                actorPresent: boolean
            }
        } | null>,
        pageInfo: {
            hasNextPage: boolean,
            hasPreviousPage: boolean,
            startCursor: string | null,
            endCursor: string | null
        }
    } | null
};

export type TaskCategoryCreateMutationVariables = Exact<{
    input: TaskCategoryCreate;
}>;


export type TaskCategoryCreateMutation = {
    taskCategoryCreate: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        name: string,
        actorPresent: boolean
    } | null
};

export type TaskCategoryUpdateMutationVariables = Exact<{
    input: TaskCategoryUpdate;
}>;


export type TaskCategoryUpdateMutation = {
    taskCategoryUpdate: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        name: string,
        actorPresent: boolean
    } | null
};

export type TaskCategoryDeleteMutationVariables = Exact<{
    id: string | number;
}>;


export type TaskCategoryDeleteMutation = { taskCategoryDelete: any };

export type TaskCategoryExportQueryVariables = Exact<{
    ids?: Array<string | number | null | undefined> | string | number | null | undefined;
    filter?: string | null | undefined;
    type: ImpexType;
}>;


export type TaskCategoryExportQuery = { taskCategoryExport: { id: string } | null };

export type TaskCategoryEventsQueryVariables = Exact<{
    sourceId: string | number;
}>;


export type TaskCategoryEventsQuery = {
    taskCategoryEvents: Array<{ id: string, eventType: EventType, createdAt: any, createdBy: string } | null> | null
};

export type TaskSummaryFragment = {
    id: string,
    name: string,
    category: { id: string, name: string, actorPresent: boolean } | null
};

export type TaskFullFragment = {
    createdAt: any,
    createdBy: string,
    lastModifiedAt: any,
    lastModifiedBy: string | null,
    id: string,
    name: string,
    category: { id: string, name: string, actorPresent: boolean } | null
};

export type TaskPagedSummaryQueryVariables = Exact<{
    first?: number | null | undefined;
    last?: number | null | undefined;
    after?: string | null | undefined;
    before?: string | null | undefined;
    sort?: Array<string | null | undefined> | string | null | undefined;
    direction?: SortDirection | null | undefined;
    filter?: string | null | undefined;
}>;


export type TaskPagedSummaryQuery = {
    taskPaged: {
        edges: Array<{
            cursor: string,
            node: { id: string, name: string, category: { id: string, name: string, actorPresent: boolean } | null }
        } | null>,
        pageInfo: {
            hasNextPage: boolean,
            hasPreviousPage: boolean,
            startCursor: string | null,
            endCursor: string | null
        }
    } | null
};

export type TaskPagedFullQueryVariables = Exact<{
    first?: number | null | undefined;
    last?: number | null | undefined;
    after?: string | null | undefined;
    before?: string | null | undefined;
    sort?: Array<string | null | undefined> | string | null | undefined;
    direction?: SortDirection | null | undefined;
    filter?: string | null | undefined;
}>;


export type TaskPagedFullQuery = {
    taskPaged: {
        edges: Array<{
            cursor: string,
            node: {
                createdAt: any,
                createdBy: string,
                lastModifiedAt: any,
                lastModifiedBy: string | null,
                id: string,
                name: string,
                category: { id: string, name: string, actorPresent: boolean } | null
            }
        } | null>,
        pageInfo: {
            hasNextPage: boolean,
            hasPreviousPage: boolean,
            startCursor: string | null,
            endCursor: string | null
        }
    } | null
};

export type TaskCreateMutationVariables = Exact<{
    input: TaskCreate;
}>;


export type TaskCreateMutation = {
    taskCreate: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        name: string,
        category: { id: string, name: string, actorPresent: boolean } | null
    } | null
};

export type TaskUpdateMutationVariables = Exact<{
    input: TaskUpdate;
}>;


export type TaskUpdateMutation = {
    taskUpdate: {
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        name: string,
        category: { id: string, name: string, actorPresent: boolean } | null
    } | null
};

export type TaskDeleteMutationVariables = Exact<{
    id: string | number;
}>;


export type TaskDeleteMutation = { taskDelete: any };

export type TaskExportQueryVariables = Exact<{
    ids?: Array<string | number | null | undefined> | string | number | null | undefined;
    filter?: string | null | undefined;
    type: ImpexType;
}>;


export type TaskExportQuery = { taskExport: { id: string } | null };

export type TaskEventsQueryVariables = Exact<{
    sourceId: string | number;
}>;


export type TaskEventsQuery = {
    taskEvents: Array<{ id: string, eventType: EventType, createdAt: any, createdBy: string } | null> | null
};

export type TaskCategoryAddMutationVariables = Exact<{
    id: string | number;
    categoryId: string | number;
}>;


export type TaskCategoryAddMutation = { taskCategoryAdd: any };

export type TaskCategoryRemoveMutationVariables = Exact<{
    id: string | number;
}>;


export type TaskCategoryRemoveMutation = { taskCategoryRemove: any };

export type UserSummaryFragment = {
    id: string,
    externalId: string,
    email: any,
    authorities: Array<{ id: string, label: string } | null> | null,
    state: { id: string, label: string } | null,
    spexare: { id: string, firstName: string, lastName: string, nickName: string | null } | null
};

export type UserFullFragment = {
    temporaryPassword: string | null,
    createdAt: any,
    createdBy: string,
    lastModifiedAt: any,
    lastModifiedBy: string | null,
    id: string,
    externalId: string,
    email: any,
    authorities: Array<{ id: string, label: string } | null> | null,
    state: { id: string, label: string } | null,
    spexare: { id: string, firstName: string, lastName: string, nickName: string | null } | null
};

export type UserPagedSummaryQueryVariables = Exact<{
    first?: number | null | undefined;
    last?: number | null | undefined;
    after?: string | null | undefined;
    before?: string | null | undefined;
    sort?: Array<string | null | undefined> | string | null | undefined;
    direction?: SortDirection | null | undefined;
    filter?: string | null | undefined;
}>;


export type UserPagedSummaryQuery = {
    userPaged: {
        edges: Array<{
            cursor: string,
            node: {
                id: string,
                externalId: string,
                email: any,
                authorities: Array<{ id: string, label: string } | null> | null,
                state: { id: string, label: string } | null,
                spexare: { id: string, firstName: string, lastName: string, nickName: string | null } | null
            }
        } | null>,
        pageInfo: {
            hasNextPage: boolean,
            hasPreviousPage: boolean,
            startCursor: string | null,
            endCursor: string | null
        }
    } | null
};

export type UserPagedFullQueryVariables = Exact<{
    first?: number | null | undefined;
    last?: number | null | undefined;
    after?: string | null | undefined;
    before?: string | null | undefined;
    sort?: Array<string | null | undefined> | string | null | undefined;
    direction?: SortDirection | null | undefined;
    filter?: string | null | undefined;
}>;


export type UserPagedFullQuery = {
    userPaged: {
        edges: Array<{
            cursor: string,
            node: {
                temporaryPassword: string | null,
                createdAt: any,
                createdBy: string,
                lastModifiedAt: any,
                lastModifiedBy: string | null,
                id: string,
                externalId: string,
                email: any,
                authorities: Array<{ id: string, label: string } | null> | null,
                state: { id: string, label: string } | null,
                spexare: { id: string, firstName: string, lastName: string, nickName: string | null } | null
            }
        } | null>,
        pageInfo: {
            hasNextPage: boolean,
            hasPreviousPage: boolean,
            startCursor: string | null,
            endCursor: string | null
        }
    } | null
};

export type UserCreateMutationVariables = Exact<{
    input: UserCreate;
}>;


export type UserCreateMutation = {
    userCreate: {
        temporaryPassword: string | null,
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        externalId: string,
        email: any,
        authorities: Array<{ id: string, label: string } | null> | null,
        state: { id: string, label: string } | null,
        spexare: { id: string, firstName: string, lastName: string, nickName: string | null } | null
    } | null
};

export type UserUpdateMutationVariables = Exact<{
    input: UserUpdate;
}>;


export type UserUpdateMutation = {
    userUpdate: {
        temporaryPassword: string | null,
        createdAt: any,
        createdBy: string,
        lastModifiedAt: any,
        lastModifiedBy: string | null,
        id: string,
        externalId: string,
        email: any,
        authorities: Array<{ id: string, label: string } | null> | null,
        state: { id: string, label: string } | null,
        spexare: { id: string, firstName: string, lastName: string, nickName: string | null } | null
    } | null
};

export type UserDeleteMutationVariables = Exact<{
    id: string | number;
}>;


export type UserDeleteMutation = { userDelete: any };

export type UserExportQueryVariables = Exact<{
    ids?: Array<string | number | null | undefined> | string | number | null | undefined;
    filter?: string | null | undefined;
    type: ImpexType;
}>;


export type UserExportQuery = { userExport: { id: string } | null };

export type UserEventsQueryVariables = Exact<{
    sourceId: string | number;
}>;


export type UserEventsQuery = {
    userEvents: Array<{ id: string, eventType: EventType, createdAt: any, createdBy: string } | null> | null
};

export type UserAuthoritiesAddMutationVariables = Exact<{
    userId: string | number;
    ids: Array<string | number | null | undefined> | string | number;
}>;


export type UserAuthoritiesAddMutation = { userAuthoritiesAdd: any };

export type UserAuthoritiesRemoveMutationVariables = Exact<{
    userId: string | number;
    ids: Array<string | number | null | undefined> | string | number;
}>;


export type UserAuthoritiesRemoveMutation = { userAuthoritiesRemove: any };

export type UserStateSetMutationVariables = Exact<{
    userId: string | number;
    id: string | number;
}>;


export type UserStateSetMutation = { userStateSet: any };

export type UserSpexareAddMutationVariables = Exact<{
    userId: string | number;
    id: string | number;
}>;


export type UserSpexareAddMutation = { userSpexareAdd: any };

export type UserSpexareRemoveMutationVariables = Exact<{
    userId: string | number;
}>;


export type UserSpexareRemoveMutation = { userSpexareRemove: any };

export type UserMeQueryVariables = Exact<{ [key: string]: never; }>;


export type UserMeQuery = {
    me: {
        spexare: {
            createdAt: any,
            createdBy: string,
            lastModifiedAt: any,
            lastModifiedBy: string | null,
            id: string,
            firstName: string,
            lastName: string,
            nickName: string | null,
            socialSecurityNumber: any,
            deceased: boolean,
            published: boolean,
            graduation: string | null,
            comment: string | null,
            imageUrl: string | null,
            activities: Array<{
                createdAt: any,
                createdBy: string,
                lastModifiedAt: any,
                lastModifiedBy: string | null,
                id: string,
                spexActivity: {
                    createdAt: any,
                    createdBy: string,
                    lastModifiedAt: any,
                    lastModifiedBy: string | null,
                    id: string,
                    spex: {
                        id: string,
                        year: any,
                        title: string,
                        revival: boolean | null,
                        category: { name: string } | null
                    }
                } | null,
                taskActivities: Array<{
                    createdAt: any,
                    createdBy: string,
                    lastModifiedAt: any,
                    lastModifiedBy: string | null,
                    id: string,
                    actors: Array<{
                        createdAt: any,
                        createdBy: string,
                        lastModifiedAt: any,
                        lastModifiedBy: string | null,
                        id: string,
                        role: string | null,
                        vocal: { id: string, label: string } | null
                    } | null> | null,
                    task: { id: string, name: string, category: { name: string, actorPresent: boolean } | null }
                } | null> | null
            } | null> | null,
            addresses: Array<{
                createdAt: any,
                createdBy: string,
                lastModifiedAt: any,
                lastModifiedBy: string | null,
                id: string,
                streetAddress: string | null,
                postalCode: string | null,
                city: string | null,
                country: any,
                phone: string | null,
                phoneMobile: string | null,
                emailAddress: string | null,
                type: { id: string, label: string }
            } | null> | null,
            consents: Array<{
                createdAt: any,
                createdBy: string,
                lastModifiedAt: any,
                lastModifiedBy: string | null,
                id: string,
                value: boolean,
                type: { id: string, label: string }
            } | null> | null,
            memberships: Array<{
                createdAt: any,
                createdBy: string,
                lastModifiedAt: any,
                lastModifiedBy: string | null,
                id: string,
                year: any,
                type: { id: string, label: string }
            } | null> | null,
            taggings: Array<{
                createdAt: any,
                createdBy: string,
                lastModifiedAt: any,
                lastModifiedBy: string | null,
                id: string,
                name: string
            } | null> | null,
            toggles: Array<{
                createdAt: any,
                createdBy: string,
                lastModifiedAt: any,
                lastModifiedBy: string | null,
                id: string,
                value: boolean,
                type: { id: string, label: string }
            } | null> | null,
            partner: {
                id: string,
                firstName: string,
                lastName: string,
                nickName: string | null,
                deceased: boolean,
                published: boolean,
                imageUrl: string | null
            } | null
        } | null
    } | null
};

export type AuthoritiesQueryVariables = Exact<{ [key: string]: never; }>;


export type AuthoritiesQuery = { authorities: Array<{ id: string, label: string } | null> | null };

export type StatesQueryVariables = Exact<{ [key: string]: never; }>;


export type StatesQuery = { states: Array<{ id: string, label: string } | null> | null };

export const JobStatusFieldsFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "JobStatusFields"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "JobStatus"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "status"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "exitStatus"}
            }]
        }
    }]
} as unknown as DocumentNode<JobStatusFieldsFragment, unknown>;
export const JobFieldsFragmentDoc = {
    "kind": "Document", "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "JobFields"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Job"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "status"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "exitStatus"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "startedAt"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "finishedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "hasDownload"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "importResult"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "success"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "errors"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "messages"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "data"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<JobFieldsFragment, unknown>;
export const NewsSummaryFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "NewsSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "News"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "subject"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "text"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "visibleFrom"}
            }]
        }
    }]
} as unknown as DocumentNode<NewsSummaryFragment, unknown>;
export const NewsFullFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "NewsFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "News"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "NewsSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "published"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "visibleTo"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "NewsSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "News"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "subject"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "text"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "visibleFrom"}
            }]
        }
    }]
} as unknown as DocumentNode<NewsFullFragment, unknown>;
export const SpexCategorySummaryFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexCategorySummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexCategory"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "logoUrl"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "firstYear"}
            }]
        }
    }]
} as unknown as DocumentNode<SpexCategorySummaryFragment, unknown>;
export const SpexCategoryFullFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexCategoryFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexCategory"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "SpexCategorySummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexCategorySummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexCategory"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "logoUrl"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "firstYear"}
            }]
        }
    }]
} as unknown as DocumentNode<SpexCategoryFullFragment, unknown>;
export const SpexSummaryFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spex"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "year"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "title"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "posterUrl"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "revival"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "revivals"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "year"}
                    }]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "category"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "name"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<SpexSummaryFragment, unknown>;
export const SpexFullFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spex"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "SpexSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spex"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "year"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "title"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "posterUrl"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "revival"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "revivals"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "year"}
                    }]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "category"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "name"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<SpexFullFragment, unknown>;
export const ActivityBaseFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Activity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}]
        }
    }]
} as unknown as DocumentNode<ActivityBaseFragment, unknown>;
export const SpexActivityBaseFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spex"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "year"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "title"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "revival"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "name"}}]
                        }
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<SpexActivityBaseFragment, unknown>;
export const SpexActivitySummaryFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexActivitySummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "SpexActivityBase"}}]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spex"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "year"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "title"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "revival"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "name"}}]
                        }
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<SpexActivitySummaryFragment, unknown>;
export const TaskActivityBaseFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "task"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "name"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "name"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "actorPresent"}}]
                        }
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<TaskActivityBaseFragment, unknown>;
export const ActorSummaryFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "role"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "vocal"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<ActorSummaryFragment, unknown>;
export const TaskActivitySummaryFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskActivitySummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaskActivityBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "actors"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ActorSummary"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "task"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "name"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "name"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "actorPresent"}}]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "role"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "vocal"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<TaskActivitySummaryFragment, unknown>;
export const ActivitySummaryFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActivitySummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Activity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ActivityBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexActivity"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "SpexActivitySummary"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskActivities"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "TaskActivitySummary"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spex"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "year"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "title"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "revival"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "name"}}]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "task"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "name"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "name"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "actorPresent"}}]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "role"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "vocal"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Activity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexActivitySummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "SpexActivityBase"}}]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskActivitySummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaskActivityBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "actors"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ActorSummary"}}]
                }
            }]
        }
    }]
} as unknown as DocumentNode<ActivitySummaryFragment, unknown>;
export const SpexareBaseFragmentDoc = {
    "kind": "Document", "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexareBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spexare"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "firstName"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastName"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "nickName"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "socialSecurityNumber"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "deceased"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "published"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "graduation"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "comment"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "imageUrl"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "partner"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "firstName"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "lastName"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "nickName"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "deceased"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "published"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "imageUrl"}}]
                }
            }]
        }
    }]
} as unknown as DocumentNode<SpexareBaseFragment, unknown>;
export const SpexareSummaryFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexareSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spexare"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "SpexareBase"}}]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexareBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spexare"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "firstName"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastName"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "nickName"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "socialSecurityNumber"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "deceased"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "published"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "graduation"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "comment"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "imageUrl"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "partner"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "firstName"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "lastName"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "nickName"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "deceased"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "published"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "imageUrl"}}]
                }
            }]
        }
    }]
} as unknown as DocumentNode<SpexareSummaryFragment, unknown>;
export const SpexActivityFullFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "SpexActivityBase"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spex"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "year"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "title"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "revival"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "name"}}]
                        }
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<SpexActivityFullFragment, unknown>;
export const ActorFullFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ActorSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "role"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "vocal"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<ActorFullFragment, unknown>;
export const TaskActivityFullFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaskActivityBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "actors"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ActorFull"}}]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "role"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "vocal"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "task"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "name"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "name"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "actorPresent"}}]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ActorSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<TaskActivityFullFragment, unknown>;
export const ActivityFullFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Activity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ActivityBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexActivity"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "SpexActivityFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskActivities"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "TaskActivityFull"}}]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spex"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "year"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "title"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "revival"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "name"}}]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "task"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "name"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "name"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "actorPresent"}}]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "role"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "vocal"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ActorSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Activity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "SpexActivityBase"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaskActivityBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "actors"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ActorFull"}}]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<ActivityFullFragment, unknown>;
export const AddressSummaryFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "AddressSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Address"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "streetAddress"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "postalCode"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "city"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "country"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "phone"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "phoneMobile"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "emailAddress"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<AddressSummaryFragment, unknown>;
export const AddressFullFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "AddressFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Address"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "AddressSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "AddressSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Address"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "streetAddress"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "postalCode"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "city"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "country"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "phone"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "phoneMobile"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "emailAddress"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<AddressFullFragment, unknown>;
export const ConsentSummaryFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ConsentSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Consent"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "value"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<ConsentSummaryFragment, unknown>;
export const ConsentFullFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ConsentFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Consent"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ConsentSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ConsentSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Consent"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "value"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<ConsentFullFragment, unknown>;
export const MembershipSummaryFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "MembershipSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Membership"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "year"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<MembershipSummaryFragment, unknown>;
export const MembershipFullFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "MembershipFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Membership"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "MembershipSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "MembershipSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Membership"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "year"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<MembershipFullFragment, unknown>;
export const TaggingSummaryFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaggingSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Tag"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }]
        }
    }]
} as unknown as DocumentNode<TaggingSummaryFragment, unknown>;
export const TaggingFullFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaggingFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Tag"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaggingSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaggingSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Tag"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }]
        }
    }]
} as unknown as DocumentNode<TaggingFullFragment, unknown>;
export const ToggleSummaryFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ToggleSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Toggle"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "value"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<ToggleSummaryFragment, unknown>;
export const ToggleFullFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ToggleFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Toggle"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ToggleSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ToggleSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Toggle"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "value"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<ToggleFullFragment, unknown>;
export const SpexareFullFragmentDoc = {
    "kind": "Document", "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexareFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spexare"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "SpexareBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "activities"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ActivityFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "addresses"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "AddressFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "consents"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ConsentFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "memberships"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "MembershipFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "taggings"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "TaggingFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "toggles"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ToggleFull"}}]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Activity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spex"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "year"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "title"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "revival"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "name"}}]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "SpexActivityBase"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "task"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "name"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "name"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "actorPresent"}}]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "role"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "vocal"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ActorSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaskActivityBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "actors"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ActorFull"}}]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "AddressSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Address"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "streetAddress"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "postalCode"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "city"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "country"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "phone"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "phoneMobile"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "emailAddress"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ConsentSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Consent"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "value"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "MembershipSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Membership"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "year"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaggingSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Tag"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ToggleSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Toggle"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "value"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexareBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spexare"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "firstName"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastName"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "nickName"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "socialSecurityNumber"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "deceased"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "published"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "graduation"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "comment"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "imageUrl"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "partner"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "firstName"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "lastName"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "nickName"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "deceased"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "published"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "imageUrl"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Activity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ActivityBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexActivity"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "SpexActivityFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskActivities"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "TaskActivityFull"}}]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "AddressFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Address"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "AddressSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ConsentFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Consent"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ConsentSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "MembershipFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Membership"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "MembershipSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaggingFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Tag"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaggingSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ToggleFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Toggle"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ToggleSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<SpexareFullFragment, unknown>;
export const StatisticsFieldsFragmentDoc = {
    "kind": "Document", "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "StatisticsFields"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Statistics"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "spexareCount"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexareCountHistory"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "label"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "count"}
                    }]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "userCount"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "userCountHistory"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "label"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "count"}
                    }]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "spexCount"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexCountHistory"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "label"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "count"}
                    }]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "spexRevivalCount"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexRevivalCountHistory"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "label"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "count"}
                    }]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "taskCount"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskCountHistory"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "label"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "count"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<StatisticsFieldsFragment, unknown>;
export const TagSummaryFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TagSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Tag"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }]
        }
    }]
} as unknown as DocumentNode<TagSummaryFragment, unknown>;
export const TagFullFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TagFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Tag"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TagSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TagSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Tag"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }]
        }
    }]
} as unknown as DocumentNode<TagFullFragment, unknown>;
export const TaskCategorySummaryFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskCategorySummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskCategory"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "actorPresent"}}]
        }
    }]
} as unknown as DocumentNode<TaskCategorySummaryFragment, unknown>;
export const TaskCategoryFullFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskCategoryFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskCategory"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaskCategorySummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskCategorySummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskCategory"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "actorPresent"}}]
        }
    }]
} as unknown as DocumentNode<TaskCategoryFullFragment, unknown>;
export const TaskSummaryFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Task"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "category"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "name"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "actorPresent"}}]
                }
            }]
        }
    }]
} as unknown as DocumentNode<TaskSummaryFragment, unknown>;
export const TaskFullFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Task"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaskSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Task"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "category"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "name"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "actorPresent"}}]
                }
            }]
        }
    }]
} as unknown as DocumentNode<TaskFullFragment, unknown>;
export const UserSummaryFragmentDoc = {
    "kind": "Document", "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "UserSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "User"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "externalId"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "email"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "authorities"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "state"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexare"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "firstName"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "lastName"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "nickName"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<UserSummaryFragment, unknown>;
export const UserFullFragmentDoc = {
    "kind": "Document",
    "definitions": [{
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "UserFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "User"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "UserSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "temporaryPassword"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdAt"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdBy"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedAt"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedBy"}}]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "UserSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "User"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "externalId"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "email"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "authorities"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "state"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexare"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "firstName"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "lastName"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "nickName"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<UserFullFragment, unknown>;
export const JobStatusDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "JobStatus"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "jobStatus"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "JobStatusFields"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "JobStatusFields"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "JobStatus"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "status"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "exitStatus"}
            }]
        }
    }]
} as unknown as DocumentNode<JobStatusQuery, JobStatusQueryVariables>;
export const JobByIdDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "JobById"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "job"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "JobFields"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "JobFields"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Job"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "status"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "exitStatus"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "startedAt"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "finishedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "hasDownload"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "importResult"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "success"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "errors"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "messages"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "data"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<JobByIdQuery, JobByIdQueryVariables>;
export const JobsDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "Jobs"},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "jobs"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "JobFields"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "JobFields"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Job"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "status"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "exitStatus"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "startedAt"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "finishedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "hasDownload"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "importResult"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "success"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "errors"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "messages"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "data"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<JobsQuery, JobsQueryVariables>;
export const JobDeleteDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "JobDelete"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "jobDelete"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<JobDeleteMutation, JobDeleteMutationVariables>;
export const NewsPagedSummaryDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "NewsPagedSummary"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}},
            "type": {"kind": "ListType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "SortDirection"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }],
        "selectionSet": {
            "kind": "SelectionSet", "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "newsPaged"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "first"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "last"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "after"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "before"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "sort"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "direction"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "filter"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "edges"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "cursor"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "node"},
                                "selectionSet": {
                                    "kind": "SelectionSet",
                                    "selections": [{
                                        "kind": "FragmentSpread",
                                        "name": {"kind": "Name", "value": "NewsSummary"}
                                    }]
                                }
                            }]
                        }
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "pageInfo"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasNextPage"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasPreviousPage"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "startCursor"}}, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "endCursor"}
                            }]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "NewsSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "News"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "subject"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "text"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "visibleFrom"}
            }]
        }
    }]
} as unknown as DocumentNode<NewsPagedSummaryQuery, NewsPagedSummaryQueryVariables>;
export const NewsPagedFullDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "NewsPagedFull"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}},
            "type": {"kind": "ListType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "SortDirection"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }],
        "selectionSet": {
            "kind": "SelectionSet", "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "newsPaged"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "first"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "last"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "after"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "before"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "sort"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "direction"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "filter"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "edges"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "cursor"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "node"},
                                "selectionSet": {
                                    "kind": "SelectionSet",
                                    "selections": [{
                                        "kind": "FragmentSpread",
                                        "name": {"kind": "Name", "value": "NewsFull"}
                                    }]
                                }
                            }]
                        }
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "pageInfo"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasNextPage"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasPreviousPage"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "startCursor"}}, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "endCursor"}
                            }]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "NewsSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "News"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "subject"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "text"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "visibleFrom"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "NewsFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "News"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "NewsSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "published"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "visibleTo"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<NewsPagedFullQuery, NewsPagedFullQueryVariables>;
export const NewsCreateDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "NewsCreate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "NewsCreate"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "newsCreate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "input"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "NewsFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "NewsSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "News"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "subject"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "text"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "visibleFrom"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "NewsFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "News"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "NewsSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "published"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "visibleTo"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<NewsCreateMutation, NewsCreateMutationVariables>;
export const NewsUpdateDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "NewsUpdate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "NewsUpdate"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "newsUpdate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "input"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "NewsFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "NewsSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "News"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "subject"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "text"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "visibleFrom"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "NewsFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "News"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "NewsSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "published"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "visibleTo"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<NewsUpdateMutation, NewsUpdateMutationVariables>;
export const NewsDeleteDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "NewsDelete"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "newsDelete"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<NewsDeleteMutation, NewsDeleteMutationVariables>;
export const NewsExportDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "NewsExport"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "ids"}},
            "type": {"kind": "ListType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "type"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ImpexType"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "newsExport"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "ids"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "ids"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "filter"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "type"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "type"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}]
                }
            }]
        }
    }]
} as unknown as DocumentNode<NewsExportQuery, NewsExportQueryVariables>;
export const NewsEventsDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "NewsEvents"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "sourceId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "newsEvents"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "sourceId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "sourceId"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "eventType"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "createdBy"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<NewsEventsQuery, NewsEventsQueryVariables>;
export const CountriesDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "Countries"},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "countries"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "isoCode"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<CountriesQuery, CountriesQueryVariables>;
export const TypesDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "Types"},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "types"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "type"}}]
                }
            }]
        }
    }]
} as unknown as DocumentNode<TypesQuery, TypesQueryVariables>;
export const SpexCategoryPagedSummaryDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "SpexCategoryPagedSummary"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}},
            "type": {"kind": "ListType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "SortDirection"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }],
        "selectionSet": {
            "kind": "SelectionSet", "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexCategoryPaged"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "first"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "last"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "after"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "before"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "sort"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "direction"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "filter"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "edges"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "cursor"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "node"},
                                "selectionSet": {
                                    "kind": "SelectionSet",
                                    "selections": [{
                                        "kind": "FragmentSpread",
                                        "name": {"kind": "Name", "value": "SpexCategorySummary"}
                                    }]
                                }
                            }]
                        }
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "pageInfo"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasNextPage"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasPreviousPage"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "startCursor"}}, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "endCursor"}
                            }]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexCategorySummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexCategory"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "logoUrl"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "firstYear"}
            }]
        }
    }]
} as unknown as DocumentNode<SpexCategoryPagedSummaryQuery, SpexCategoryPagedSummaryQueryVariables>;
export const SpexCategoryPagedFullDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "SpexCategoryPagedFull"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}},
            "type": {"kind": "ListType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "SortDirection"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }],
        "selectionSet": {
            "kind": "SelectionSet", "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexCategoryPaged"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "first"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "last"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "after"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "before"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "sort"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "direction"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "filter"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "edges"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "cursor"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "node"},
                                "selectionSet": {
                                    "kind": "SelectionSet",
                                    "selections": [{
                                        "kind": "FragmentSpread",
                                        "name": {"kind": "Name", "value": "SpexCategoryFull"}
                                    }]
                                }
                            }]
                        }
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "pageInfo"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasNextPage"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasPreviousPage"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "startCursor"}}, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "endCursor"}
                            }]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexCategorySummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexCategory"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "logoUrl"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "firstYear"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexCategoryFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexCategory"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "SpexCategorySummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<SpexCategoryPagedFullQuery, SpexCategoryPagedFullQueryVariables>;
export const SpexCategoryCreateDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "SpexCategoryCreate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexCategoryCreate"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexCategoryCreate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "input"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "SpexCategoryFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexCategorySummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexCategory"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "logoUrl"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "firstYear"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexCategoryFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexCategory"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "SpexCategorySummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<SpexCategoryCreateMutation, SpexCategoryCreateMutationVariables>;
export const SpexCategoryUpdateDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "SpexCategoryUpdate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexCategoryUpdate"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexCategoryUpdate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "input"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "SpexCategoryFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexCategorySummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexCategory"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "logoUrl"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "firstYear"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexCategoryFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexCategory"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "SpexCategorySummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<SpexCategoryUpdateMutation, SpexCategoryUpdateMutationVariables>;
export const SpexCategoryDeleteDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "SpexCategoryDelete"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexCategoryDelete"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<SpexCategoryDeleteMutation, SpexCategoryDeleteMutationVariables>;
export const SpexCategoryExportDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "SpexCategoryExport"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "ids"}},
            "type": {"kind": "ListType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "type"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ImpexType"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexCategoryExport"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "ids"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "ids"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "filter"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "type"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "type"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}]
                }
            }]
        }
    }]
} as unknown as DocumentNode<SpexCategoryExportQuery, SpexCategoryExportQueryVariables>;
export const SpexCategoryEventsDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "SpexCategoryEvents"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "sourceId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexCategoryEvents"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "sourceId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "sourceId"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "eventType"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "createdBy"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<SpexCategoryEventsQuery, SpexCategoryEventsQueryVariables>;
export const SpexPagedSummaryDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "SpexPagedSummary"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}},
            "type": {"kind": "ListType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "SortDirection"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }],
        "selectionSet": {
            "kind": "SelectionSet", "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexPaged"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "first"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "last"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "after"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "before"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "sort"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "direction"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "filter"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "edges"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "cursor"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "node"},
                                "selectionSet": {
                                    "kind": "SelectionSet",
                                    "selections": [{
                                        "kind": "FragmentSpread",
                                        "name": {"kind": "Name", "value": "SpexSummary"}
                                    }]
                                }
                            }]
                        }
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "pageInfo"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasNextPage"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasPreviousPage"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "startCursor"}}, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "endCursor"}
                            }]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spex"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "year"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "title"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "posterUrl"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "revival"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "revivals"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "year"}
                    }]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "category"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "name"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<SpexPagedSummaryQuery, SpexPagedSummaryQueryVariables>;
export const SpexPagedFullDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "SpexPagedFull"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}},
            "type": {"kind": "ListType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "SortDirection"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }],
        "selectionSet": {
            "kind": "SelectionSet", "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexPaged"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "first"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "last"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "after"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "before"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "sort"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "direction"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "filter"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "edges"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "cursor"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "node"},
                                "selectionSet": {
                                    "kind": "SelectionSet",
                                    "selections": [{
                                        "kind": "FragmentSpread",
                                        "name": {"kind": "Name", "value": "SpexFull"}
                                    }]
                                }
                            }]
                        }
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "pageInfo"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasNextPage"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasPreviousPage"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "startCursor"}}, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "endCursor"}
                            }]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spex"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "year"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "title"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "posterUrl"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "revival"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "revivals"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "year"}
                    }]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "category"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "name"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spex"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "SpexSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<SpexPagedFullQuery, SpexPagedFullQueryVariables>;
export const SpexCreateDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "SpexCreate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexCreate"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexCreate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "input"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "SpexFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spex"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "year"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "title"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "posterUrl"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "revival"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "revivals"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "year"}
                    }]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "category"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "name"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spex"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "SpexSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<SpexCreateMutation, SpexCreateMutationVariables>;
export const SpexUpdateDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "SpexUpdate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexUpdate"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexUpdate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "input"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "SpexFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spex"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "year"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "title"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "posterUrl"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "revival"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "revivals"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "year"}
                    }]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "category"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "name"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spex"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "SpexSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<SpexUpdateMutation, SpexUpdateMutationVariables>;
export const SpexDeleteDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "SpexDelete"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexDelete"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<SpexDeleteMutation, SpexDeleteMutationVariables>;
export const SpexExportDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "SpexExport"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "ids"}},
            "type": {"kind": "ListType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "type"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ImpexType"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexExport"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "ids"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "ids"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "filter"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "type"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "type"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}]
                }
            }]
        }
    }]
} as unknown as DocumentNode<SpexExportQuery, SpexExportQueryVariables>;
export const SpexEventsDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "SpexEvents"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "sourceId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexEvents"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "sourceId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "sourceId"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "eventType"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "createdBy"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<SpexEventsQuery, SpexEventsQueryVariables>;
export const SpexCategoryAddDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "SpexCategoryAdd"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "categoryId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexCategoryAdd"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "categoryId"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<SpexCategoryAddMutation, SpexCategoryAddMutationVariables>;
export const SpexCategoryRemoveDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "SpexCategoryRemove"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexCategoryRemove"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<SpexCategoryRemoveMutation, SpexCategoryRemoveMutationVariables>;
export const SpexRevivalCreateDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "SpexRevivalCreate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "year"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Year"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexRevivalCreate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "year"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "year"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "year"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<SpexRevivalCreateMutation, SpexRevivalCreateMutationVariables>;
export const SpexRevivalDeleteDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "SpexRevivalDelete"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexRevivalDelete"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<SpexRevivalDeleteMutation, SpexRevivalDeleteMutationVariables>;
export const ActivityCreateDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "ActivityCreate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "activityCreate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexareId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ActivityFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Activity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spex"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "year"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "title"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "revival"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "name"}}]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "SpexActivityBase"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "task"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "name"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "name"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "actorPresent"}}]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "role"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "vocal"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ActorSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaskActivityBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "actors"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ActorFull"}}]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Activity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ActivityBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexActivity"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "SpexActivityFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskActivities"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "TaskActivityFull"}}]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<ActivityCreateMutation, ActivityCreateMutationVariables>;
export const ActivityDeleteDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "ActivityDelete"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "activityDelete"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexareId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<ActivityDeleteMutation, ActivityDeleteMutationVariables>;
export const SpexActivityCreateDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "SpexActivityCreate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "activityId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexActivityCreate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexareId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "activityId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "activityId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexId"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "SpexActivityFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spex"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "year"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "title"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "revival"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "name"}}]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "SpexActivityBase"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<SpexActivityCreateMutation, SpexActivityCreateMutationVariables>;
export const SpexActivityUpdateDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "SpexActivityUpdate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "activityId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexActivityUpdate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexareId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "activityId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "activityId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "SpexActivityFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spex"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "year"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "title"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "revival"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "name"}}]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "SpexActivityBase"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<SpexActivityUpdateMutation, SpexActivityUpdateMutationVariables>;
export const SpexActivityDeleteDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "SpexActivityDelete"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "activityId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexActivityDelete"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexareId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "activityId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "activityId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<SpexActivityDeleteMutation, SpexActivityDeleteMutationVariables>;
export const ActorCreateDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "ActorCreate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "activityId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "taskActivityId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "vocalId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ActorCreate"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "actorCreate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexareId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "activityId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "activityId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "taskActivityId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "taskActivityId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "vocalId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "vocalId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "input"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ActorFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "role"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "vocal"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ActorSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<ActorCreateMutation, ActorCreateMutationVariables>;
export const ActorUpdateDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "ActorUpdate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "activityId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "taskActivityId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "vocalId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ActorUpdate"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "actorUpdate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexareId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "activityId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "activityId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "taskActivityId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "taskActivityId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "vocalId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "vocalId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "input"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ActorFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "role"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "vocal"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ActorSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<ActorUpdateMutation, ActorUpdateMutationVariables>;
export const ActorDeleteDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "ActorDelete"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "activityId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "taskActivityId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "vocalId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "actorDelete"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexareId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "activityId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "activityId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "taskActivityId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "taskActivityId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "vocalId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "vocalId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<ActorDeleteMutation, ActorDeleteMutationVariables>;
export const TaskActivityCreateDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "TaskActivityCreate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "activityId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "taskId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskActivityCreate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexareId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "activityId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "activityId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "taskId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "taskId"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "TaskActivityFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "task"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "name"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "name"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "actorPresent"}}]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "role"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "vocal"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ActorSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaskActivityBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "actors"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ActorFull"}}]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<TaskActivityCreateMutation, TaskActivityCreateMutationVariables>;
export const TaskActivityUpdateDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "TaskActivityUpdate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "activityId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "taskId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskActivityUpdate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexareId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "activityId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "activityId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "taskId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "taskId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "TaskActivityFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "task"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "name"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "name"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "actorPresent"}}]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "role"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "vocal"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ActorSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaskActivityBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "actors"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ActorFull"}}]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<TaskActivityUpdateMutation, TaskActivityUpdateMutationVariables>;
export const TaskActivityDeleteDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "TaskActivityDelete"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "activityId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskActivityDelete"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexareId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "activityId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "activityId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<TaskActivityDeleteMutation, TaskActivityDeleteMutationVariables>;
export const AddressCreateDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "AddressCreate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "typeId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "AddressCreate"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "addressCreate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexareId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "typeId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "typeId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "input"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "AddressFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "AddressSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Address"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "streetAddress"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "postalCode"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "city"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "country"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "phone"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "phoneMobile"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "emailAddress"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "AddressFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Address"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "AddressSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<AddressCreateMutation, AddressCreateMutationVariables>;
export const AddressUpdateDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "AddressUpdate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "typeId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "AddressUpdate"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "addressUpdate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexareId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "typeId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "typeId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "input"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "AddressFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "AddressSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Address"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "streetAddress"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "postalCode"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "city"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "country"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "phone"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "phoneMobile"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "emailAddress"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "AddressFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Address"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "AddressSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<AddressUpdateMutation, AddressUpdateMutationVariables>;
export const AddressDeleteDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "AddressDelete"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "typeId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "addressDelete"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexareId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "typeId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "typeId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<AddressDeleteMutation, AddressDeleteMutationVariables>;
export const ConsentCreateDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "ConsentCreate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "typeId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ConsentCreate"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "consentCreate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexareId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "typeId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "typeId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "input"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ConsentFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ConsentSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Consent"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "value"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ConsentFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Consent"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ConsentSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<ConsentCreateMutation, ConsentCreateMutationVariables>;
export const ConsentUpdateDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "ConsentUpdate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "typeId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ConsentUpdate"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "consentUpdate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexareId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "typeId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "typeId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "input"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ConsentFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ConsentSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Consent"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "value"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ConsentFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Consent"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ConsentSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<ConsentUpdateMutation, ConsentUpdateMutationVariables>;
export const ConsentDeleteDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "ConsentDelete"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "typeId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "consentDelete"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexareId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "typeId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "typeId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<ConsentDeleteMutation, ConsentDeleteMutationVariables>;
export const MembershipCreateDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "MembershipCreate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "typeId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "MembershipCreate"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "membershipCreate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexareId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "typeId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "typeId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "input"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "MembershipFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "MembershipSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Membership"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "year"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "MembershipFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Membership"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "MembershipSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<MembershipCreateMutation, MembershipCreateMutationVariables>;
export const MembershipDeleteDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "MembershipDelete"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "typeId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "membershipDelete"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexareId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "typeId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "typeId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<MembershipDeleteMutation, MembershipDeleteMutationVariables>;
export const SpexarePagedSummaryDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "SpexarePagedSummary"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}},
            "type": {"kind": "ListType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "SortDirection"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }],
        "selectionSet": {
            "kind": "SelectionSet", "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexarePaged"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "first"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "last"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "after"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "before"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "sort"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "direction"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "filter"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "edges"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "cursor"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "node"},
                                "selectionSet": {
                                    "kind": "SelectionSet",
                                    "selections": [{
                                        "kind": "FragmentSpread",
                                        "name": {"kind": "Name", "value": "SpexareSummary"}
                                    }]
                                }
                            }]
                        }
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "pageInfo"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasNextPage"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasPreviousPage"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "startCursor"}}, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "endCursor"}
                            }]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexareBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spexare"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "firstName"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastName"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "nickName"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "socialSecurityNumber"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "deceased"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "published"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "graduation"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "comment"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "imageUrl"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "partner"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "firstName"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "lastName"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "nickName"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "deceased"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "published"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "imageUrl"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexareSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spexare"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "SpexareBase"}}]
        }
    }]
} as unknown as DocumentNode<SpexarePagedSummaryQuery, SpexarePagedSummaryQueryVariables>;
export const SpexarePagedFullDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "SpexarePagedFull"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}},
            "type": {"kind": "ListType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "SortDirection"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }],
        "selectionSet": {
            "kind": "SelectionSet", "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexarePaged"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "first"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "last"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "after"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "before"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "sort"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "direction"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "filter"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "edges"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "cursor"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "node"},
                                "selectionSet": {
                                    "kind": "SelectionSet",
                                    "selections": [{
                                        "kind": "FragmentSpread",
                                        "name": {"kind": "Name", "value": "SpexareFull"}
                                    }]
                                }
                            }]
                        }
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "pageInfo"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasNextPage"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasPreviousPage"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "startCursor"}}, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "endCursor"}
                            }]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexareBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spexare"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "firstName"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastName"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "nickName"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "socialSecurityNumber"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "deceased"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "published"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "graduation"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "comment"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "imageUrl"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "partner"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "firstName"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "lastName"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "nickName"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "deceased"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "published"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "imageUrl"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Activity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spex"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "year"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "title"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "revival"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "name"}}]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "SpexActivityBase"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "task"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "name"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "name"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "actorPresent"}}]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "role"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "vocal"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ActorSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaskActivityBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "actors"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ActorFull"}}]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Activity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ActivityBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexActivity"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "SpexActivityFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskActivities"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "TaskActivityFull"}}]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "AddressSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Address"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "streetAddress"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "postalCode"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "city"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "country"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "phone"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "phoneMobile"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "emailAddress"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "AddressFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Address"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "AddressSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ConsentSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Consent"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "value"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ConsentFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Consent"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ConsentSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "MembershipSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Membership"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "year"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "MembershipFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Membership"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "MembershipSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaggingSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Tag"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaggingFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Tag"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaggingSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ToggleSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Toggle"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "value"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ToggleFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Toggle"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ToggleSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexareFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spexare"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "SpexareBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "activities"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ActivityFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "addresses"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "AddressFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "consents"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ConsentFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "memberships"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "MembershipFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "taggings"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "TaggingFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "toggles"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ToggleFull"}}]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<SpexarePagedFullQuery, SpexarePagedFullQueryVariables>;
export const SpexareCreateDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "SpexareCreate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexareCreate"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexareCreate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "input"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "SpexareFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexareBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spexare"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "firstName"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastName"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "nickName"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "socialSecurityNumber"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "deceased"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "published"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "graduation"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "comment"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "imageUrl"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "partner"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "firstName"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "lastName"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "nickName"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "deceased"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "published"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "imageUrl"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Activity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spex"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "year"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "title"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "revival"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "name"}}]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "SpexActivityBase"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "task"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "name"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "name"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "actorPresent"}}]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "role"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "vocal"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ActorSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaskActivityBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "actors"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ActorFull"}}]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Activity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ActivityBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexActivity"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "SpexActivityFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskActivities"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "TaskActivityFull"}}]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "AddressSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Address"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "streetAddress"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "postalCode"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "city"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "country"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "phone"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "phoneMobile"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "emailAddress"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "AddressFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Address"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "AddressSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ConsentSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Consent"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "value"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ConsentFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Consent"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ConsentSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "MembershipSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Membership"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "year"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "MembershipFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Membership"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "MembershipSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaggingSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Tag"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaggingFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Tag"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaggingSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ToggleSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Toggle"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "value"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ToggleFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Toggle"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ToggleSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexareFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spexare"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "SpexareBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "activities"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ActivityFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "addresses"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "AddressFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "consents"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ConsentFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "memberships"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "MembershipFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "taggings"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "TaggingFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "toggles"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ToggleFull"}}]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<SpexareCreateMutation, SpexareCreateMutationVariables>;
export const SpexareUpdateDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "SpexareUpdate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexareUpdate"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexareUpdate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "input"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "SpexareFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexareBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spexare"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "firstName"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastName"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "nickName"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "socialSecurityNumber"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "deceased"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "published"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "graduation"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "comment"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "imageUrl"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "partner"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "firstName"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "lastName"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "nickName"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "deceased"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "published"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "imageUrl"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Activity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spex"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "year"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "title"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "revival"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "name"}}]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "SpexActivityBase"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "task"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "name"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "name"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "actorPresent"}}]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "role"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "vocal"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ActorSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaskActivityBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "actors"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ActorFull"}}]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Activity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ActivityBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexActivity"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "SpexActivityFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskActivities"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "TaskActivityFull"}}]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "AddressSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Address"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "streetAddress"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "postalCode"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "city"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "country"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "phone"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "phoneMobile"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "emailAddress"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "AddressFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Address"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "AddressSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ConsentSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Consent"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "value"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ConsentFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Consent"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ConsentSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "MembershipSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Membership"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "year"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "MembershipFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Membership"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "MembershipSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaggingSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Tag"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaggingFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Tag"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaggingSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ToggleSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Toggle"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "value"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ToggleFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Toggle"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ToggleSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexareFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spexare"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "SpexareBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "activities"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ActivityFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "addresses"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "AddressFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "consents"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ConsentFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "memberships"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "MembershipFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "taggings"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "TaggingFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "toggles"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ToggleFull"}}]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<SpexareUpdateMutation, SpexareUpdateMutationVariables>;
export const SpexareDeleteDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "SpexareDelete"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexareDelete"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<SpexareDeleteMutation, SpexareDeleteMutationVariables>;
export const SpexareEventsDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "SpexareEvents"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "sourceId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexareEvents"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "sourceId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "sourceId"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "eventType"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "createdBy"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<SpexareEventsQuery, SpexareEventsQueryVariables>;
export const SpexareGetDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "SpexareGet"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexare"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "SpexareFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexareBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spexare"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "firstName"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastName"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "nickName"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "socialSecurityNumber"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "deceased"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "published"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "graduation"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "comment"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "imageUrl"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "partner"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "firstName"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "lastName"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "nickName"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "deceased"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "published"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "imageUrl"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Activity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spex"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "year"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "title"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "revival"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "name"}}]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "SpexActivityBase"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "task"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "name"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "name"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "actorPresent"}}]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "role"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "vocal"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ActorSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaskActivityBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "actors"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ActorFull"}}]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Activity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ActivityBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexActivity"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "SpexActivityFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskActivities"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "TaskActivityFull"}}]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "AddressSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Address"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "streetAddress"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "postalCode"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "city"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "country"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "phone"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "phoneMobile"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "emailAddress"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "AddressFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Address"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "AddressSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ConsentSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Consent"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "value"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ConsentFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Consent"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ConsentSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "MembershipSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Membership"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "year"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "MembershipFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Membership"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "MembershipSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaggingSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Tag"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaggingFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Tag"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaggingSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ToggleSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Toggle"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "value"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ToggleFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Toggle"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ToggleSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexareFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spexare"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "SpexareBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "activities"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ActivityFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "addresses"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "AddressFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "consents"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ConsentFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "memberships"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "MembershipFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "taggings"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "TaggingFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "toggles"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ToggleFull"}}]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<SpexareGetQuery, SpexareGetQueryVariables>;
export const SpexarePartnerAddDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "SpexarePartnerAdd"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexarePartnerAdd"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexareId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<SpexarePartnerAddMutation, SpexarePartnerAddMutationVariables>;
export const SpexarePartnerRemoveDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "SpexarePartnerRemove"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexarePartnerRemove"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexareId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<SpexarePartnerRemoveMutation, SpexarePartnerRemoveMutationVariables>;
export const SpexareExportDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "SpexareExport"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "ids"}},
            "type": {"kind": "ListType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "type"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ImpexType"}}
            }
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "reportType"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ReportType"}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexareExport"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "ids"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "ids"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "filter"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "type"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "type"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "reportType"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "reportType"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}]
                }
            }]
        }
    }]
} as unknown as DocumentNode<SpexareExportQuery, SpexareExportQueryVariables>;
export const SpexareSearchDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "SpexareSearch"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "q"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "aggregationFilters"}},
            "type": {
                "kind": "ListType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "AggregationFilterInput"}}
            }
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "limit"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "offset"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}},
            "type": {"kind": "ListType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "SortDirection"}}
        }],
        "selectionSet": {
            "kind": "SelectionSet", "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexareSearchPaged"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "q"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "q"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "aggregationFilters"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "aggregationFilters"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "limit"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "limit"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "offset"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "offset"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "sort"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "direction"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "edges"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "cursor"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "node"},
                                "selectionSet": {
                                    "kind": "SelectionSet",
                                    "selections": [{
                                        "kind": "FragmentSpread",
                                        "name": {"kind": "Name", "value": "SpexareSummary"}
                                    }]
                                }
                            }]
                        }
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "facets"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "label"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "groups"},
                                "selectionSet": {
                                    "kind": "SelectionSet",
                                    "selections": [{
                                        "kind": "Field",
                                        "name": {"kind": "Name", "value": "id"}
                                    }, {"kind": "Field", "name": {"kind": "Name", "value": "label"}}, {
                                        "kind": "Field",
                                        "name": {"kind": "Name", "value": "values"},
                                        "selectionSet": {
                                            "kind": "SelectionSet",
                                            "selections": [{
                                                "kind": "Field",
                                                "name": {"kind": "Name", "value": "id"}
                                            }, {
                                                "kind": "Field",
                                                "name": {"kind": "Name", "value": "label"}
                                            }, {"kind": "Field", "name": {"kind": "Name", "value": "count"}}]
                                        }
                                    }]
                                }
                            }]
                        }
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "pageInfo"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasNextPage"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasPreviousPage"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "startCursor"}}, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "endCursor"}
                            }]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexareBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spexare"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "firstName"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastName"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "nickName"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "socialSecurityNumber"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "deceased"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "published"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "graduation"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "comment"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "imageUrl"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "partner"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "firstName"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "lastName"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "nickName"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "deceased"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "published"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "imageUrl"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexareSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spexare"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "SpexareBase"}}]
        }
    }]
} as unknown as DocumentNode<SpexareSearchQuery, SpexareSearchQueryVariables>;
export const TaggingCreateDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "TaggingCreate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "tagId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "taggingCreate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexareId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "tagId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "tagId"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<TaggingCreateMutation, TaggingCreateMutationVariables>;
export const TaggingDeleteDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "TaggingDelete"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "tagId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "taggingDelete"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexareId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "tagId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "tagId"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<TaggingDeleteMutation, TaggingDeleteMutationVariables>;
export const ToggleCreateDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "ToggleCreate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "typeId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ToggleCreate"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "toggleCreate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexareId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "typeId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "typeId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "input"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ToggleFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ToggleSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Toggle"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "value"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ToggleFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Toggle"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ToggleSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<ToggleCreateMutation, ToggleCreateMutationVariables>;
export const ToggleUpdateDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "ToggleUpdate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "typeId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ToggleUpdate"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "toggleUpdate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexareId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "typeId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "typeId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "input"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ToggleFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ToggleSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Toggle"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "value"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ToggleFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Toggle"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ToggleSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<ToggleUpdateMutation, ToggleUpdateMutationVariables>;
export const ToggleDeleteDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "ToggleDelete"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "typeId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "toggleDelete"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "spexareId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "spexareId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "typeId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "typeId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<ToggleDeleteMutation, ToggleDeleteMutationVariables>;
export const StatisticsDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "Statistics"},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "statistics"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "StatisticsFields"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "StatisticsFields"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Statistics"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "spexareCount"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexareCountHistory"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "label"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "count"}
                    }]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "userCount"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "userCountHistory"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "label"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "count"}
                    }]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "spexCount"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexCountHistory"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "label"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "count"}
                    }]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "spexRevivalCount"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexRevivalCountHistory"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "label"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "count"}
                    }]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "taskCount"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskCountHistory"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "label"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "count"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<StatisticsQuery, StatisticsQueryVariables>;
export const TagPagedSummaryDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "TagPagedSummary"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}},
            "type": {"kind": "ListType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "SortDirection"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }],
        "selectionSet": {
            "kind": "SelectionSet", "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "tagPaged"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "first"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "last"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "after"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "before"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "sort"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "direction"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "filter"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "edges"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "cursor"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "node"},
                                "selectionSet": {
                                    "kind": "SelectionSet",
                                    "selections": [{
                                        "kind": "FragmentSpread",
                                        "name": {"kind": "Name", "value": "TagSummary"}
                                    }]
                                }
                            }]
                        }
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "pageInfo"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasNextPage"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasPreviousPage"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "startCursor"}}, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "endCursor"}
                            }]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TagSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Tag"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }]
        }
    }]
} as unknown as DocumentNode<TagPagedSummaryQuery, TagPagedSummaryQueryVariables>;
export const TagPagedFullDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "TagPagedFull"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}},
            "type": {"kind": "ListType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "SortDirection"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }],
        "selectionSet": {
            "kind": "SelectionSet", "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "tagPaged"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "first"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "last"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "after"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "before"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "sort"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "direction"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "filter"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "edges"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "cursor"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "node"},
                                "selectionSet": {
                                    "kind": "SelectionSet",
                                    "selections": [{
                                        "kind": "FragmentSpread",
                                        "name": {"kind": "Name", "value": "TagFull"}
                                    }]
                                }
                            }]
                        }
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "pageInfo"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasNextPage"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasPreviousPage"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "startCursor"}}, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "endCursor"}
                            }]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TagSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Tag"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TagFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Tag"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TagSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<TagPagedFullQuery, TagPagedFullQueryVariables>;
export const TagCreateDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "TagCreate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "TagCreate"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "tagCreate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "input"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "TagFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TagSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Tag"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TagFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Tag"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TagSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<TagCreateMutation, TagCreateMutationVariables>;
export const TagUpdateDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "TagUpdate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "TagUpdate"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "tagUpdate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "input"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "TagFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TagSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Tag"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TagFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Tag"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TagSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<TagUpdateMutation, TagUpdateMutationVariables>;
export const TagDeleteDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "TagDelete"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "tagDelete"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<TagDeleteMutation, TagDeleteMutationVariables>;
export const TagExportDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "TagExport"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "ids"}},
            "type": {"kind": "ListType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "type"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ImpexType"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "tagExport"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "ids"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "ids"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "filter"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "type"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "type"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}]
                }
            }]
        }
    }]
} as unknown as DocumentNode<TagExportQuery, TagExportQueryVariables>;
export const TagEventsDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "TagEvents"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "sourceId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "tagEvents"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "sourceId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "sourceId"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "eventType"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "createdBy"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<TagEventsQuery, TagEventsQueryVariables>;
export const TaskCategoryPagedSummaryDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "TaskCategoryPagedSummary"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}},
            "type": {"kind": "ListType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "SortDirection"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }],
        "selectionSet": {
            "kind": "SelectionSet", "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskCategoryPaged"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "first"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "last"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "after"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "before"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "sort"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "direction"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "filter"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "edges"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "cursor"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "node"},
                                "selectionSet": {
                                    "kind": "SelectionSet",
                                    "selections": [{
                                        "kind": "FragmentSpread",
                                        "name": {"kind": "Name", "value": "TaskCategorySummary"}
                                    }]
                                }
                            }]
                        }
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "pageInfo"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasNextPage"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasPreviousPage"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "startCursor"}}, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "endCursor"}
                            }]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskCategorySummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskCategory"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "actorPresent"}}]
        }
    }]
} as unknown as DocumentNode<TaskCategoryPagedSummaryQuery, TaskCategoryPagedSummaryQueryVariables>;
export const TaskCategoryPagedFullDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "TaskCategoryPagedFull"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}},
            "type": {"kind": "ListType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "SortDirection"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }],
        "selectionSet": {
            "kind": "SelectionSet", "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskCategoryPaged"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "first"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "last"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "after"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "before"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "sort"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "direction"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "filter"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "edges"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "cursor"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "node"},
                                "selectionSet": {
                                    "kind": "SelectionSet",
                                    "selections": [{
                                        "kind": "FragmentSpread",
                                        "name": {"kind": "Name", "value": "TaskCategoryFull"}
                                    }]
                                }
                            }]
                        }
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "pageInfo"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasNextPage"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasPreviousPage"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "startCursor"}}, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "endCursor"}
                            }]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskCategorySummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskCategory"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "actorPresent"}}]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskCategoryFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskCategory"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaskCategorySummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<TaskCategoryPagedFullQuery, TaskCategoryPagedFullQueryVariables>;
export const TaskCategoryCreateDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "TaskCategoryCreate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskCategoryCreate"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskCategoryCreate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "input"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "TaskCategoryFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskCategorySummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskCategory"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "actorPresent"}}]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskCategoryFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskCategory"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaskCategorySummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<TaskCategoryCreateMutation, TaskCategoryCreateMutationVariables>;
export const TaskCategoryUpdateDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "TaskCategoryUpdate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskCategoryUpdate"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskCategoryUpdate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "input"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "TaskCategoryFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskCategorySummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskCategory"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "actorPresent"}}]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskCategoryFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskCategory"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaskCategorySummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<TaskCategoryUpdateMutation, TaskCategoryUpdateMutationVariables>;
export const TaskCategoryDeleteDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "TaskCategoryDelete"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskCategoryDelete"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<TaskCategoryDeleteMutation, TaskCategoryDeleteMutationVariables>;
export const TaskCategoryExportDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "TaskCategoryExport"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "ids"}},
            "type": {"kind": "ListType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "type"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ImpexType"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskCategoryExport"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "ids"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "ids"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "filter"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "type"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "type"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}]
                }
            }]
        }
    }]
} as unknown as DocumentNode<TaskCategoryExportQuery, TaskCategoryExportQueryVariables>;
export const TaskCategoryEventsDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "TaskCategoryEvents"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "sourceId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskCategoryEvents"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "sourceId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "sourceId"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "eventType"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "createdBy"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<TaskCategoryEventsQuery, TaskCategoryEventsQueryVariables>;
export const TaskPagedSummaryDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "TaskPagedSummary"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}},
            "type": {"kind": "ListType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "SortDirection"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }],
        "selectionSet": {
            "kind": "SelectionSet", "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskPaged"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "first"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "last"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "after"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "before"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "sort"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "direction"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "filter"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "edges"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "cursor"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "node"},
                                "selectionSet": {
                                    "kind": "SelectionSet",
                                    "selections": [{
                                        "kind": "FragmentSpread",
                                        "name": {"kind": "Name", "value": "TaskSummary"}
                                    }]
                                }
                            }]
                        }
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "pageInfo"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasNextPage"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasPreviousPage"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "startCursor"}}, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "endCursor"}
                            }]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Task"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "category"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "name"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "actorPresent"}}]
                }
            }]
        }
    }]
} as unknown as DocumentNode<TaskPagedSummaryQuery, TaskPagedSummaryQueryVariables>;
export const TaskPagedFullDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "TaskPagedFull"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}},
            "type": {"kind": "ListType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "SortDirection"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }],
        "selectionSet": {
            "kind": "SelectionSet", "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskPaged"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "first"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "last"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "after"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "before"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "sort"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "direction"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "filter"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "edges"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "cursor"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "node"},
                                "selectionSet": {
                                    "kind": "SelectionSet",
                                    "selections": [{
                                        "kind": "FragmentSpread",
                                        "name": {"kind": "Name", "value": "TaskFull"}
                                    }]
                                }
                            }]
                        }
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "pageInfo"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasNextPage"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasPreviousPage"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "startCursor"}}, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "endCursor"}
                            }]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Task"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "category"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "name"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "actorPresent"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Task"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaskSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<TaskPagedFullQuery, TaskPagedFullQueryVariables>;
export const TaskCreateDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "TaskCreate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskCreate"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskCreate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "input"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "TaskFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Task"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "category"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "name"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "actorPresent"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Task"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaskSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<TaskCreateMutation, TaskCreateMutationVariables>;
export const TaskUpdateDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "TaskUpdate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskUpdate"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskUpdate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "input"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "TaskFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Task"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "category"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "name"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "actorPresent"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Task"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaskSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<TaskUpdateMutation, TaskUpdateMutationVariables>;
export const TaskDeleteDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "TaskDelete"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskDelete"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<TaskDeleteMutation, TaskDeleteMutationVariables>;
export const TaskExportDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "TaskExport"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "ids"}},
            "type": {"kind": "ListType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "type"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ImpexType"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskExport"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "ids"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "ids"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "filter"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "type"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "type"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}]
                }
            }]
        }
    }]
} as unknown as DocumentNode<TaskExportQuery, TaskExportQueryVariables>;
export const TaskEventsDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "TaskEvents"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "sourceId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskEvents"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "sourceId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "sourceId"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "eventType"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "createdBy"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<TaskEventsQuery, TaskEventsQueryVariables>;
export const TaskCategoryAddDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "TaskCategoryAdd"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "categoryId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskCategoryAdd"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "taskId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "categoryId"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<TaskCategoryAddMutation, TaskCategoryAddMutationVariables>;
export const TaskCategoryRemoveDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "TaskCategoryRemove"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskCategoryRemove"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "taskId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<TaskCategoryRemoveMutation, TaskCategoryRemoveMutationVariables>;
export const UserPagedSummaryDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "UserPagedSummary"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}},
            "type": {"kind": "ListType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "SortDirection"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }],
        "selectionSet": {
            "kind": "SelectionSet", "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "userPaged"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "first"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "last"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "after"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "before"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "sort"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "direction"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "filter"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "edges"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "cursor"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "node"},
                                "selectionSet": {
                                    "kind": "SelectionSet",
                                    "selections": [{
                                        "kind": "FragmentSpread",
                                        "name": {"kind": "Name", "value": "UserSummary"}
                                    }]
                                }
                            }]
                        }
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "pageInfo"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasNextPage"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasPreviousPage"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "startCursor"}}, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "endCursor"}
                            }]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "UserSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "User"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "externalId"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "email"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "authorities"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "state"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexare"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "firstName"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "lastName"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "nickName"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<UserPagedSummaryQuery, UserPagedSummaryQueryVariables>;
export const UserPagedFullDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "UserPagedFull"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}},
            "type": {"kind": "ListType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "SortDirection"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }],
        "selectionSet": {
            "kind": "SelectionSet", "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "userPaged"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "first"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "first"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "last"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "last"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "after"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "before"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "sort"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "sort"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "direction"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "direction"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "filter"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "edges"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "cursor"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "node"},
                                "selectionSet": {
                                    "kind": "SelectionSet",
                                    "selections": [{
                                        "kind": "FragmentSpread",
                                        "name": {"kind": "Name", "value": "UserFull"}
                                    }]
                                }
                            }]
                        }
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "pageInfo"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasNextPage"}
                            }, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "hasPreviousPage"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "startCursor"}}, {
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "endCursor"}
                            }]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "UserSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "User"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "externalId"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "email"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "authorities"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "state"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexare"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "firstName"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "lastName"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "nickName"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "UserFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "User"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "UserSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "temporaryPassword"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdAt"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdBy"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedAt"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedBy"}}]
        }
    }]
} as unknown as DocumentNode<UserPagedFullQuery, UserPagedFullQueryVariables>;
export const UserCreateDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "UserCreate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "UserCreate"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "userCreate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "input"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "UserFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "UserSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "User"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "externalId"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "email"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "authorities"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "state"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexare"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "firstName"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "lastName"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "nickName"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "UserFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "User"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "UserSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "temporaryPassword"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdAt"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdBy"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedAt"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedBy"}}]
        }
    }]
} as unknown as DocumentNode<UserCreateMutation, UserCreateMutationVariables>;
export const UserUpdateDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "UserUpdate"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "UserUpdate"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "userUpdate"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "input"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "input"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "UserFull"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "UserSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "User"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "externalId"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "email"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "authorities"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "state"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexare"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "firstName"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "lastName"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "nickName"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "UserFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "User"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "UserSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "temporaryPassword"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdAt"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdBy"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedAt"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedBy"}}]
        }
    }]
} as unknown as DocumentNode<UserUpdateMutation, UserUpdateMutationVariables>;
export const UserDeleteDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "UserDelete"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "userDelete"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<UserDeleteMutation, UserDeleteMutationVariables>;
export const UserExportDocument = {
    "kind": "Document", "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "UserExport"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "ids"}},
            "type": {"kind": "ListType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}},
            "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "type"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ImpexType"}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "userExport"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "ids"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "ids"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "filter"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "filter"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "type"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "type"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}]
                }
            }]
        }
    }]
} as unknown as DocumentNode<UserExportQuery, UserExportQueryVariables>;
export const UserEventsDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "UserEvents"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "sourceId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "userEvents"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "sourceId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "sourceId"}}
                }],
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "eventType"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "createdBy"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<UserEventsQuery, UserEventsQueryVariables>;
export const UserAuthoritiesAddDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "UserAuthoritiesAdd"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "userId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "ids"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "ListType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "userAuthoritiesAdd"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "userId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "userId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "ids"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "ids"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<UserAuthoritiesAddMutation, UserAuthoritiesAddMutationVariables>;
export const UserAuthoritiesRemoveDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "UserAuthoritiesRemove"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "userId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "ids"}},
            "type": {
                "kind": "NonNullType",
                "type": {"kind": "ListType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
            }
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "userAuthoritiesRemove"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "userId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "userId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "ids"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "ids"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<UserAuthoritiesRemoveMutation, UserAuthoritiesRemoveMutationVariables>;
export const UserStateSetDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "UserStateSet"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "userId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "userStateSet"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "userId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "userId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<UserStateSetMutation, UserStateSetMutationVariables>;
export const UserSpexareAddDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "UserSpexareAdd"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "userId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }, {
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "userSpexareAdd"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "userId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "userId"}}
                }, {
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "id"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<UserSpexareAddMutation, UserSpexareAddMutationVariables>;
export const UserSpexareRemoveDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "mutation",
        "name": {"kind": "Name", "value": "UserSpexareRemove"},
        "variableDefinitions": [{
            "kind": "VariableDefinition",
            "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "userId"}},
            "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
        }],
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "userSpexareRemove"},
                "arguments": [{
                    "kind": "Argument",
                    "name": {"kind": "Name", "value": "userId"},
                    "value": {"kind": "Variable", "name": {"kind": "Name", "value": "userId"}}
                }]
            }]
        }
    }]
} as unknown as DocumentNode<UserSpexareRemoveMutation, UserSpexareRemoveMutationVariables>;
export const UserMeDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "UserMe"},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "me"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "spexare"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "SpexareFull"}}]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexareBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spexare"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "firstName"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastName"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "nickName"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "socialSecurityNumber"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "deceased"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "published"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "graduation"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "comment"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "imageUrl"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "partner"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "firstName"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "lastName"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "nickName"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "deceased"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "published"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "imageUrl"}}]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Activity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spex"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "year"}
                    }, {"kind": "Field", "name": {"kind": "Name", "value": "title"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "revival"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "name"}}]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "SpexActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "SpexActivityBase"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskActivityBase"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "task"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "name"}
                    }, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "category"},
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [{
                                "kind": "Field",
                                "name": {"kind": "Name", "value": "name"}
                            }, {"kind": "Field", "name": {"kind": "Name", "value": "actorPresent"}}]
                        }
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "role"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "vocal"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActorFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Actor"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ActorSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaskActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "TaskActivity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaskActivityBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "actors"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ActorFull"}}]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ActivityFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Activity"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ActivityBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "spexActivity"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "SpexActivityFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "taskActivities"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "TaskActivityFull"}}]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "AddressSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Address"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "streetAddress"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "postalCode"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "city"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "country"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "phone"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "phoneMobile"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "emailAddress"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "AddressFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Address"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "AddressSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ConsentSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Consent"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "value"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ConsentFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Consent"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ConsentSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "MembershipSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Membership"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "year"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "MembershipFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Membership"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "MembershipSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaggingSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Tag"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "name"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "TaggingFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Tag"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "TaggingSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ToggleSummary"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Toggle"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "value"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "type"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "ToggleFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Toggle"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "ToggleSummary"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }, {
        "kind": "FragmentDefinition",
        "name": {"kind": "Name", "value": "SpexareFull"},
        "typeCondition": {"kind": "NamedType", "name": {"kind": "Name", "value": "Spexare"}},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "FragmentSpread",
                "name": {"kind": "Name", "value": "SpexareBase"}
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "activities"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ActivityFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "addresses"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "AddressFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "consents"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ConsentFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "memberships"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "MembershipFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "taggings"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "TaggingFull"}}]
                }
            }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "toggles"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "FragmentSpread", "name": {"kind": "Name", "value": "ToggleFull"}}]
                }
            }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "createdBy"}
            }, {"kind": "Field", "name": {"kind": "Name", "value": "lastModifiedAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "lastModifiedBy"}
            }]
        }
    }]
} as unknown as DocumentNode<UserMeQuery, UserMeQueryVariables>;
export const AuthoritiesDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "Authorities"},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "authorities"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<AuthoritiesQuery, AuthoritiesQueryVariables>;
export const StatesDocument = {
    "kind": "Document",
    "definitions": [{
        "kind": "OperationDefinition",
        "operation": "query",
        "name": {"kind": "Name", "value": "States"},
        "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
                "kind": "Field",
                "name": {"kind": "Name", "value": "states"},
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                        "kind": "Field",
                        "name": {"kind": "Name", "value": "label"}
                    }]
                }
            }]
        }
    }]
} as unknown as DocumentNode<StatesQuery, StatesQueryVariables>;