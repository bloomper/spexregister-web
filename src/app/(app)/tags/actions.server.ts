"use server";

import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";
import {create, del, events, getAll, getPaged, tagFormSchema, update} from "@/lib/tag";
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
    return withPolicyAction(Policies.tag.requireRead, async () => {
        return getPaged({
            ...args,
            full: args.full === true || args.full === "true"
        });
    });
}

export async function createAction(data: unknown) {
    return withPolicyAction(Policies.tag.requireCreate, async () => {
        const validated = tagFormSchema.parse(data);
        const result = await create(validated);
        revalidate();
        return result;
    });
}

export async function updateAction(id: string, data: unknown) {
    return withPolicyAction(Policies.tag.requireUpdate, async () => {
        const validated = tagFormSchema.parse(data);
        const result = await update(id, validated);
        revalidate();
        return result;
    });
}

export async function deleteAction(id: string) {
    return withPolicyAction(Policies.tag.requireDelete, async () => {
        const result = await del(id);
        revalidate();
        return result;
    });
}

export async function bulkDeleteAction(ids: string[]) {
    await withPolicyAction(Policies.tag.requireDelete, async () => {
        await Promise.all(ids.map(id => del(id)));
        revalidate();
    });
}

export async function getAllTagsAction() {
    return withPolicyAction(Policies.tag.requireRead, async () => {
        return getAll();
    });
}

export async function getEventsAction(id: string) {
    return withPolicyAction(Policies.tag.requireRead, async () => {
        return events(id);
    });
}

function revalidate() {
    revalidateTag('tag', 'max');
}
