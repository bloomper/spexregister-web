import "server-only";

import {graphql} from "@/gql";
import {AuditedType, RestorePreview, RestoreResult, Revision} from "@/gql/schema";
import {mutateForData, runQuery} from "@/lib/graphql.server";
import {mapConnection} from "@/utils/utils.server";
import {RevisionFeedPage} from "@/types/pagination";

const revisionsQuery = graphql(`
    query revisions($type: AuditedType!, $id: ID!) {
        revisions(type: $type, id: $id) {
            revision
            type
            entityId
            entityLabel
            revisionType
            modifiedAt
            modifiedBy
            changes {
                field
                oldValue
                newValue
                binary
                type
                entityId
            }
        }
    }
`);

const relatedRevisionsQuery = graphql(`
    query relatedRevisions($type: AuditedType!, $id: ID!, $relatedType: AuditedType!) {
        relatedRevisions(type: $type, id: $id, relatedType: $relatedType) {
            revision
            type
            entityId
            entityLabel
            revisionType
            modifiedAt
            modifiedBy
            changes {
                field
                oldValue
                newValue
                binary
                type
                entityId
            }
        }
    }
`);

const revisionFeedPagedQuery = graphql(`
    query revisionFeedPaged($first: Int, $after: String, $last: Int, $before: String, $type: AuditedType, $sinceInDays: Int) {
        revisionFeedPaged(first: $first, after: $after, last: $last, before: $before, type: $type, sinceInDays: $sinceInDays) {
            edges {
                cursor
                node {
                    revision
                    modifiedAt
                    modifiedBy
                    types
                }
            }
            pageInfo {
                hasPreviousPage
                hasNextPage
                startCursor
                endCursor
            }
            totalCount
        }
    }
`);

const restorePreviewQuery = graphql(`
    query restorePreview($type: AuditedType!, $id: ID!, $revision: Long!, $cascade: Boolean) {
        restorePreview(type: $type, id: $id, revision: $revision, cascade: $cascade) {
            entries {
                type
                id
                action
                changes {
                    field
                    oldValue
                    newValue
                    binary
                }
            }
            warnings {
                code
                message
                previousId
                newId
            }
        }
    }
`);

const restoreMutation = graphql(`
    mutation restore($type: AuditedType!, $id: ID!, $revision: Long!, $cascade: Boolean) {
        restore(type: $type, id: $id, revision: $revision, cascade: $cascade) {
            revision
            updated
            created
            deleted
            warnings {
                code
                message
                previousId
                newId
            }
        }
    }
`);

export const AUDIT_CACHE_TAG = "revisions";

export async function getRevisions(type: AuditedType, id: string): Promise<Revision[]> {
    const data = await runQuery(revisionsQuery, {type, id});

    return (data?.revisions as Revision[] | undefined) ?? [];
}

export async function getRelatedRevisions(type: AuditedType, id: string, relatedType: AuditedType): Promise<Revision[]> {
    const data = await runQuery(relatedRevisionsQuery, {type, id, relatedType});

    return (data?.relatedRevisions as Revision[] | undefined) ?? [];
}

export async function getRevisionFeedPaged(args: {
    first?: number;
    last?: number;
    after?: string | null;
    before?: string | null;
    type?: AuditedType | null;
    sinceInDays?: number | null;
}): Promise<RevisionFeedPage> {
    const data = await runQuery(revisionFeedPagedQuery, {
        first: args.first ?? null,
        last: args.last ?? null,
        after: args.after ?? null,
        before: args.before ?? null,
        type: args.type ?? null,
        sinceInDays: args.sinceInDays ?? null,
    });

    return mapConnection(data?.revisionFeedPaged);
}

export async function getRestorePreview(
    type: AuditedType,
    id: string,
    revision: number,
    cascade: boolean,
): Promise<RestorePreview> {
    const data = await runQuery(restorePreviewQuery, {type, id, revision, cascade});

    if (!data?.restorePreview) {
        throw new Error("No restore preview returned");
    }

    return data.restorePreview as RestorePreview;
}

export async function restore(
    type: AuditedType,
    id: string,
    revision: number,
    cascade: boolean,
): Promise<RestoreResult> {
    return await mutateForData(restoreMutation, {
        type,
        id,
        revision,
        cascade
    }, "restore", "No data restored") as RestoreResult;
}
