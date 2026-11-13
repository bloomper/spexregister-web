"use server";

import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";

import {exp, get, getPaged, revisions} from "@/lib/task/category";

import {ImpexType, SortDirection} from "@/gql/schema";

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
    return withPolicyAction(Policies.taskCategory.requireRead, async () => {
        return getPaged({
            ...args,
            full: args.full === true || args.full === "true"
        });
    });
}

export async function getAction(id: string) {
    return withPolicyAction(Policies.taskCategory.requireRead, async () => {
        return get(id);
    });
}

export async function exportAction(ids: string[] | null, filter: string | null, type: ImpexType) {
    return withPolicyAction(Policies.taskCategory.requireExport, async () => {
        return await exp(ids, filter, type);
    });
}

export async function getRevisionsAction(id: string) {
    return withPolicyAction(Policies.taskCategory.requireRead, async () => {
        return revisions(id);
    });
}
