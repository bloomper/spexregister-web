"use client";

import {ColumnDef} from "@tanstack/react-table";
import {Plus, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Task, TaskCategory} from "@/gql/graphql";
import {useTranslations} from "next-intl";
import {DataTable} from "@/components/data-table.client";
import {TaskForm} from "@/components/task";
import {useEffect, useRef, useState} from "react";
import {
    bulkDeleteAction,
    deleteAction,
    exportAction,
    getEventsAction,
    getPageAction,
    importAction
} from "@/app/(app)/tasks/actions.server";
import {Sheet} from "@/components/ui/sheet";
import {CursorPage} from "@/types/pagination";
import {useRouter} from "next/navigation";
import {DataTableSkeleton} from "@/components/data-table-skeleton";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {DataFilter} from "@/components/data-filter";
import {useDataTableActions} from "@/hooks/use-data-table-actions";
import {DataTableDeleteDialogs} from "@/components/data-table-delete-dialogs.client";
import {AuditInfo} from "@/components/data-table-audit-info.client";
import {columnHelper} from "@/components/data-table-columns.client";
import {AuditTrail} from "@/components/data-audit-trail.client";
import {ExportButton} from "@/components/impex/export-button.client";
import {ImportButton} from "@/components/impex/import-button.client";


export const columns: ColumnDef<Task>[] = [
    columnHelper.select(),
    columnHelper.text("name", "Task.name"),
    columnHelper.text("categoryName", "Task.category", "category.name", "hidden md:table-cell"),
    ...columnHelper.audit<Task>(),
    columnHelper.actions<Task>(),
];

export function TaskTable({
                              initialData,
                              categories,
                          }: {
    initialData: CursorPage<Task>,
    categories: TaskCategory[],
}) {
    const t = useTranslations();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [filterQuery, setFilterQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
        new Set([...categories.map(c => c.id), "none"])
    );
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
    } = useDataTableActions<Task>(
        deleteAction,
        bulkDeleteAction,
        () => {
            setFilterQuery("");
            setSelectedCategories(new Set([...categories.map(c => c.id), "none"]));
        }
    );

    useEffect(() => {
        setMounted(true);
    }, []);

    const buildFilterString = (query: string, selectedCategories: Set<string>, categories: TaskCategory[]) => {
        const parts: string[] = [];
        if (query) {
            parts.push(`(name:*${query}*)`);
        }

        const totalOptionCount = categories.length + 1;

        if (selectedCategories.size < totalOptionCount) {
            if (selectedCategories.size === 0) {
                parts.push(`id:NULL`);
            } else {
                const categoryParts: string[] = [];
                selectedCategories.forEach(id => {
                    if (id === "none") {
                        categoryParts.push(`category:NULL`);
                    } else {
                        categoryParts.push(`category.id:${id}`);
                    }
                });
                parts.push(`(${categoryParts.join(" OR ")})`);
            }
        }
        return parts.join(" AND ");
    };

    const totalOptionCount = categories.length + 1;
    const lastFilterQueryRef = useRef<string>(buildFilterString("", new Set([...categories.map(c => c.id), "none"]), categories));
    const isFilterActive = filterQuery !== "" || selectedCategories.size !== totalOptionCount;

    useEffect(() => {
        const query = buildFilterString(filterQuery, selectedCategories, categories);

        const timer = setTimeout(() => {
            if (setFilterQueryRef.current && query !== lastFilterQueryRef.current) {
                lastFilterQueryRef.current = query;
                setFilterQueryRef.current(query);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [filterQuery, selectedCategories, categories]);

    if (!mounted) {
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
                    setFilter: (fn: any) => {
                        setFilterQueryRef.current = typeof fn === 'function' && fn.length === 0 ? fn() : fn;
                    },
                }}
            >
                <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Input
                            placeholder={t("Task.filterPlaceholder")}
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                            className="h-8 w-full sm:w-[150px] lg:w-[250px]"
                        />

                        <div className="flex items-center gap-2">
                            {categories.length > 0 && (
                                <DataFilter
                                    title={t("Task.category")}
                                    options={[
                                        ...categories.map((c) => ({
                                            label: c.name,
                                            value: c.id,
                                        })),
                                        {label: t("Common.none"), value: "none"}
                                    ]}
                                    selectedValues={selectedCategories}
                                    onSelect={setSelectedCategories}
                                    onClear={() => setSelectedCategories(new Set([...categories.map(c => c.id), "none"]))}
                                />
                            )}

                            {isFilterActive && (
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setFilterQuery("");
                                        setSelectedCategories(new Set([...categories.map(c => c.id), "none"]));
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
                                filterQuery={lastFilterQueryRef.current}
                                requiresReportType={false}
                            />

                            <ImportButton importAction={importAction}/>
                        </div>
                    </div>

                    <Button asChild size="sm" className="h-8 w-full lg:w-auto">
                        <Link href="/tasks/create">
                            <Plus className="mr-2 h-4 w-4"/>
                            {t("Task.createHeading")}
                        </Link>
                    </Button>
                </div>
            </DataTable>

            <Dialog open={!!viewItem} onOpenChange={(open) => !open && setViewItem(null)}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl pr-6">{viewItem?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                        <div className="grid gap-6">
                            {viewItem?.category && (
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("Task.category")}</p>
                                    <p className="text-sm">{viewItem.category.name}</p>
                                </div>
                            )}
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
                    <TaskForm
                        item={editItem}
                        categories={categories}
                        onSuccess={() => {
                            setEditItem(null);
                            setFilterQuery("");
                            setSelectedCategories(new Set(categories.map(c => c.id)));
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