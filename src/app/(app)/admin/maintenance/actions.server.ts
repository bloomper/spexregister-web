"use server";

import type {MaintenanceJob} from "@/gql/schema";
import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";
import {getMaintenanceJobs, runMaintenanceJob} from "@/lib/admin";

/**
 * Starts a maintenance job. Resolves to false when it is already running.
 */
export async function runMaintenanceJobAction(job: MaintenanceJob) {
    return withPolicyAction(Policies.admin.requireAdmin, async () => runMaintenanceJob(job));
}

/**
 * The maintenance jobs as they are now, to refresh their status.
 */
export async function getMaintenanceJobsAction() {
    return withPolicyAction(Policies.admin.requireAdmin, async () => getMaintenanceJobs());
}
