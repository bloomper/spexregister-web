"use client";

import {AuditTrail} from "@/components/data-audit-trail.client";
import {getRevisionsAction} from "@/app/(app)/spexare/actions.server";

const PARTNER_FIELDS = ["partner"];

export function PartnerAuditTrail({spexareId, onRestored}: { spexareId: string; onRestored?: () => void }) {
    return <AuditTrail id={spexareId} fetchAction={getRevisionsAction} fields={PARTNER_FIELDS} onRestored={onRestored}/>;
}
