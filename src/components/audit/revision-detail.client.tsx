"use client";

import Link from "next/link";
import {useTranslations} from "next-intl";
import {ArrowUpRight, Pencil, PlusCircle, Trash2} from "lucide-react";
import {AuditSource, RevisionDetail, RevisionEntityChange, RevisionType} from "@/gql/schema";
import {Badge} from "@/components/ui/badge";
import {AuditDiff} from "@/components/audit/audit-diff.client";
import {auditEntityHref, auditTypeLabel} from "@/utils/audit";

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
};

const UNGROUPED = "__ungrouped__";

/** Everything changed in one transaction belongs together; the aggregate it belongs to is the why. */
function groupByTarget(entities: RevisionEntityChange[]) {
    const groups = new Map<string, { target: RevisionEntityChange["target"]; entities: RevisionEntityChange[] }>();

    entities.forEach((entity) => {
        const key = entity.target ? `${entity.target.type}-${entity.target.id}` : UNGROUPED;
        const group = groups.get(key);

        if (group) {
            group.entities.push(entity);
        } else {
            groups.set(key, {target: entity.target, entities: [entity]});
        }
    });

    return [...groups.values()];
}

export function RevisionDetailPanel({detail}: { detail: RevisionDetail }) {
    const t = useTranslations();
    const groups = groupByTarget(detail.entities);

    return (
        <div className="flex flex-col gap-3 rounded-lg border bg-muted/20 p-3">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs">
                {detail.source && (
                    <Badge variant={SOURCE_VARIANTS[detail.source]} className="text-[10px] uppercase tracking-wide">
                        {t(`Audit.sources.${detail.source}`)}
                    </Badge>
                )}
                {detail.comment && <span className="text-foreground/80">{detail.comment}</span>}
                {detail.operation && (
                    <span className="font-mono text-[10px] text-muted-foreground">{detail.operation}</span>
                )}
                {!detail.source && !detail.comment && !detail.operation && (
                    <span className="text-muted-foreground">{t("Audit.originUnknown")}</span>
                )}
            </div>

            {groups.length === 0 && (
                <p className="text-xs text-muted-foreground">{t("Audit.noChanges")}</p>
            )}

            {groups.map((group, groupIndex) => (
                <div key={group.target ? `${group.target.type}-${group.target.id}` : `${UNGROUPED}-${groupIndex}`}
                     className="flex flex-col gap-2">
                    {group.target && (
                        <p className="text-xs text-muted-foreground">
                            {t("Audit.partOfEdit", {
                                type: auditTypeLabel(t, group.target.type),
                                label: group.target.label || `#${group.target.id}`,
                            })}
                        </p>
                    )}

                    {group.entities.map((entity, entityIndex) => {
                        const Icon = REVISION_ICONS[entity.revisionType];
                        const href = auditEntityHref(group.target, entity.type);

                        return (
                            <div key={`${entity.type}-${entity.entityId}-${entityIndex}`}
                                 className="flex flex-col gap-1">
                                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                                    <Icon className="h-3 w-3 shrink-0 text-muted-foreground"/>
                                    <span className="font-semibold text-foreground/80">
                                        {auditTypeLabel(t, entity.type)}
                                    </span>
                                    {entity.entityLabel && (
                                        <span className="truncate text-muted-foreground">{entity.entityLabel}</span>
                                    )}
                                    <Badge variant="outline" className="text-[10px]">
                                        {t(`Common.revisionTypes.${entity.revisionType}`)}
                                    </Badge>
                                    {href && (
                                        <Link href={href}
                                              aria-label={`${auditTypeLabel(t, entity.type)}: ${t("Audit.openRecord")}`}
                                              className="ml-auto inline-flex items-center gap-1 text-primary hover:underline">
                                            {t("Audit.openRecord")}
                                            <ArrowUpRight className="h-3 w-3"/>
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
                                    <p className="text-[11px] text-muted-foreground">
                                        {entity.revisionType === RevisionType.Del
                                            ? t("Audit.recordRemoved")
                                            : t("Audit.noFieldChanges")}
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
