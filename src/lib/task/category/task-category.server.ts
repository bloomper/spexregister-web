import 'server-only';

import {SortDirection, TaskCategory, TaskCategoryCreate, TaskCategoryEdge, TaskCategoryUpdate} from "@/gql/graphql";
import {createResourceClient} from "@/lib/graphql.server";

const SummaryFields = `
    id
    name
    actorPresent
`;

const FullFields = `
    ${SummaryFields}
    createdAt
    createdBy
    lastModifiedAt
    lastModifiedBy
`;

const client = createResourceClient<TaskCategory, TaskCategoryEdge, TaskCategoryCreate, TaskCategoryUpdate>({
    singular: 'taskCategory',
    createInputType: 'TaskCategoryCreate',
    updateInputType: 'TaskCategoryUpdate',
    summaryFields: SummaryFields,
    fullFields: FullFields,
    cacheTag: 'task-category',
    restPath: 'tasks/categories',
    defaultSort: ['name'],
    defaultDirection: SortDirection.Asc,
    defaultFilter: '',
});

export const {getPaged, getAll, create, update, del, exp, imp, events} = client;
