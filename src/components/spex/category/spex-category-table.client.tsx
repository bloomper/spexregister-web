"use client";

import {ColumnDef} from "@tanstack/react-table";
import {Image as ImageIcon, Plus, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {SpexCategory} from "@/gql/graphql";
import {getProxiedImageUrl} from "@/utils/utils";
import {useTranslations} from "next-intl";
import {DataTable} from "@/components/data-table.client";
import {SpexCategoryForm} from "@/components/spex/category";
import {useEffect, useRef, useState} from "react";
import {
    bulkDeleteAction,
    deleteAction,
    exportAction,
    getEventsAction,
    getPageAction,
    importAction
} from "@/app/(app)/spex/categories/actions.server";
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
import Image from "next/image";
import {DataTableDeleteDialogs} from "@/components/data-table-delete-dialogs.client";
import {AuditInfo} from "@/components/data-table-audit-info.client";
import {columnHelper} from "@/components/data-table-columns.client";
import {AuditTrail} from "@/components/data-audit-trail.client";
import {ExportButton} from "@/components/impex/export-button.client";
import {ImportButton} from "@/components/impex/import-button.client";

export const columns: ColumnDef<SpexCategory>[] = [
    columnHelper.select<SpexCategory>(),
    columnHelper.text<SpexCategory>("name", "Spex.Category.name"),
    ...columnHelper.audit<SpexCategory>(),
    columnHelper.actions<SpexCategory>(),
];

export function SpexCategoryTable({
                                      initialData,
                                  }: {
    initialData: CursorPage<SpexCategory>,
}) {
    const t = useTranslations();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
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
    } = useDataTableActions<SpexCategory>(
        deleteAction,
        bulkDeleteAction,
        () => {
            setFilterQuery("");
        }
    );

    useEffect(() => {
        setMounted(true);
    }, []);

    const buildFilterString = (query: string) => {
        const parts: string[] = [];
        if (query) {
            parts.push(`(name:*${query}* OR firstYear:*${query}*)`);
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

    if (!mounted) {
        return <DataTableSkeleton columnCount={7} rowCount={15}/>;
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
                            placeholder={t("Spex.Category.filterPlaceholder")}
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                            className="h-8 w-full sm:w-[150px] lg:w-[250px]"
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
                                filterQuery={lastFilterQueryRef.current}
                                requiresReportType={false}
                            />

                            <ImportButton importAction={importAction}/>
                        </div>
                    </div>

                    <Button asChild size="sm" className="h-8 w-full lg:w-auto">
                        <Link href="/spex/categories/create">
                            <Plus className="mr-2 h-4 w-4"/>
                            {t("Spex.Category.createHeading")}
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
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("Spex.Category.firstYear")}</p>
                                <p className="text-sm">{viewItem?.firstYear}</p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("Spex.Category.logoUrl")}</p>
                                <div
                                    className="w-32 h-32 overflow-hidden rounded-lg border bg-muted p-2 flex items-center justify-center relative">
                                    {viewItem?.logoUrl ? (
                                        <Image
                                            src={getProxiedImageUrl(viewItem.logoUrl, viewItem.lastModifiedAt)}
                                            alt={viewItem.name}
                                            fill
                                            unoptimized
                                            className="h-full w-full object-contain p-2"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center gap-1 text-muted-foreground/60">
                                            <ImageIcon className="h-10 w-10 stroke-[1.5]"/>
                                        </div>
                                    )}
                                </div>
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
                    <SpexCategoryForm
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