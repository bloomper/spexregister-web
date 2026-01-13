"use server";

import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";
import {create, del, deleteLogo, events, getPaged, spexCategoryFormSchema, update, uploadLogo} from "@/lib/spex/category";
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
    return withPolicyAction(Policies.spexCategory.requireRead, async () => {
        return getPaged({
            ...args,
            full: args.full === true || args.full === "true"
        });
    });
}

export async function createAction(data: unknown) {
    return withPolicyAction(Policies.spexCategory.requireCreate, async () => {
        const validated = spexCategoryFormSchema.parse(data);
        const result = await create(validated);
        revalidate();
        return result;
    });
}

export async function updateAction(id: string, data: unknown) {
    return withPolicyAction(Policies.spexCategory.requireUpdate, async () => {
        const validated = spexCategoryFormSchema.parse(data);
        const result = await update(id, validated);
        revalidate();
        return result;
    });
}

export async function deleteAction(id: string) {
    return withPolicyAction(Policies.spexCategory.requireDelete, async () => {
        const result = await del(id);
        revalidate();
        return result;
    });
}

export async function bulkDeleteAction(ids: string[]) {
    await withPolicyAction(Policies.spexCategory.requireDelete, async () => {
        await Promise.all(ids.map(id => del(id)));
        revalidate();
    });
}

export async function uploadLogoAction(id: string, formData: FormData) {
    return withPolicyAction(Policies.spexCategory.requireUpdate, async () => {
        const file = formData.get("file") as File;
        const result = await uploadLogo(id, file);

        revalidate();
        return result;
    });
}

export async function deleteLogoAction(id: string) {
    return withPolicyAction(Policies.spexCategory.requireUpdate, async () => {
        await deleteLogo(id);

        revalidate();
        return {
            success: true
        };
    });
}

export async function getEventsAction(id: string) {
    return withPolicyAction(Policies.spexCategory.requireRead, async () => {
        return events(id);
    });
}

function revalidate() {
    revalidateTag('spex-category', 'max');
}
