"use server";

import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";
import {create, del, deleteImage, getPaged, spexareFormSchema, update, uploadImage} from "@/lib/spexare";
import {revalidateTag} from "next/cache";
import {SortDirection} from "@/gql/graphql";
import {
    addressFormSchema,
    create as createAddress,
    del as delAddress,
    update as updateAddress
} from "@/lib/spexare/address";
import {
    consentFormSchema,
    create as createConsent,
    del as delConsent,
    update as updateConsent
} from "@/lib/spexare/consent";
import {
    create as createMembership,
    del as delMembership,
    membershipFormSchema,
    update as updateMembership
} from "@/lib/spexare/membership";
import {create as createTagging, del as delTagging} from "@/lib/spexare/tagging";
import {create as createToggle, del as delToggle, toggleFormSchema, update as updateToggle} from "@/lib/spexare/toggle";

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

export async function createAddressAction(spexareId: string, _typeId: string, data: unknown) {
    return withPolicyAction(Policies.spexare.requireCreate, async () => {
        const validated = addressFormSchema.parse(data);
        const {typeId, ...createInput} = validated;
        const result = await createAddress(spexareId, _typeId, createInput);
        revalidate();
        return result;
    });
}

export async function updateAddressAction(spexareId: string, _typeId: string, id: string, data: unknown) {
    return withPolicyAction(Policies.spexare.requireUpdate, async () => {
        const validated = addressFormSchema.parse(data);
        const {typeId, ...updateInput} = validated;
        const result = await updateAddress(spexareId, _typeId, id, updateInput);
        revalidate();
        return result;
    });
}

export async function deleteAddressAction(spexareId: string, typeId: string, id: string) {
    return withPolicyAction(Policies.spexare.requireDelete, async () => {
        const result = await delAddress(spexareId, typeId, id);
        revalidate();
        return result;
    });
}

export async function createConsentAction(spexareId: string, _typeId: string, data: unknown) {
    return withPolicyAction(Policies.spexare.requireUpdate, async () => {
        const validated = consentFormSchema.parse(data);
        const {typeId, ...createInput} = validated;
        const result = await createConsent(spexareId, _typeId, createInput);
        revalidate();
        return result;
    });
}

export async function updateConsentAction(spexareId: string, _typeId: string, id: string, data: unknown) {
    return withPolicyAction(Policies.spexare.requireUpdate, async () => {
        const validated = consentFormSchema.parse(data);
        const {typeId, ...updateInput} = validated;
        const result = await updateConsent(spexareId, _typeId, id, updateInput);
        revalidate();
        return result;
    });
}

export async function deleteConsentAction(spexareId: string, typeId: string, id: string) {
    return withPolicyAction(Policies.spexare.requireUpdate, async () => {
        const result = await delConsent(spexareId, typeId, id);
        revalidate();
        return result;
    });
}

export async function createMembershipAction(spexareId: string, _typeId: string, data: unknown) {
    return withPolicyAction(Policies.spexare.requireUpdate, async () => {
        const validated = membershipFormSchema.parse(data);
        const {typeId, ...createInput} = validated;
        const result = await createMembership(spexareId, _typeId, createInput);
        revalidate();
        return result;
    });
}

export async function updateMembershipAction(spexareId: string, _typeId: string, id: string, data: unknown) {
    return withPolicyAction(Policies.spexare.requireUpdate, async () => {
        const validated = membershipFormSchema.parse(data);
        const {typeId, ...updateInput} = validated;
        const result = await updateMembership(spexareId, _typeId, id, updateInput);
        revalidate();
        return result;
    });
}

export async function deleteMembershipAction(spexareId: string, typeId: string, id: string) {
    return withPolicyAction(Policies.spexare.requireUpdate, async () => {
        const result = await delMembership(spexareId, typeId, id);
        revalidate();
        return result;
    });
}

export async function createTaggingAction(spexareId: string, tagId: string) {
    return withPolicyAction(Policies.spexare.requireUpdate, async () => {
        const result = await createTagging(spexareId, tagId);
        revalidate();
        return result;
    });
}

export async function deleteTaggingAction(spexareId: string, tagId: string) {
    return withPolicyAction(Policies.spexare.requireUpdate, async () => {
        const result = await delTagging(spexareId, tagId);
        revalidate();
        return result;
    });
}

export async function createToggleAction(spexareId: string, _typeId: string, data: unknown) {
    return withPolicyAction(Policies.spexare.requireUpdate, async () => {
        const validated = toggleFormSchema.parse(data);
        const {typeId, ...createInput} = validated;
        const result = await createToggle(spexareId, _typeId, createInput);
        revalidate();
        return result;
    });
}

export async function updateToggleAction(spexareId: string, _typeId: string, id: string, data: unknown) {
    return withPolicyAction(Policies.spexare.requireUpdate, async () => {
        const validated = toggleFormSchema.parse(data);
        const {typeId, ...updateInput} = validated;
        const result = await updateToggle(spexareId, _typeId, id, updateInput);
        revalidate();
        return result;
    });
}

export async function deleteToggleAction(spexareId: string, typeId: string, id: string) {
    return withPolicyAction(Policies.spexare.requireUpdate, async () => {
        const result = await delToggle(spexareId, typeId, id);
        revalidate();
        return result;
    });
}

function revalidate() {
    revalidateTag('spexare', 'max');
}
