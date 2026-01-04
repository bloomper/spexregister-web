"use server";

import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";
import {create, del, deleteImage, getPaged, spexareFormSchema, update, uploadImage} from "@/lib/spexare";
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
    return withPolicyAction(Policies.spexare.requireRead, async () => {
        return getPaged({
            ...args,
            full: args.full === true || args.full === "true"
        });
    });
}

export async function createAction(data: unknown) {
    return withPolicyAction(Policies.spexare.requireCreate, async () => {
        const validated = spexareFormSchema.parse(data);
        const {birthDate, birthNumber, socialSecurityNumber, graduation, comment, ...createInput} = validated;
        const result = await create(createInput);
        revalidate();
        return result;
    });
}

export async function updateAction(id: string, data: unknown) {
    return withPolicyAction(Policies.spexare.requireUpdate, async () => {
        const validated = spexareFormSchema.parse(data);
        const {birthDate, birthNumber, ...updateInput} = validated;
        const result = await update(id, updateInput);
        revalidate();
        return result;
    });
}

export async function deleteAction(id: string) {
    return withPolicyAction(Policies.spexare.requireDelete, async () => {
        const result = await del(id);
        revalidate();
        return result;
    });
}

export async function bulkDeleteAction(ids: string[]) {
    await withPolicyAction(Policies.spexare.requireDelete, async () => {
        await Promise.all(ids.map(id => del(id)));
        revalidate();
    });
}

export async function uploadImageAction(id: string, formData: FormData) {
    return withPolicyAction(Policies.spexare.requireUpdate, async () => {
        const file = formData.get("file") as File;
        const result = await uploadImage(id, file);

        revalidate();
        return result;
    });
}

export async function deleteImageAction(id: string) {
    return withPolicyAction(Policies.spexare.requireUpdate, async () => {
        await deleteImage(id);

        revalidate();
        return {
            success: true
        };
    });
}

function revalidate() {
    revalidateTag('spexare', 'max');
}
