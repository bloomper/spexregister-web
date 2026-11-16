"use server";

import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";

import {get, revisions} from "@/lib/task/category";

/**
 * Reads behind the task category view dialog. The task category itself is kept in Spexipedia; Spexregister holds a copy.
 */
export async function getAction(id: string) {
    return withPolicyAction(Policies.taskCategory.requireRead, async () => {
        return get(id);
    });
}

export async function getRevisionsAction(id: string) {
    return withPolicyAction(Policies.taskCategory.requireRead, async () => {
        return revisions(id);
    });
}
