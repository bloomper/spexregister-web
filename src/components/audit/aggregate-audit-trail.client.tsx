"use client";

import {AuditedType} from "@/gql/schema";
import {AuditTrail} from "@/components/data-audit-trail.client";
import {
    getRelatedTypeRevisionsAction,
    getRestorePreviewAction,
    restoreRevisionAction,
} from "@/app/(app)/spexare/actions.server";

const restoreActions = {
    preview: getRestorePreviewAction,
    restore: restoreRevisionAction,
};

export function AggregateAuditTrail({spexareId, relatedType, onRestored}: {
    spexareId: string;
    relatedType: AuditedType;
    onRestored?: () => void
}) {
    return (
        <AuditTrail
            id={spexareId}
            fetchAction={(id) => getRelatedTypeRevisionsAction(id, relatedType)}
            restoreActions={restoreActions}
            onRestored={onRestored}
        />
    );
}
