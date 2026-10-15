"use server";

import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";
import {indexSpexare} from "@/lib/admin";

export async function indexSpexareAction() {
    return withPolicyAction(Policies.admin.requireAdmin, async () => {
        await indexSpexare();
    });
}
