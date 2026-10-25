import "server-only";

import {Job, JobStatus} from "@/gql/schema";
import {graphql} from "@/gql";
import {runMutationField, runQuery} from "@/lib/graphql.server";

export const JobStatusFields = graphql(`
    fragment JobStatusFields on JobStatus {
        id
        name
        status
        exitStatus
    }
`);

export const JobFields = graphql(`
    fragment JobFields on Job {
        id
        name
        status
        exitStatus
        createdAt
        startedAt
        finishedAt
        hasDownload
        importResult {
            success
            errors
            messages
            data
        }
    }
`);

const JobStatusQuery = graphql(`
    query JobStatus($id: ID!) {
        jobStatus(id: $id) {
            ...JobStatusFields
        }
    }
`);

const JobQuery = graphql(`
    query JobById($id: ID!) {
        job(id: $id) {
            ...JobFields
        }
    }
`);

const JobsQuery = graphql(`
    query Jobs {
        jobs {
            ...JobFields
        }
    }
`);

const DeleteMutation = graphql(`
    mutation JobDelete($id: ID!) {
        jobDelete(id: $id)
    }
`);

const jobContext = {fetchOptions: {next: {tags: ["job"]}}};

/**
 * The status of one of the user's own jobs.
 */
export async function jobStatus(id: string): Promise<JobStatus | null> {
    const data = await runQuery(JobStatusQuery, {id}, jobContext);
    return (data?.jobStatus as JobStatus | undefined) ?? null;
}

/**
 * One of the user's own jobs, with an import's result.
 */
export async function job(id: string): Promise<Job | null> {
    const data = await runQuery(JobQuery, {id}, jobContext);
    return (data?.job as Job | undefined) ?? null;
}

/**
 * The user's own jobs, newest first.
 */
export async function jobs(): Promise<Job[]> {
    const data = await runQuery(JobsQuery, {}, jobContext);
    return (data?.jobs as Job[] | undefined) ?? [];
}

/**
 * Removes one of the user's finished jobs with its files.
 */
export async function del(id: string) {
    return runMutationField(DeleteMutation, {id}, "jobDelete");
}
