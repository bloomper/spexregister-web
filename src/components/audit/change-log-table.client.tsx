"use client";

import {Fragment, useState, useTransition} from "react";
import {useTranslations} from "next-intl";
import {ChevronDown, ChevronRight} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {AuditedType, AuditSource, RevisionDetail} from "@/gql/schema";
import {RevisionFeedPage} from "@/types/pagination";
import {formatDateTime} from "@/utils/utils";
import {auditTypeLabel} from "@/utils/audit";
import {getRevisionDetailAction, getRevisionFeedPageAction} from "@/app/(app)/change-log/actions.server";
import {RevisionDetailPanel} from "@/components/audit/revision-detail.client";
import {
    ALL_TYPES,
    ChangeLogFilter,
    ChangeLogFilters,
    EMPTY_FILTER,
} from "@/components/audit/change-log-filters.client";

const PAGE_SIZE = 15;
const COLUMN_COUNT = 5;

export function ChangeLogTable({initialData, authors}: { initialData: RevisionFeedPage; authors: string[] }) {
    const t = useTranslations();
    const [page, setPage] = useState(initialData);
    const [filter, setFilter] = useState<ChangeLogFilter>(EMPTY_FILTER);
    const [expanded, setExpanded] = useState<number | null>(null);
    const [details, setDetails] = useState<Record<number, RevisionDetail>>({});
    const [isPending, startTransition] = useTransition();
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    const load = (next: ChangeLogFilter, after: string | null) => {
        startTransition(async () => {
            const result = await getRevisionFeedPageAction({
                first: PAGE_SIZE,
                after,
                type: next.type === ALL_TYPES ? null : (next.type as AuditedType),
                modifiedBy: [...next.authors],
                sources: [...next.sources] as AuditSource[],
                from: next.from || null,
                to: next.to || null,
            });

            setPage((current) =>
                after
                    ? {
                        ...result,
                        items: [...current.items, ...result.items],
                        edges: [...current.edges, ...result.edges]
                    }
                    : result,
            );
        });
    };

    const handleFilterChange = (next: ChangeLogFilter) => {
        setFilter(next);
        setExpanded(null);
        load(next, null);
    };

    const toggle = (revision: number) => {
        if (expanded === revision) {
            setExpanded(null);
            return;
        }

        setExpanded(revision);

        if (details[revision]) {
            return;
        }

        setIsLoadingDetail(true);
        getRevisionDetailAction(revision)
            .then((detail) => detail && setDetails((current) => ({...current, [revision]: detail})))
            .catch((e) => console.error("Failed to load revision detail", e))
            .finally(() => setIsLoadingDetail(false));
    };

    return (
        <div className="flex flex-col gap-4">
            <ChangeLogFilters filter={filter} authors={authors} onChange={handleFilterChange}/>

            <p className="text-xs text-muted-foreground">
                {t("Audit.matchCount", {count: page.totalCount})}
            </p>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-8"/>
                        <TableHead className="w-20">#</TableHead>
                        <TableHead className="w-45">{t("Common.lastModifiedAt")}</TableHead>
                        <TableHead>{t("Common.lastModifiedBy")}</TableHead>
                        <TableHead className="hidden md:table-cell">{t("Audit.whatChanged")}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {page.items.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={COLUMN_COUNT} className="text-center text-muted-foreground">
                                {t("Common.noDataFound")}
                            </TableCell>
                        </TableRow>
                    )}
                    {page.items.map((entry) => {
                        const isExpanded = expanded === entry.revision;
                        const detail = details[entry.revision];

                        return (
                            <Fragment key={entry.revision}>
                                <TableRow
                                    className="cursor-pointer"
                                    onClick={() => toggle(entry.revision)}
                                >
                                    <TableCell>
                                        {/* The row is clickable for convenience; this is what makes
                                            it reachable by keyboard. */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-6 text-muted-foreground"
                                            aria-expanded={isExpanded}
                                            aria-label={t("Common.details")}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggle(entry.revision);
                                            }}
                                        >
                                            {isExpanded
                                                ? <ChevronDown className="h-4 w-4"/>
                                                : <ChevronRight className="h-4 w-4"/>}
                                        </Button>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{entry.revision}</TableCell>
                                    <TableCell>{formatDateTime(entry.modifiedAt)}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-0.5">
                                            <span>{entry.modifiedBy}</span>
                                            {entry.source && (
                                                <span
                                                    className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                                    {t(`Audit.sources.${entry.source}`)}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex flex-wrap gap-1">
                                                {entry.types.map((value) => (
                                                    <Badge key={value} variant="secondary">
                                                        {auditTypeLabel(t, value)}
                                                    </Badge>
                                                ))}
                                            </div>
                                            {entry.comment && (
                                                <span className="text-[11px] text-muted-foreground">
                                                    {entry.comment}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {isExpanded && (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={COLUMN_COUNT} className="p-3">
                                            {detail
                                                ? <RevisionDetailPanel detail={detail}/>
                                                : (
                                                    <div
                                                        className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        {isLoadingDetail && <Spinner className="size-4"/>}
                                                        {isLoadingDetail ? t("Common.loading") : t("Common.noDataFound")}
                                                    </div>
                                                )}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </Fragment>
                        );
                    })}
                </TableBody>
            </Table>

            {page.pageInfo.hasNextPage && (
                <div className="flex justify-center">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={() => load(filter, page.pageInfo.endCursor)}
                    >
                        {t("Common.loadMore")}
                    </Button>
                </div>
            )}
        </div>
    );
}
