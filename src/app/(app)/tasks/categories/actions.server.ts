"use server";

import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";
import {create, del, getPaged, taskCategoryFormSchema, update} from "@/lib/task/category";
import {revalidateTag} from "next/cache";
import {SortDirection} from "@/gql/graphql";

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

function revalidate() {
    revalidateTag('task-category', 'max');
}
