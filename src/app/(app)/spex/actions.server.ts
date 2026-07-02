"use server";

import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";
import {
    addCategory,
    create,
    createRevival,
    del,
    deletePoster,
    deleteRevival,
    events,
    exp,
    getAll as getAllSpex,
    getPaged,
    imp,
    removeCategory,
    spexFormSchema,
    update,
    uploadPoster
} from "@/lib/spex";
import {revalidateTag} from "next/cache";
import {ImpexType, SortDirection} from "@/gql/schema";
import {getAll as getAllSpexCategories} from "@/lib/spex/category";

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
        return getPaged({
            ...args,
            full: args.full === true || args.full === "true"
        });
    });
}

export async function getAllAction() {
    return withPolicyAction(Policies.spex.requireRead, async () => {
        return getAllSpex();
    });
}

export async function createAction(data: unknown) {
    return withPolicyAction(Policies.spex.requireCreate, async () => {
        const validated = spexFormSchema.parse(data);
        const {categoryId, revivalYears, ...createInput} = validated;
        void categoryId;
        void revivalYears;
        const result = await create(createInput);
        revalidate();
        return result;
    });
}

export async function updateAction(id: string, data: unknown) {
    return withPolicyAction(Policies.spex.requireUpdate, async () => {
        const validated = spexFormSchema.parse(data);
        const {categoryId, revivalYears, ...updateInput} = validated;
        void categoryId;
        void revivalYears;
        const result = await update(id, updateInput);
        revalidate();
        return result;
    });
}

export async function deleteAction(id: string) {
    return withPolicyAction(Policies.spex.requireDelete, async () => {
        const result = await del(id);
        revalidate();
        return result;
    });
}

export async function bulkDeleteAction(ids: string[]) {
    await withPolicyAction(Policies.spex.requireDelete, async () => {
        await Promise.all(ids.map(id => del(id)));
        revalidate();
    });
}

export async function exportAction(ids: string[] | null, filter: string | null, type: ImpexType) {
    return withPolicyAction(Policies.spex.requireExport, async () => {
        return await exp(ids, filter, type);
    });
}

export async function importAction(type: ImpexType, file: File) {
    return withPolicyAction(Policies.spex.requireImport, async () => {
        const result = await imp(type, file);
        revalidate();
        return result;
    });
}

export async function getAllCategoriesAction() {
    return withPolicyAction(Policies.spexCategory.requireRead, async () => {
        return getAllSpexCategories();
    });
}

export async function addCategoryAction(id: string, categoryId: string) {
    return withPolicyAction(Policies.spex.requireCreate, async () => {
        const result = await addCategory(id, categoryId);
        revalidate();
        return result;
    });
}

export async function removeCategoryAction(id: string) {
    return withPolicyAction(Policies.spex.requireCreate, async () => {
        const result = await removeCategory(id);
        revalidate();
        return result;
    });
}

export async function createRevivalAction(spexId: string, year: string) {
    return withPolicyAction(Policies.spex.requireUpdate, async () => {
        const result = await createRevival(spexId, year);
        revalidate();
        return result;
    });
}

export async function deleteRevivalAction(spexId: string, id: string) {
    return withPolicyAction(Policies.spex.requireUpdate, async () => {
        const result = await deleteRevival(spexId, id);
        revalidate();
        return result;
    });
}

export async function uploadPosterAction(id: string, formData: FormData) {
    return withPolicyAction(Policies.spex.requireUpdate, async () => {
        const file = formData.get("file") as File;
        const result = await uploadPoster(id, file);

        revalidate();
        return result;
    });
}

export async function deletePosterAction(id: string) {
    return withPolicyAction(Policies.spex.requireUpdate, async () => {
        await deletePoster(id);

        revalidate();
        return {
            success: true
        };
    });
}

export async function getEventsAction(id: string) {
    return withPolicyAction(Policies.spex.requireRead, async () => {
        return events(id);
    });
}

function revalidate() {
    revalidateTag('spex', 'max');
}
