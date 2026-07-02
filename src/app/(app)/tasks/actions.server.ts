"use server";

import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";
import {
    addCategory,
    create,
    del,
    events,
    exp,
    getAll as getAllTasks,
    getPaged,
    removeCategory,
    taskFormSchema,
    update
} from "@/lib/task";
import {revalidateTag} from "next/cache";
import {ImpexType, SortDirection} from "@/gql/schema";
import {getAll as getAllTaskCategories} from "@/lib/task/category";
import {imp} from "@/lib/task";

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

export async function getAllAction() {
    return withPolicyAction(Policies.task.requireRead, async () => {
        return getAllTasks();
    });
}

export async function createAction(data: unknown) {
    return withPolicyAction(Policies.task.requireCreate, async () => {
        const validated = taskFormSchema.parse(data);
        const {categoryId, ...createInput} = validated;
        void categoryId;
        const result = await create(createInput);
        revalidate();
        return result;
    });
}

export async function updateAction(id: string, data: unknown) {
    return withPolicyAction(Policies.task.requireUpdate, async () => {
        const validated = taskFormSchema.parse(data);
        const {categoryId, ...updateInput} = validated;
        void categoryId;
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

export async function exportAction(ids: string[] | null, filter: string | null, type: ImpexType) {
    return withPolicyAction(Policies.task.requireExport, async () => {
        return await exp(ids, filter, type);
    });
}

export async function importAction(type: ImpexType, file: File) {
    return withPolicyAction(Policies.task.requireImport, async () => {
        const result = await imp(type, file);
        revalidate();
        return result;
    });
}

export async function getAllCategoriesAction() {
    return withPolicyAction(Policies.taskCategory.requireRead, async () => {
        return getAllTaskCategories();
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

export async function getEventsAction(id: string) {
    return withPolicyAction(Policies.task.requireRead, async () => {
        return events(id);
    });
}

function revalidate() {
    revalidateTag('task', 'max');
}
