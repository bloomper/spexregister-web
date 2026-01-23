"use server";

import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";
import {del, job, jobs, jobStatus} from "@/lib/impex";
import {revalidateTag} from "next/cache";


export async function getJobStatusAction(id: string) {
    return withPolicyAction(Policies.impex.requireRead, async () => {
        return jobStatus(id);
    });
}

export async function getJobAction(id: string) {
    return withPolicyAction(Policies.impex.requireRead, async () => {
        return job(id);
    });
}

export async function getJobsAction() {
    return withPolicyAction(Policies.impex.requireRead, async () => {
        return jobs();
    });
}

export async function deleteAction(id: string) {
    return withPolicyAction(Policies.impex.requireDelete, async () => {
        const result = await del(id);
        revalidate();
        return result;
    });
}

function revalidate() {
    revalidateTag('job', 'max');
}
