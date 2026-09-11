"use server";

import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";
import {create, del, exp, get, getPaged, imp, newsFormSchema, revisions, update} from "@/lib/news";
import {getRestorePreview, restore} from "@/lib/audit/audit.server";
import {revalidateTag} from "next/cache";
import {AuditedType, ImpexType, SortDirection} from "@/gql/schema";

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
    return withPolicyAction(Policies.news.requireRead, async () => {
        return getPaged({
            ...args,
            full: args.full === true || args.full === "true"
        });
    });
}

export async function getAction(id: string) {
    return withPolicyAction(Policies.news.requireRead, async () => {
        return get(id);
    });
}

export async function createAction(data: unknown) {
    return withPolicyAction(Policies.news.requireCreate, async () => {
        const validated = newsFormSchema.parse(data);
        const result = await create(validated);
        revalidate();
        return result;
    });
}

export async function updateAction(id: string, data: unknown) {
    return withPolicyAction(Policies.news.requireUpdate, async () => {
        const validated = newsFormSchema.parse(data);
        const result = await update(id, validated);
        revalidate();
        return result;
    });
}

export async function deleteAction(id: string) {
    return withPolicyAction(Policies.news.requireDelete, async () => {
        const result = await del(id);
        revalidate();
        return result;
    });
}

export async function bulkDeleteAction(ids: string[]) {
    await withPolicyAction(Policies.news.requireDelete, async () => {
        await Promise.all(ids.map(id => del(id)));
        revalidate();
    });
}

export async function exportAction(ids: string[] | null, filter: string | null, type: ImpexType) {
    return withPolicyAction(Policies.news.requireExport, async () => {
        const result = await exp(ids, filter, type);
        revalidate();
        return result;
    });
}

export async function importAction(type: ImpexType, file: File) {
    return withPolicyAction(Policies.news.requireImport, async () => {
        const result = await imp(type, file);
        revalidate();
        return result;
    });
}

export async function getRevisionsAction(id: string) {
    return withPolicyAction(Policies.news.requireRead, async () => {
        return revisions(id);
    });
}

export async function getRestorePreviewAction(type: AuditedType, id: string, revision: number, cascade: boolean) {
    return withPolicyAction(Policies.audit.requireRestore, async () => {
        return getRestorePreview(type, id, revision, cascade);
    });
}

export async function restoreRevisionAction(type: AuditedType, id: string, revision: number, cascade: boolean) {
    return withPolicyAction(Policies.audit.requireRestore, async () => {
        const result = await restore(type, id, revision, cascade);
        revalidate();
        return result;
    });
}

function revalidate() {
    revalidateTag("news", "max");
}
