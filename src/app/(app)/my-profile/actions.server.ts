"use server";

import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";
import {expMine, requestRemoval} from "@/lib/spexare";
import {jobStatus} from "@/lib/impex";
import {ImpexType} from "@/gql/schema";
import {removalRequestSchema} from "@/lib/spexare/schema";

export async function exportMineAction(type: ImpexType) {
    return withPolicyAction(Policies.spexare.requireSelfService, async () => {
        return expMine(type);
    });
}

export async function getMineExportStatusAction(id: string) {
    return withPolicyAction(Policies.spexare.requireSelfService, async () => {
        return jobStatus(id);
    });
}

export async function requestRemovalAction(data: unknown) {
    return withPolicyAction(Policies.spexare.requireSelfService, async () => {
        const {reason} = removalRequestSchema.parse(data);
        await requestRemoval(reason?.trim() ? reason.trim() : null);
    });
}
