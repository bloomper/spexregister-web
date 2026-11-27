"use client";

import { useCallback, useEffect, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@bloomper/fgv-web-ui/ui/collapsible";
import { Button } from "@bloomper/fgv-web-ui/ui/button";
import { ChevronDown, ChevronRight, ChevronUp, History, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { FieldChange, Revision, RevisionType } from "@/gql/schema";
import { useTranslations } from "next-intl";
import { formatDateTime } from "@/utils/utils";
import { AuditDiff } from "@/components/audit/audit-diff.client";
import { RestoreActions, RestoreDialog } from "@/components/audit/restore-dialog.client";
import { useRoles } from "@/components/roles-provider.client";
import { isAdmin } from "@/utils/auth";

function ownerOf(revision: Revision, change: FieldChange) {
  return {
    type: change.type ?? revision.type,
    entityId: String(change.entityId ?? revision.entityId ?? ""),
  };
}

function keyOf(revision: Revision): string {
  return `${revision.type}-${revision.entityId}-${revision.revision}`;
}

function latestFor(revisions: Revision[], revision: Revision): Revision | null {
  return revisions
    .filter((candidate) => candidate.type === revision.type && candidate.entityId === revision.entityId)
    .reduce<Revision | null>(
      (newest, candidate) => (!newest || candidate.revision > newest.revision ? candidate : newest),
      null
    );
}

function previousRevisionOf(revisions: Revision[], revision: Revision, change: FieldChange): number | null {
  const owner = ownerOf(revision, change);
  const older = revisions
    .filter((candidate) => candidate.revision < revision.revision)
    .filter((candidate) =>
      candidate.changes.some(
        (other) =>
          other.field === change.field &&
          ownerOf(candidate, other).type === owner.type &&
          ownerOf(candidate, other).entityId === owner.entityId
      )
    );

  return older.length > 0 ? Math.max(...older.map((candidate) => candidate.revision)) : null;
}

const REVISION_ICONS = {
  [RevisionType.Add]: <PlusCircle className="h-3 w-3 text-green-600/80" />,
  [RevisionType.Mod]: <Pencil className="h-3 w-3 text-blue-600/80" />,
  [RevisionType.Del]: <Trash2 className="text-destructive/80 h-3 w-3" />,
};

interface AuditTrailProps {
  id: string;
  fetchAction: (id: string) => Promise<Revision[]>;
  restoreActions?: RestoreActions;
  fields?: string[];
  onRestored?: () => void;
}

/**
 * A record's history, loaded when opened: each revision's changes, limited to `fields` when given, and for
 * administrators a way to restore one.
 */
export function AuditTrail({ id, fetchAction, restoreActions, fields, onRestored }: AuditTrailProps) {
  const t = useTranslations();
  const canRestore = isAdmin(useRoles());
  const [isOpen, setIsOpen] = useState(false);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const spansSeveralEntities = new Set(revisions.map((entry) => `${entry.type}-${entry.entityId}`)).size > 1;

  const fieldsKey = fields?.join(",");

  const load = useCallback(() => {
    let cancelled = false;

    fetchAction(id)
      .then((all) => {
        const data = fields
          ? all
              .map((entry) => ({
                ...entry,
                changes: entry.changes.filter((change) => fields.includes(change.field)),
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
  }, [id, fieldsKey]);

  useEffect(() => load(), [load]);

  if (!hasLoaded || revisions.length === 0) {
    return null;
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="bg-muted/30 w-full rounded-lg border shadow-sm"
    >
      <CollapsibleTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-muted/50 flex h-auto w-full items-center justify-between px-3 py-2 transition-colors"
          />
        }
      >
        <div className="text-foreground/70 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase sm:text-[11px]">
          <History className="text-muted-foreground h-3.5 w-3.5" />
          <span>{t("Common.history")}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="text-muted-foreground h-3.5 w-3.5" />
        ) : (
          <ChevronDown className="text-muted-foreground h-3.5 w-3.5" />
        )}
      </CollapsibleTrigger>

      <CollapsibleContent className="px-3 pb-3">
        <div className="relative ml-1.5 pt-1">
          <div className="bg-border/60 absolute top-2 bottom-2 left-[5px] w-px" />

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
                <div
                  key={key}
                  className="text-muted-foreground relative flex items-start gap-3 text-xs sm:text-[11px]"
                >
                  <div className="bg-muted/30 ring-muted/30 relative z-10 flex h-3 w-3 items-center justify-center ring-[3px]">
                    {REVISION_ICONS[revision.revisionType] || <History className="h-3 w-3" />}
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5 leading-tight">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex min-w-0 items-baseline gap-1.5">
                        <span className="text-foreground/80 font-bold tracking-tight uppercase">
                          {t(`Common.revisionTypes.${revision.revisionType}`)}
                        </span>
                        {spansSeveralEntities && revision.entityLabel && (
                          <span className="bg-muted text-muted-foreground truncate rounded px-1.5 py-0.5 text-xs font-medium sm:text-[10px]">
                            {revision.entityLabel}
                          </span>
                        )}
                      </span>
                      <span className="text-xs opacity-80 sm:text-[10px]">{formatDateTime(revision.modifiedAt)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-foreground/60 italic">{revision.modifiedBy || "-"}</span>
                      <div className="flex items-center gap-1">
                        {hasChanges && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 px-1 text-xs sm:text-[10px]"
                            onClick={() => setExpanded(isExpanded ? null : key)}
                          >
                            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
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
                      <AuditDiff
                        className="mt-1"
                        changes={revision.changes}
                        type={revision.type}
                        entityId={String(revision.entityId ?? id)}
                        revision={revision.revision}
                        previousRevisionOf={(change) => previousRevisionOf(revisions, revision, change)}
                      />
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
