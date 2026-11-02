import "server-only";

import {graphql} from "@/gql";
import type {MaintenanceJob} from "@/gql/schema";
import {runMutationField, runQuery} from "@/lib/graphql.server";

const MaintenanceJobsQuery = graphql(`
    query MaintenanceJobs {
        maintenanceJobs {
            job
            schedule
            running
            lastStartedAt
            lastFinishedAt
            lastSucceeded
        }
    }
`);

const MaintenanceJobRunMutation = graphql(`
    mutation MaintenanceJobRun($job: MaintenanceJob!) {
        maintenanceJobRun(job: $job)
    }
`);

/**
 * A scheduled maintenance job with its schedule and how its latest run went.
 */
export type MaintenanceJobStatus = {
    job: MaintenanceJob;
    schedule?: string | null;
    running: boolean;
    lastStartedAt?: string | null;
    lastFinishedAt?: string | null;
    lastSucceeded?: boolean | null;
};

/**
 * Every maintenance job the server runs on a schedule.
 */
export async function getMaintenanceJobs(): Promise<MaintenanceJobStatus[]> {
    const data = await runQuery(MaintenanceJobsQuery, {});

    return data?.maintenanceJobs ?? [];
}

/**
 * Asks the server to start the job in the background. Resolves to false when it is already running.
 */
export async function runMaintenanceJob(job: MaintenanceJob): Promise<boolean> {
    return Boolean(await runMutationField(MaintenanceJobRunMutation, {job}, "maintenanceJobRun"));
}
