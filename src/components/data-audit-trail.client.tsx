"use client";

import {useCallback, useEffect, useState} from "react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {Button} from "@/components/ui/button";
import {ChevronDown, ChevronRight, ChevronUp, History, Pencil, PlusCircle, Trash2} from "lucide-react";
import {FieldChange, Revision, RevisionType} from "@/gql/schema";
import {useTranslations} from "next-intl";
import {formatDateTime} from "@/utils/utils";
import {auditFieldLabel, auditFieldValue} from "@/utils/audit";
import {AuditBinaryThumbnail} from "@/components/audit/audit-binary-thumbnail.client";
import {RestoreActions, RestoreDialog} from "@/components/audit/restore-dialog.client";
import {useRoles} from "@/components/roles-provider.client";
import {isAdmin} from "@/utils/auth";

function ownerOf(revision: Revision, change: FieldChange) {
    return {
        type: change.type ?? revision.type,
        entityId: String(change.entityId ?? revision.entityId ?? ""),
    };
}

/** Several entities can share a revision, so an entry is only identified by both together. */
function keyOf(revision: Revision): string {
    return `${revision.type}-${revision.entityId}-${revision.revision}`;
}

/**
 * A timeline can cover several entities, so "latest" has to be resolved per entity rather than by
 * position in the list.
 */
function latestFor(revisions: Revision[], revision: Revision): Revision | null {
    return revisions
        .filter((candidate) => candidate.type === revision.type && candidate.entityId === revision.entityId)
        .reduce<Revision | null>((newest, candidate) =>
            !newest || candidate.revision > newest.revision ? candidate : newest, null);
}

/** The revision at which this field last changed on the same entity, which holds its previous value. */
function previousRevisionOf(revisions: Revision[], revision: Revision, change: FieldChange): number | null {
    const owner = ownerOf(revision, change);
    const older = revisions
        .filter((candidate) => candidate.revision < revision.revision)
        .filter((candidate) =>
            candidate.changes.some(
                (other) =>
                    other.field === change.field &&
                    ownerOf(candidate, other).type === owner.type &&
                    ownerOf(candidate, other).entityId === owner.entityId,
            ),
        );

    return older.length > 0 ? Math.max(...older.map((candidate) => candidate.revision)) : null;
}

const REVISION_ICONS = {
    [RevisionType.Add]: <PlusCircle className="h-3 w-3 text-green-600/80"/>,
    [RevisionType.Mod]: <Pencil className="h-3 w-3 text-blue-600/80"/>,
    [RevisionType.Del]: <Trash2 className="h-3 w-3 text-destructive/80"/>,
};

interface AuditTrailProps {
    id: string;
    fetchAction: (id: string) => Promise<Revision[]>;
    restoreActions?: RestoreActions;
    /** Narrows the timeline to changes of these properties, for a tab that shows only one of them. */
    fields?: string[];
    /**
     * Invoked once a restore has been applied. The surrounding dialog renders from a snapshot taken
     * when it opened, so it has to be told that what it is showing is now out of date.
     */
    onRestored?: () => void;
}

export function AuditTrail({id, fetchAction, restoreActions, fields, onRestored}: AuditTrailProps) {
    const t = useTranslations();
    const canRestore = isAdmin(useRoles());
    const [isOpen, setIsOpen] = useState(false);
    const [revisions, setRevisions] = useState<Revision[]>([]);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [expanded, setExpanded] = useState<string | null>(null);
    const spansSeveralEntities = new Set(revisions.map((entry) => `${entry.type}-${entry.entityId}`)).size > 1;

    const load = useCallback(() => {
        let cancelled = false;

        fetchAction(id)
            .then((all) => {
                const data = fields
                    ? all
                        .map((entry) => ({
                            ...entry,
                            changes: entry.changes.filter((change) => fields.includes(change.field))
                        }))
                        .filter((entry) => entry.changes.length > 0)
                    : all;

                if (!cancelled) {
                    setRevisions(data);
                    setHasLoaded(true);
                }
            })
            .catch((e) => {
                console.error("Failed to fetch revisions", e);

                if (!cancelled) {
                    setHasLoaded(true);
                }
            });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, fields?.join(",")]);

    useEffect(() => load(), [load]);

    // Nothing to show, and nothing to restore, so the section stays out of the way entirely.
    if (!hasLoaded || revisions.length === 0) {
        return null;
    }

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}
                     className="w-full rounded-lg border bg-muted/30 shadow-sm">
            <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm"
                        className="flex w-full items-center justify-between px-3 py-2 h-auto hover:bg-muted/50 transition-colors">
                    <div
                        className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-foreground/70">
                        <History className="h-3.5 w-3.5 text-muted-foreground"/>
                        <span>{t("Common.history")}</span>
                    </div>
                    {isOpen ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground"/> :
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground"/>}
                </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="px-3 pb-3">
                <div className="relative pt-1 ml-1.5">
                    <div className="absolute left-[5px] top-2 bottom-2 w-px bg-border/60"/>

                    <div className="space-y-3">
                        {revisions.map((revision) => {
                                    const key = keyOf(revision);
                                    const isExpanded = expanded === key;
                                    const hasChanges = revision.changes.length > 0;
                                    const latest = latestFor(revisions, revision);
                                    const isCurrent = latest?.revision === revision.revision;
                                    const isRemoved = latest?.revisionType === RevisionType.Del;
                                    const isRestorable = !isCurrent && !isRemoved;

                                    return (
                                        <div key={key}
                                             className="relative flex items-start gap-3 text-[11px] text-muted-foreground">
                                            <div
                                                className="relative z-10 flex h-3 w-3 items-center justify-center bg-muted/30 ring-[3px] ring-muted/30">
                                                {REVISION_ICONS[revision.revisionType] ||
                                                    <History className="h-3 w-3"/>}
                                            </div>
                                            <div className="flex flex-1 flex-col gap-0.5 leading-tight">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="flex items-baseline gap-1.5 min-w-0">
                                                        <span
                                                            className="font-bold text-foreground/80 uppercase tracking-tight">
                                                            {t(`Common.revisionTypes.${revision.revisionType}`)}
                                                        </span>
                                                        {spansSeveralEntities && revision.entityLabel && (
                                                            <span
                                                                className="truncate rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                                                                {revision.entityLabel}
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span className="text-[10px] opacity-80">
                                                        {formatDateTime(revision.modifiedAt)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-foreground/60 italic">
                                                        {revision.modifiedBy || "-"}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        {hasChanges && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-5 px-1 text-[10px]"
                                                                onClick={() => setExpanded(isExpanded ? null : key)}
                                                            >
                                                                {isExpanded
                                                                    ? <ChevronDown className="h-3 w-3"/>
                                                                    : <ChevronRight className="h-3 w-3"/>}
                                                                {revision.changes.length}
                                                            </Button>
                                                        )}
                                                        {canRestore && restoreActions && isRestorable && (
                                                            <RestoreDialog
                                                                id={String(revision.entityId ?? id)}
                                                                type={revision.type}
                                                                revision={revision.revision}
                                                                actions={restoreActions}
                                                                onRestored={() => {
                                                                    load();
                                                                    onRestored?.();
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                </div>

                                                {isExpanded && (
                                                    <dl className="mt-1 space-y-0.5 rounded border border-border/60 bg-background/40 p-1.5">
                                                        {revision.changes.map((change, changeIndex) => (
                                                            <div key={`${change.field}-${changeIndex}`}
                                                                 className="flex flex-wrap items-baseline gap-1">
                                                                <dt className="font-medium text-foreground/70">{auditFieldLabel(t, ownerOf(revision, change).type, change.field)}:</dt>
                                                                <dd className="flex items-baseline gap-1">
                                                                    {change.binary ? (
                                                                        <span className="flex items-baseline gap-1">
                                                                            {change.oldValue && previousRevisionOf(revisions, revision, change)
                                                                                ? <AuditBinaryThumbnail
                                                                                    type={revision.type}
                                                                                    entityId={String(revision.entityId ?? id)}
                                                                                    revision={previousRevisionOf(revisions, revision, change)!}
                                                                                    field={change.field}/>
                                                                                : <span>{t("Audit.empty")}</span>}
                                                                            <span aria-hidden="true">→</span>
                                                                            {change.newValue
                                                                                ? <AuditBinaryThumbnail
                                                                                    type={revision.type}
                                                                                    entityId={String(revision.entityId ?? id)}
                                                                                    revision={revision.revision}
                                                                                    field={change.field}/>
                                                                                : <span>{t("Audit.empty")}</span>}
                                                                        </span>
                                                                    ) : (
                                                                        <>
                                                                            <span className="line-through opacity-70">
                                                                                {change.oldValue === null || change.oldValue === undefined
                                                                                    ? t("Audit.empty")
                                                                                    : auditFieldValue(t, ownerOf(revision, change).type, change.field, change.oldValue)}
                                                                            </span>
                                                                            <span aria-hidden="true">→</span>
                                                                            <span className="text-foreground/80">
                                                                                {change.newValue === null || change.newValue === undefined
                                                                                    ? t("Audit.empty")
                                                                                    : auditFieldValue(t, ownerOf(revision, change).type, change.field, change.newValue)}
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                </dd>
                                                            </div>
                                                        ))}
                                                    </dl>
                                                )}
                                            </div>
                                        </div>
                                    );
                        })}
                    </div>
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}
