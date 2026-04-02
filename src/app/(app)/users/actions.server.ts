"use server";

import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";
import {
    addAuthorities,
    addSpexare,
    create,
    del,
    events,
    exp,
    getAuthorities,
    getPaged,
    getStates,
    imp,
    me,
    removeAuthorities,
    removeSpexare,
    setState,
    update,
    userFormSchema
} from "@/lib/user";
import {getPaged as getSpexarePaged} from "@/lib/spexare";
import {revalidateTag} from "next/cache";
import {ImpexType, SortDirection} from "@/gql/graphql";

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
    return withPolicyAction(Policies.user.requireRead, async () => {
        return getPaged({
            ...args,
            full: args.full === true || args.full === "true"
        });
    });
}

export async function meAction() {
    return withPolicyAction(Policies.user.requireReadMe, async () => {
        return await me();
    });
}

export async function createAction(data: unknown) {
    return withPolicyAction(Policies.user.requireCreate, async () => {
        const validated = userFormSchema.parse(data);
        const {authorityIds, stateId, spexareId, ...createInput} = validated;
        const result = await create(createInput);
        revalidate();
        return result;
    });
}

export async function updateAction(id: string, data: unknown) {
    return withPolicyAction(Policies.user.requireUpdate, async () => {
        const validated = userFormSchema.parse(data);
        const {authorityIds, stateId, spexareId, ...updateInput} = validated;
        const result = await update(id, updateInput);
        revalidate();
        return result;
    });
}

export async function deleteAction(id: string) {
    return withPolicyAction(Policies.user.requireDelete, async () => {
        const result = await del(id);
        revalidate();
        return result;
    });
}

export async function bulkDeleteAction(ids: string[]) {
    await withPolicyAction(Policies.user.requireDelete, async () => {
        await Promise.all(ids.map(id => del(id)));
        revalidate();
    });
}

export async function exportAction(ids: string[] | null, filter: string | null, type: ImpexType) {
    return withPolicyAction(Policies.user.requireExport, async () => {
        return await exp(ids, filter, type);
    });
}

export async function importAction(type: ImpexType, file: File) {
    return withPolicyAction(Policies.user.requireImport, async () => {
        const result = await imp(type, file);
        revalidate();
        return result;
    });
}

export async function getAuthoritiesAction() {
    return withPolicyAction(Policies.user.requireRead, async () => {
        return getAuthorities();
    });
}

export async function addAuthoritiesAction(userId: string, ids: string[]) {
    return withPolicyAction(Policies.user.requireUpdate, async () => {
        const result = await addAuthorities(userId, ids);
        revalidate();
        return result;
    });
}

export async function removeAuthoritiesAction(userId: string, ids: string[]) {
    return withPolicyAction(Policies.user.requireUpdate, async () => {
        const result = await removeAuthorities(userId, ids);
        revalidate();
        return result;
    });
}

export async function getStatesAction() {
    return withPolicyAction(Policies.user.requireRead, async () => {
        return getStates();
    });
}

export async function setStateAction(userId: string, id: string) {
    return withPolicyAction(Policies.user.requireUpdate, async () => {
        const result = await setState(userId, id);
        revalidate();
        return result;
    });
}

export async function addSpexareAction(userId: string, id: string) {
    return withPolicyAction(Policies.user.requireUpdate, async () => {
        const result = await addSpexare(userId, id);
        revalidate();
        return result;
    });
}

export async function removeSpexareAction(userId: string) {
    return withPolicyAction(Policies.user.requireUpdate, async () => {
        const result = await removeSpexare(userId);
        revalidate();
        return result;
    });
}

export async function searchSpexareAction(query: string) {
    return withPolicyAction(Policies.user.requireRead, async () => {
        const result = await getSpexarePaged({
            first: 10,
            filter: `(firstName:*${query}* OR lastName:*${query}* OR nickName:*${query}*) AND user:NULL`,
            full: false
        });
        return result.items;
    });
}

export async function getEventsAction(id: string) {
    return withPolicyAction(Policies.user.requireRead, async () => {
        return events(id);
    });
}

function revalidate() {
    revalidateTag('user', 'max');
}
