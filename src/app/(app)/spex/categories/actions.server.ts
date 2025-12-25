"use server";

import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";
import {createSpexCategory, deleteSpexCategory, getSpexCategoryPaged, spexCategoryFormSchema, updateSpexCategory} from "@/lib/spex/category";
import {revalidateTag} from "next/cache";
import {SortDirection} from "@/gql/graphql";
import axios from "@/lib/axios.server";

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
        return getSpexCategoryPaged({
            ...args,
            full: args.full === true || args.full === "true"
        });
    });
}

export async function createAction(data: unknown) {
    return withPolicyAction(Policies.spexCategory.requireCreate, async () => {
        const validated = spexCategoryFormSchema.parse(data);
        const result = await createSpexCategory(validated);
        revalidate();
        return result;
    });
}

export async function updateAction(id: string, data: unknown) {
    return withPolicyAction(Policies.spexCategory.requireUpdate, async () => {
        const validated = spexCategoryFormSchema.parse(data);
        const result = await updateSpexCategory(id, validated);
        revalidate();
        return result;
    });
}

export async function deleteAction(id: string) {
    return withPolicyAction(Policies.spexCategory.requireDelete, async () => {
        const result = await deleteSpexCategory(id);
        revalidate();
        return result;
    });
}

export async function bulkDeleteAction(ids: string[]) {
    await Promise.all(ids.map(id => deleteAction(id)));
}

export async function uploadLogoAction(id: string, formData: FormData) {
    return withPolicyAction(Policies.spexCategory.requireUpdate, async () => {
        const file = formData.get("file") as File;
        const arrayBuffer = await file.arrayBuffer();
        const response = await axios.put(`${process.env.API_REST_BASE_URL}/api/spex/categories/${id}/logo`, arrayBuffer, {
            headers: {
                'Content-Type': file.type,
            }
        });

        revalidate();
        return response.data;
    });
}

export async function deleteLogoAction(id: string) {
    return withPolicyAction(Policies.spexCategory.requireUpdate, async () => {
        await axios.delete(`${process.env.API_REST_BASE_URL}/api/spex/categories/${id}/logo`);

        revalidate();
        return {
            success: true
        };
    });
}

function revalidate() {
    revalidateTag('spex-category', 'max');
}
