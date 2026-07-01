import 'server-only';

import {SortDirection, Task, TaskCreate, TaskEdge, TaskUpdate} from "@/gql/graphql";
import {createResourceClient, runMutationField} from "@/lib/graphql.server";

const SummaryFields = `
    id
    name
    category {
      id
      name
      actorPresent
    }
`;

const FullFields = `
    ${SummaryFields}
    createdAt
    createdBy
    lastModifiedAt
    lastModifiedBy
`;

const client = createResourceClient<Task, TaskEdge, TaskCreate, TaskUpdate>({
    singular: 'task',
    createInputType: 'TaskCreate',
    updateInputType: 'TaskUpdate',
    summaryFields: SummaryFields,
    fullFields: FullFields,
    cacheTag: 'task',
    restPath: 'tasks',
    defaultSort: ['name'],
    defaultDirection: SortDirection.Asc,
    defaultFilter: '',
});

export const {getPaged, getAll, create, update, del, exp, imp, events} = client;

const AddCategoryMutation = /* GraphQL */ `
    mutation ($id: ID!, $categoryId: ID!) {
        taskCategoryAdd(taskId: $id, id: $categoryId)
    }
`;

const RemoveCategoryMutation = /* GraphQL */ `
    mutation ($id: ID!) {
        taskCategoryRemove(taskId: $id)
    }
`;

export async function addCategory(id: string, categoryId: string) {
    return runMutationField(AddCategoryMutation, {id, categoryId}, 'taskCategoryAdd');
}

export async function removeCategory(id: string) {
    return runMutationField(RemoveCategoryMutation, {id}, 'taskCategoryRemove');
}
