"use client";

import {useState, useTransition} from "react";
import {useTranslations} from "next-intl";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {AuditedType} from "@/gql/schema";
import {RevisionFeedPage} from "@/types/pagination";
import {formatDateTime} from "@/utils/utils";
import {getRevisionFeedPageAction} from "@/app/(app)/change-log/actions.server";

const ALL = "ALL";
const PAGE_SIZE = 15;

export function ChangeLogTable({initialData}: { initialData: RevisionFeedPage }) {
    const t = useTranslations();
    const [page, setPage] = useState(initialData);
    const [type, setType] = useState<string>(ALL);
    const [isPending, startTransition] = useTransition();

    const load = (nextType: string, after: string | null) => {
        startTransition(async () => {
            const result = await getRevisionFeedPageAction({
                first: PAGE_SIZE,
                after,
                type: nextType === ALL ? null : (nextType as AuditedType),
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

    const handleTypeChange = (next: string) => {
        setType(next);
        load(next, null);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <Select value={type} onValueChange={handleTypeChange}>
                    <SelectTrigger className="h-8 w-full sm:w-62.5">
                        <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>{t("Audit.allTypes")}</SelectItem>
                        {Object.values(AuditedType).map((value) => (
                            <SelectItem key={value} value={value}>{value}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-25">#</TableHead>
                        <TableHead className="w-50">{t("Common.lastModifiedAt")}</TableHead>
                        <TableHead>{t("Common.lastModifiedBy")}</TableHead>
                        <TableHead className="hidden md:table-cell">{t("Audit.title")}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {page.items.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground">
                                {t("Common.noDataFound")}
                            </TableCell>
                        </TableRow>
                    )}
                    {page.items.map((entry) => (
                        <TableRow key={entry.revision}>
                            <TableCell className="font-mono text-xs">{entry.revision}</TableCell>
                            <TableCell>{formatDateTime(entry.modifiedAt)}</TableCell>
                            <TableCell>{entry.modifiedBy}</TableCell>
                            <TableCell className="hidden md:table-cell">
                                <div className="flex flex-wrap gap-1">
                                    {entry.types.map((value) => (
                                        <Badge key={value} variant="secondary">{value}</Badge>
                                    ))}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {page.pageInfo.hasNextPage && (
                <div className="flex justify-center">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={() => load(type, page.pageInfo.endCursor)}
                    >
                        {t("Common.loadMore")}
                    </Button>
                </div>
            )}
        </div>
    );
}
