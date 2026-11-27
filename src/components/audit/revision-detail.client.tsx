"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { AuditSource, RevisionDetail, RevisionEntityChange, RevisionType } from "@/gql/schema";
import { Badge } from "@bloomper/fgv-web-ui/ui/badge";
import { AuditDiff } from "@/components/audit/audit-diff.client";
import { auditEntityHref, auditTypeLabel, type SpexipediaLink } from "@/utils/audit";

const REVISION_ICONS = {
  [RevisionType.Add]: PlusCircle,
  [RevisionType.Mod]: Pencil,
  [RevisionType.Del]: Trash2,
};

const SOURCE_VARIANTS: Record<AuditSource, "secondary" | "outline" | "destructive"> = {
  [AuditSource.Web]: "secondary",
  [AuditSource.Import]: "outline",
  [AuditSource.Restore]: "destructive",
  [AuditSource.System]: "outline",
  [AuditSource.Mcp]: "outline",
};

const UNGROUPED = "__ungrouped__";

function groupByTarget(entities: RevisionEntityChange[]) {
  const groups = new Map<string, { target: RevisionEntityChange["target"]; entities: RevisionEntityChange[] }>();

  entities.forEach((entity) => {
    const key = entity.target ? `${entity.target.type}-${entity.target.id}` : UNGROUPED;
    const group = groups.get(key);

    if (group) {
      group.entities.push(entity);
    } else {
      groups.set(key, { target: entity.target, entities: [entity] });
    }
  });

  return [...groups.values()];
}

/**
 * Everything changed in a revision, grouped by the record it belongs to, noting when a type has more changes than
 * shown.
 */
export function RevisionDetailPanel({ detail, spexipedia }: { detail: RevisionDetail; spexipedia?: SpexipediaLink }) {
  const t = useTranslations();
  const groups = groupByTarget(detail.entities);
  const summary = detail.summary ?? [];
  const truncated = summary.filter((entry) => entry.count > entry.returned);
  const total = summary.reduce((sum, entry) => sum + Number(entry.count), 0);
  const limit = Math.max(0, ...truncated.map((entry) => entry.returned));

  return (
    <div className="bg-muted/20 flex flex-col gap-3 rounded-lg border p-3">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs">
        {detail.source && (
          <Badge
            variant={SOURCE_VARIANTS[detail.source]}
            className="text-xs tracking-wide uppercase sm:text-[10px]"
          >
            {t(`Audit.sources.${detail.source}`)}
          </Badge>
        )}
        {detail.comment && <span className="text-foreground/80">{detail.comment}</span>}
        {detail.operation && (
          <span className="text-muted-foreground font-mono text-xs sm:text-[10px]">{detail.operation}</span>
        )}
        {!detail.source && !detail.comment && !detail.operation && (
          <span className="text-muted-foreground">{t("Audit.originUnknown")}</span>
        )}
      </div>

      {truncated.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-xs">{t("Audit.bulkSummary", { count: total, limit })}</p>
          <div className="flex flex-wrap gap-1.5">
            {summary.map((entry) => (
              <Badge
                key={entry.type}
                variant="outline"
                className="gap-1 text-xs sm:text-[10px]"
              >
                <span className="font-semibold">{auditTypeLabel(t, entry.type)}</span>
                <span className="text-muted-foreground">
                  {entry.count > entry.returned
                    ? t("Audit.typeCount", { shown: entry.returned, count: Number(entry.count) })
                    : entry.count}
                </span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {groups.length === 0 && <p className="text-muted-foreground text-xs">{t("Audit.noChanges")}</p>}

      {groups.map((group, groupIndex) => (
        <div
          key={group.target ? `${group.target.type}-${group.target.id}` : `${UNGROUPED}-${groupIndex}`}
          className="flex flex-col gap-2"
        >
          {group.target && (
            <p className="text-muted-foreground text-xs">
              {t("Audit.partOfEdit", {
                type: auditTypeLabel(t, group.target.type),
                label: group.target.label || `#${group.target.id}`,
              })}
            </p>
          )}

          {group.entities.map((entity, entityIndex) => {
            const Icon = REVISION_ICONS[entity.revisionType];
            const href = auditEntityHref(group.target, entity.type, spexipedia);
            const external = href !== null && /^https?:\/\//.test(href);

            return (
              <div
                key={`${entity.type}-${entity.entityId}-${entityIndex}`}
                className="flex flex-col gap-1"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-[11px]">
                  <Icon className="text-muted-foreground h-3 w-3 shrink-0" />
                  <span className="text-foreground/80 font-semibold">{auditTypeLabel(t, entity.type)}</span>
                  {entity.entityLabel && (
                    <span className="text-muted-foreground min-w-0 truncate">{entity.entityLabel}</span>
                  )}
                  <Badge
                    variant="outline"
                    className="text-xs sm:text-[10px]"
                  >
                    {t(`Common.revisionTypes.${entity.revisionType}`)}
                  </Badge>
                  {href && (
                    <Link
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      aria-label={`${auditTypeLabel(t, entity.type)}: ${t("Audit.openRecord")}`}
                      className="text-link hover:text-link/80 ml-auto inline-flex items-center gap-1"
                    >
                      {t("Audit.openRecord")}
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>

                {entity.changes.length > 0 ? (
                  <AuditDiff
                    changes={entity.changes}
                    type={entity.type}
                    entityId={String(entity.entityId ?? "")}
                    revision={detail.revision}
                  />
                ) : (
                  <p className="text-muted-foreground text-xs sm:text-[11px]">
                    {entity.revisionType === RevisionType.Del ? t("Audit.recordRemoved") : t("Audit.noFieldChanges")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
