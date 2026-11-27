"use client";

import { AuditTrail } from "@/components/data-audit-trail.client";
import { getRevisionsAction } from "@/app/(app)/spexare/actions.server";

const TAG_FIELDS = ["tags"];

/**
 * The history of a spexare's tags.
 */
export function TagsAuditTrail({ spexareId, onRestored }: { spexareId: string; onRestored?: () => void }) {
  return (
    <AuditTrail
      id={spexareId}
      fetchAction={getRevisionsAction}
      fields={TAG_FIELDS}
      onRestored={onRestored}
    />
  );
}
