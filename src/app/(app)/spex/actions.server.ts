"use server";

import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";

import {exp, get, getAll as getAllSpex, getPaged, revisions} from "@/lib/spex";

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

export async function getAction(id: string) {
    return withPolicyAction(Policies.spex.requireRead, async () => {
        return get(id);
    });
}

export async function exportAction(ids: string[] | null, filter: string | null, type: ImpexType) {
    return withPolicyAction(Policies.spex.requireExport, async () => {
        return await exp(ids, filter, type);
    });
}

export async function getAllCategoriesAction() {
    return withPolicyAction(Policies.spexCategory.requireRead, async () => {
        return getAllSpexCategories();
    });
}

export async function getRevisionsAction(id: string) {
    return withPolicyAction(Policies.spex.requireRead, async () => {
        return revisions(id);
    });
}
