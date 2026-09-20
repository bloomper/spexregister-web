"use client";

import {useTranslations} from "next-intl";
import {AuditedType, FieldChange} from "@/gql/schema";
import {auditFieldLabel, auditFieldValue} from "@/utils/audit";
import {AuditBinaryThumbnail} from "@/components/audit/audit-binary-thumbnail.client";
import {cn} from "@/utils/utils";

interface AuditDiffProps {
    changes: FieldChange[];
    /** Owner of any change that does not name one itself. */
    type: AuditedType;
    /**
     * The entity whose timeline this is. Binary values are addressed here rather than at the field's
     * owner, because that is where the backend authorizes the read and where it resolves a field
     * living on a referenced entity.
     */
    entityId: string;
    revision: number;
    /**
     * The revision holding a binary field's previous bytes. Only a full timeline can work that out,
     * so without it an old image is named rather than shown.
     */
    previousRevisionOf?: (change: FieldChange) => number | null;
    className?: string;
}

const CELL = "min-w-0 bg-background px-2 py-1 wrap-break-word";
const HEADING = "bg-muted/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground";

function ownerOf(change: FieldChange, fallback: AuditedType): AuditedType {
    return change.type ?? fallback;
}

/**
 * One row per changed field, with before and after in their own columns so a long list can be
 * skimmed down a single edge instead of being read sentence by sentence. The columns stack on a
 * narrow screen, where the − and + markers carry the distinction on their own.
 */
export function AuditDiff({changes, type, entityId, revision, previousRevisionOf, className}: AuditDiffProps) {
    const t = useTranslations();

    if (changes.length === 0) {
        return null;
    }

    const renderValue = (change: FieldChange, side: "old" | "new") => {
        const value = side === "old" ? change.oldValue : change.newValue;

        if (value === null || value === undefined) {
            return <span className="text-muted-foreground">{t("Audit.empty")}</span>;
        }

        if (change.binary) {
            const binaryRevision = side === "new" ? revision : previousRevisionOf?.(change) ?? null;

            // The value of a binary change is its content type, which is all there is to show when
            // the bytes themselves are not addressable.
            return binaryRevision === null
                ? <span className="font-mono text-[10px] text-muted-foreground">{value}</span>
                : <AuditBinaryThumbnail type={type} entityId={entityId}
                                        revision={binaryRevision} field={change.field}/>;
        }

        return auditFieldValue(t, ownerOf(change, type), change.field, value);
    };

    return (
        <dl className={cn(
            "grid gap-px overflow-hidden rounded-md border bg-border/60 text-[11px]",
            "sm:grid-cols-[minmax(0,9rem)_minmax(0,1fr)_minmax(0,1fr)]",
            className,
        )}>
            <div className={cn(HEADING, "hidden sm:block")}>{t("Audit.field")}</div>
            <div className={cn(HEADING, "hidden sm:block")}>{t("Audit.before")}</div>
            <div className={cn(HEADING, "hidden sm:block")}>{t("Audit.after")}</div>

            {changes.map((change, index) => (
                <div key={`${change.field}-${change.entityId ?? ""}-${index}`} className="contents">
                    <dt className={cn(CELL, "font-medium text-foreground/70")}>
                        {auditFieldLabel(t, ownerOf(change, type), change.field)}
                    </dt>
                    <dd className={cn(CELL, "text-muted-foreground")}>
                        <span className="mr-1 select-none font-mono text-destructive/70" aria-hidden="true">−</span>
                        <span className="line-through decoration-destructive/40">{renderValue(change, "old")}</span>
                    </dd>
                    <dd className={cn(CELL, "text-foreground")}>
                        <span className="mr-1 select-none font-mono text-green-700/80 dark:text-green-500/80"
                              aria-hidden="true">+</span>
                        <span>{renderValue(change, "new")}</span>
                    </dd>
                </div>
            ))}
        </dl>
    );
}
