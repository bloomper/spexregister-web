"use client";

import {ColumnDef} from "@tanstack/react-table";
import {CheckCircle2, Circle, Plus, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {News} from "@/gql/graphql";
import {formatDate} from "@/utils/utils";
import {useTranslations} from "next-intl";
import {DataTable} from "@/components/data-table.client";
import {NewsForm} from "@/components/news";
import {useEffect, useRef, useState} from "react";
import {
    bulkDeleteAction,
    deleteAction,
    exportAction,
    getEventsAction,
    getPageAction,
    importAction
} from "@/app/(app)/news/actions.server";
import {Sheet} from "@/components/ui/sheet";
import {CursorPage} from "@/types/pagination";
import {useRouter} from "next/navigation";
import {DataTableSkeleton} from "@/components/data-table-skeleton";
import {Input} from "@/components/ui/input";
import {DataFilter} from "@/components/data-filter";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {useDataTableActions} from "@/hooks/use-data-table-actions";
import {DataTableDeleteDialogs} from "@/components/data-table-delete-dialogs.client";
import {AuditInfo} from "@/components/data-table-audit-info.client";
import {columnHelper} from "@/components/data-table-columns.client";
import {AuditTrail} from "@/components/data-audit-trail.client";
import {ExportButton} from "@/components/impex/export-button.client";
import {ImportButton} from "@/components/impex/import-button.client";
import {useIsClient} from "@/hooks/use-is-client";


export const columns: ColumnDef<News>[] = [
    columnHelper.select(),
    columnHelper.text("subject", "News.subject"),
    columnHelper.boolean("published", "News.published"),
    columnHelper.date("visibleFrom", "News.visibleFrom", "visibleFrom", "hidden lg:table-cell"),
    columnHelper.date("visibleTo", "News.visibleTo", "visibleTo", "hidden xl:table-cell"),
    ...columnHelper.audit<News>(),
    columnHelper.actions<News>(),
];

export function NewsTable({
                              initialData,
                          }: {
    initialData: CursorPage<News>,
}) {
    const t = useTranslations();
    const router = useRouter();
    const isClient = useIsClient();
    const [filterQuery, setFilterQuery] = useState("");
    const [selectedPublishedValues, setSelectedPublishedValues] = useState<Set<string>>(new Set(["true", "false"]));
    const setFilterQueryRef = useRef<((filter: string) => void) | null>(null);

    const {
        viewItem, setViewItem,
        editItem, setEditItem,
        deleteItem, setDeleteItem,
        selectedRows, setSelectedRows,
        isBulkDeleting, setIsBulkDeleting,
        isPending,
        handleDelete,
        handleBulkDelete
    } = useDataTableActions<News>(
        deleteAction,
        bulkDeleteAction,
        () => {
            setFilterQuery("");
        }
    );

    const buildFilterString = (query: string, published: Set<string>) => {
        const parts: string[] = [];
        if (query) {
            parts.push(`subject:*${query}*`);
        }
        if (published.size < 2) {
            if (published.size === 0) {
                parts.push(`published:NULL`);
            } else {
                const val = published.has("true") ? "TRUE" : "FALSE";
                parts.push(`published:${val}`);
            }
        }
        return parts.join(" AND ");
    };

    const lastFilterQueryRef = useRef<string>(buildFilterString("", new Set(["true", "false"])));
    const isFilterActive = filterQuery !== "" || selectedPublishedValues.size < 2;

    useEffect(() => {
        const query = buildFilterString(filterQuery, selectedPublishedValues);

        const timer = setTimeout(() => {
            if (setFilterQueryRef.current && query !== lastFilterQueryRef.current) {
                lastFilterQueryRef.current = query;
                setFilterQueryRef.current(query);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [filterQuery, selectedPublishedValues]);

    if (!isClient) {
        return <DataTableSkeleton columnCount={7} rowCount={15}/>;
    }

    return (
        <>
            <DataTable
                columns={columns}
                initialData={initialData}
                initialSorting={[{id: "visibleFrom", desc: true}]}
                onRowClick={setViewItem}
                onSelectionChange={setSelectedRows}
                onFetch={(args) => getPageAction({...args, full: true})}
                meta={{
                    setEditItem,
                    setDeleteItem,
                    setFilter: (handler) => {
                        setFilterQueryRef.current = handler;
                    }
                }}
            >
                <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Input
                            placeholder={t("News.filterPlaceholder")}
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                            className="h-8 w-full sm:w-37.5 lg:w-62.5"
                        />

                        <div className="flex items-center gap-2">
                            <DataFilter
                                title={t("News.published")}
                                selectedValues={selectedPublishedValues}
                                onSelect={setSelectedPublishedValues}
                                onClear={() => setSelectedPublishedValues(new Set(["true", "false"]))}
                                options={[
                                    {label: t("News.publishedStates.true"), value: "true", icon: CheckCircle2},
                                    {label: t("News.publishedStates.false"), value: "false", icon: Circle},
                                ]}
                            />

                            {isFilterActive && (
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setFilterQuery("");
                                        setSelectedPublishedValues(new Set(["true", "false"]));
                                    }}
                                    className="h-8 px-2 lg:px-3"
                                >
                                    {t("Common.reset")}
                                    <X className="ml-2 h-4 w-4"/>
                                </Button>
                            )}

                            {selectedRows.length > 0 && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="h-8"
                                    onClick={() => setIsBulkDeleting(true)}
                                >
                                    {t("Common.delete")} ({selectedRows.length})
                                </Button>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <ExportButton
                                exportAction={exportAction}
                                selectedIds={selectedRows.map(r => r.id)}
                                getFilterQuery={() => lastFilterQueryRef.current}
                                requiresReportType={false}
                            />

                            <ImportButton importAction={importAction}/>
                        </div>
                    </div>

                    <Button asChild size="sm" className="h-8 w-full lg:w-auto">
                        <Link href="/news/create">
                            <Plus className="mr-2 h-4 w-4"/>
                            {t("News.createHeading")}
                        </Link>
                    </Button>
                </div>
            </DataTable>

            <Dialog open={!!viewItem} onOpenChange={(open) => !open && setViewItem(null)}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1">
                            <div>{viewItem?.visibleFrom ? formatDate(viewItem.visibleFrom) : ''}</div>
                            {viewItem && (
                                <>
                                    <div className="h-3 w-px bg-border"/>
                                    <div className="flex items-center gap-1.5">
                                        {viewItem.published ? (
                                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500"/>
                                        ) : (
                                            <Circle className="h-3.5 w-3.5"/>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                        <DialogTitle className="text-xl pr-6">{viewItem?.subject}</DialogTitle>
                        <DialogDescription className="sr-only">
                            {t("Common.details")}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                        <div className="whitespace-pre-wrap text-sm text-foreground max-h-[50vh] overflow-y-auto">
                            {viewItem?.text}
                        </div>

                        {viewItem && (
                            <div className="space-y-4">
                                <AuditInfo item={viewItem}/>
                                <AuditTrail id={viewItem.id} fetchAction={getEventsAction}/>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setViewItem(null)}>
                            {t("Common.close")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Sheet open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
                {editItem && (
                    <NewsForm
                        item={editItem}
                        onSuccess={() => {
                            setEditItem(null);
                            setFilterQuery("");
                            setSelectedPublishedValues(new Set(["true", "false"]))
                            router.refresh();
                        }}
                    />
                )}
            </Sheet>

            <DataTableDeleteDialogs
                deleteItem={deleteItem}
                setDeleteItem={setDeleteItem}
                isBulkDeleting={isBulkDeleting}
                setIsBulkDeleting={setIsBulkDeleting}
                isPending={isPending}
                handleDelete={handleDelete}
                handleBulkDelete={handleBulkDelete}
            />
        </>
    );
}
