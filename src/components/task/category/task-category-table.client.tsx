"use client";

import {ColumnDef} from "@tanstack/react-table";
import {Plus, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {TaskCategory} from "@/gql/graphql";
import {useTranslations} from "next-intl";
import {DataTable} from "@/components/data-table.client";
import {TaskCategoryForm} from "@/components/task/category";
import {useEffect, useRef, useState} from "react";
import {
    bulkDeleteAction,
    deleteAction,
    exportAction,
    getEventsAction,
    getPageAction,
    importAction
} from "@/app/(app)/tasks/categories/actions.server";
import {Sheet} from "@/components/ui/sheet";
import {CursorPage} from "@/types/pagination";
import {useRouter} from "next/navigation";
import {DataTableSkeleton} from "@/components/data-table-skeleton";
import {Input} from "@/components/ui/input";
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

export const columns: ColumnDef<TaskCategory>[] = [
    columnHelper.select(),
    columnHelper.text("name", "Task.Category.name"),
    ...columnHelper.audit<TaskCategory>(),
    columnHelper.actions<TaskCategory>(),
];

export function TaskCategoryTable({
                                      initialData,
                                  }: {
    initialData: CursorPage<TaskCategory>,
}) {
    const t = useTranslations();
    const router = useRouter();
    const isClient = useIsClient();
    const [filterQuery, setFilterQuery] = useState("");
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
    } = useDataTableActions<TaskCategory>(
        deleteAction,
        bulkDeleteAction,
        () => {
            setFilterQuery("");
        }
    );

    const buildFilterString = (query: string) => {
        const parts: string[] = [];
        if (query) {
            parts.push(`(name:*${query}*)`);
        }
        return parts.join("");
    };

    const lastFilterQueryRef = useRef<string>(buildFilterString(""));
    const isFilterActive = filterQuery !== "";

    useEffect(() => {
        const query = buildFilterString(filterQuery);

        const timer = setTimeout(() => {
            if (setFilterQueryRef.current && query !== lastFilterQueryRef.current) {
                lastFilterQueryRef.current = query;
                setFilterQueryRef.current(query);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [filterQuery]);

    if (!isClient) {
        return <DataTableSkeleton columnCount={6} rowCount={15}/>;
    }

    return (
        <>
            <DataTable
                columns={columns}
                initialData={initialData}
                initialSorting={[{id: "name", desc: false}]}
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
                            placeholder={t("Task.Category.filterPlaceholder")}
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                            className="h-8 w-full sm:w-37.5 lg:w-62.5"
                        />

                        <div className="flex items-center gap-2">
                            {isFilterActive && (
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setFilterQuery("");
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
                        <Link href="/tasks/categories/create">
                            <Plus className="mr-2 h-4 w-4"/>
                            {t("Task.Category.createHeading")}
                        </Link>
                    </Button>
                </div>
            </DataTable>

            <Dialog open={!!viewItem} onOpenChange={(open) => !open && setViewItem(null)}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl pr-6">{viewItem?.name}</DialogTitle>
                        <DialogDescription className="sr-only">
                            {t("Common.details")}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                        <div className="grid gap-6">
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("Task.Category.actorPresent")}</p>
                                <p className="text-sm">{viewItem?.actorPresent ? t("Common.yes") : t("Common.no")}</p>
                            </div>
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
                    <TaskCategoryForm
                        item={editItem}
                        onSuccess={() => {
                            setEditItem(null);
                            setFilterQuery("");
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
