"use server";

import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";
import {addCategory, create, del, getPaged, removeCategory, taskFormSchema, update} from "@/lib/task";
import {revalidateTag} from "next/cache";
import {SortDirection} from "@/gql/graphql";
import {getAll} from "@/lib/task/category";

export async function getPageAction(args: {
    first?: number;
    last?: number;
    after?: string | null;
    before?: string | null;
    sort?: string[];
    direction?: SortDirection;
    filter?: string;
    full?: boolean | string;
}) {
    return withPolicyAction(Policies.task.requireRead, async () => {
        return getPaged({
            ...args,
            full: args.full === true || args.full === "true"
        });
    });
}

export async function createAction(data: unknown) {
    return withPolicyAction(Policies.task.requireCreate, async () => {
        const validated = taskFormSchema.parse(data);
        const {categoryId, ...createInput} = validated;
        const result = await create(createInput);
        revalidate();
        return result;
    });
}

export async function updateAction(id: string, data: unknown) {
    return withPolicyAction(Policies.task.requireUpdate, async () => {
        const validated = taskFormSchema.parse(data);
        const {categoryId, ...updateInput} = validated;
        const result = await update(id, updateInput);
        revalidate();
        return result;
    });
}

export async function deleteAction(id: string) {
    return withPolicyAction(Policies.task.requireDelete, async () => {
        const result = await del(id);
        revalidate();
        return result;
    });
}

export async function bulkDeleteAction(ids: string[]) {
    await withPolicyAction(Policies.task.requireDelete, async () => {
        await Promise.all(ids.map(id => del(id)));
        revalidate();
    });
}

export async function getAllCategoriesAction() {
    return withPolicyAction(Policies.taskCategory.requireRead, async () => {
        return getAll();
    });
}

export async function addCategoryAction(id: string, categoryId: string) {
    return withPolicyAction(Policies.task.requireCreate, async () => {
        const result = await addCategory(id, categoryId);
        revalidate();
        return result;
    });
}

export async function removeCategoryAction(id: string) {
    return withPolicyAction(Policies.task.requireCreate, async () => {
        const result = await removeCategory(id);
        revalidate();
        return result;
    });
}

function revalidate() {
    revalidateTag('task', 'max');
}
