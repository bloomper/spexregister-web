"use server";

import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";
import {createSpex, deleteSpex, getSpexPaged, spexFormSchema, updateSpex} from "@/lib/spex";
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
    return withPolicyAction(Policies.spex.requireRead, async () => {
        return getSpexPaged({
            ...args,
            full: args.full === true || args.full === "true"
        });
    });
}

export async function createAction(data: unknown) {
    return withPolicyAction(Policies.spex.requireCreate, async () => {
        const validated = spexFormSchema.parse(data);
        const result = await createSpex(validated);
        revalidate();
        return result;
    });
}

export async function updateAction(id: string, data: unknown) {
    return withPolicyAction(Policies.spex.requireUpdate, async () => {
        const validated = spexFormSchema.parse(data);
        const result = await updateSpex(id, validated);
        revalidate();
        return result;
    });
}

export async function deleteAction(id: string) {
    return withPolicyAction(Policies.spex.requireDelete, async () => {
        const result = await deleteSpex(id);
        revalidate();
        return result;
    });
}

export async function bulkDeleteAction(ids: string[]) {
    await Promise.all(ids.map(id => deleteAction(id)));
}

function revalidate() {
    revalidateTag('spex', 'max');
}
