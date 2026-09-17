"use server";

import {revalidateTag} from "next/cache";
import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";
import {create, del, getAll, savedSearchFormSchema, update} from "@/lib/saved-search";

export async function getSavedSearchesAction() {
    return withPolicyAction(Policies.savedSearch.requireRead, async () => {
        return getAll();
    });
}

export async function createSavedSearchAction(data: unknown) {
    return withPolicyAction(Policies.savedSearch.requireCreate, async () => {
        const validated = savedSearchFormSchema.parse(data);
        const result = await create(validated);
        revalidate();
        return result;
    });
}

export async function updateSavedSearchAction(id: string, data: unknown) {
    return withPolicyAction(Policies.savedSearch.requireUpdate, async () => {
        const validated = savedSearchFormSchema.parse(data);
        const result = await update(id, validated);
        revalidate();
        return result;
    });
}

export async function deleteSavedSearchAction(id: string) {
    return withPolicyAction(Policies.savedSearch.requireDelete, async () => {
        const result = await del(id);
        revalidate();
        return result;
    });
}

function revalidate() {
    revalidateTag("saved-search", "max");
}
