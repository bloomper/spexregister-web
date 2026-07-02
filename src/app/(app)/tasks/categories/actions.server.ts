"use server";

import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";
import {create, del, events, exp, getPaged, imp, taskCategoryFormSchema, update} from "@/lib/task/category";
import {revalidateTag} from "next/cache";
import {ImpexType, SortDirection} from "@/gql/schema";

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
    return withPolicyAction(Policies.taskCategory.requireRead, async () => {
        return getPaged({
            ...args,
            full: args.full === true || args.full === "true"
        });
    });
}

export async function createAction(data: unknown) {
    return withPolicyAction(Policies.taskCategory.requireCreate, async () => {
        const validated = taskCategoryFormSchema.parse(data);
        const result = await create(validated);
        revalidate();
        return result;
    });
}

export async function updateAction(id: string, data: unknown) {
    return withPolicyAction(Policies.taskCategory.requireUpdate, async () => {
        const validated = taskCategoryFormSchema.parse(data);
        const result = await update(id, validated);
        revalidate();
        return result;
    });
}

export async function deleteAction(id: string) {
    return withPolicyAction(Policies.taskCategory.requireDelete, async () => {
        const result = await del(id);
        revalidate();
        return result;
    });
}

export async function bulkDeleteAction(ids: string[]) {
    await withPolicyAction(Policies.taskCategory.requireDelete, async () => {
        await Promise.all(ids.map(id => del(id)));
        revalidate();
    });
}

export async function exportAction(ids: string[] | null, filter: string | null, type: ImpexType) {
    return withPolicyAction(Policies.taskCategory.requireExport, async () => {
        return await exp(ids, filter, type);
    });
}

export async function importAction(type: ImpexType, file: File) {
    return withPolicyAction(Policies.taskCategory.requireImport, async () => {
        const result = await imp(type, file);
        revalidate();
        return result;
    });
}

export async function getEventsAction(id: string) {
    return withPolicyAction(Policies.taskCategory.requireRead, async () => {
        return events(id);
    });
}

function revalidate() {
    revalidateTag('task-category', 'max');
}
