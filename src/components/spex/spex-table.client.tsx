"use client";

import {ColumnDef} from "@tanstack/react-table";
import {ArrowDown, ArrowUp, ArrowUpDown, Image as ImageIcon, Plus, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Spex, SpexCategory} from "@/gql/graphql";
import {getProxiedImageUrl} from "@/utils/utils";
import {useTranslations} from "next-intl";
import {DataTable} from "@/components/data-table.client";
import {SpexForm} from "@/components/spex";
import {useEffect, useRef, useState} from "react";
import {bulkDeleteAction, deleteAction, getPageAction} from "@/app/(app)/spex/actions.server";
import {Sheet} from "@/components/ui/sheet";
import {CursorPage} from "@/types/pagination";
import {useRouter} from "next/navigation";
import {DataTableSkeleton} from "@/components/data-table-skeleton";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {DataFilter} from "@/components/data-filter";
import {Badge} from "@/components/ui/badge";
import {useDataTableActions} from "@/hooks/use-data-table-actions";
import {Translated} from "@/components/translated.client";
import Image from "next/image";
import {DataTableDeleteDialogs} from "@/components/data-table-delete-dialogs.client";
import {AuditInfo} from "@/components/data-table-audit-info.client";
import {columnHelper} from "@/components/data-table-columns.client";


export const columns: ColumnDef<Spex>[] = [
    columnHelper.select(),
    {
        id: "year",
        accessorKey: "year",
        header: ({column}) => {
            const isSorted = column.getIsSorted();
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="-ml-4 h-8 data-[state=open]:bg-accent"
                >
                    <Translated id="Spex.year"/>
                    {isSorted === "desc" ? (
                        <ArrowDown className="ml-2 h-4 w-4"/>
                    ) : isSorted === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4"/>
                    ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4"/>
                    )}
                </Button>
            );
        },
        cell: ({row}) => {
            const year = row.getValue("year") as string;
            const revivals = row.original.revivals?.filter(r => r !== null) ?? [];

            return (
                <div className="flex items-center gap-2 font-medium">
                    {year}
                    {revivals.length > 0 && (
                        <span
                            className="inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary ring-1 ring-inset ring-primary/20">
                            +{revivals.length}
                        </span>
                    )}
                </div>
            );
        },
    },
    columnHelper.text("title", "Spex.title", "title"),
    columnHelper.image("poster", "Spex.posterUrl", "posterUrl", ImageIcon),
    {
        id: "categoryName",
        accessorKey: "category.name",
        header: ({column}) => {
            const isSorted = column.getIsSorted();
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="-ml-4 h-8 data-[state=open]:bg-accent"
                >
                    <Translated id="Spex.category"/>
                    {isSorted === "desc" ? (
                        <ArrowDown className="ml-2 h-4 w-4"/>
                    ) : isSorted === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4"/>
                    ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4"/>
                    )}
                </Button>
            );
        },
        cell: ({row}) => row.original.category?.name || "-",
        meta: {
            sortKey: "details.category.name",
            className: "hidden md:table-cell"
        }
    },
    ...columnHelper.audit<Spex>(),
    columnHelper.actions<Spex>(),
];

export function SpexTable({
                              initialData,
                              categories,
                          }: {
    initialData: CursorPage<Spex>,
    categories: SpexCategory[],
}) {
    const t = useTranslations();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [filterQuery, setFilterQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
        new Set(categories.map(c => c.id))
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
    } = useDataTableActions<Spex>(
        deleteAction,
        bulkDeleteAction,
        () => {
            setFilterQuery("");
            setSelectedCategories(new Set(categories.map(c => c.id)));
        }
    );

    useEffect(() => {
        setMounted(true);
    }, []);

    const buildFilterString = (query: string, selectedCategories: Set<string>, categories: SpexCategory[]) => {
        const parts: string[] = ["parent:NULL"];
        if (query) {
            parts.push(`(year:*${query}* OR details.title:*${query}*)`);
        }
        if (categories.length > 0 && selectedCategories.size < categories.length) {
            const categoryFilters = Array.from(selectedCategories)
                .map(id => `details.category.id:${id}`)
                .join(" OR ");
            parts.push(`(${categoryFilters})`);
        }
        return parts.join(" AND ");
    };

    const lastFilterQueryRef = useRef<string>(buildFilterString("", new Set(categories.map(c => c.id)), categories));
    const isFilterActive = filterQuery !== "" || selectedCategories.size !== categories.length;

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
        return <DataTableSkeleton columnCount={8} rowCount={15}/>;
    }

    return (
        <>
            <DataTable
                columns={columns}
                initialData={initialData}
                initialSorting={[{id: "year", desc: true}]}
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
                            placeholder={t("Spex.filterPlaceholder")}
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                            className="h-8 w-full sm:w-[150px] lg:w-[250px]"
                        />

                        <div className="flex items-center gap-2">
                            {categories.length > 0 && (
                                <DataFilter
                                    title={t("Spex.category")}
                                    options={categories.map((c) => ({
                                        label: c.name,
                                        value: c.id,
                                    }))}
                                    selectedValues={selectedCategories}
                                    onSelect={setSelectedCategories}
                                    onClear={() => setSelectedCategories(new Set(categories.map(c => c.id)))}
                                />
                            )}

                            {isFilterActive && (
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setFilterQuery("");
                                        setSelectedCategories(new Set(categories.map(c => c.id)));
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
                    </div>

                    <Button asChild size="sm" className="h-8 w-full lg:w-auto">
                        <Link href="/spex/create">
                            <Plus className="mr-2 h-4 w-4"/>
                            {t("Spex.createHeading")}
                        </Link>
                    </Button>
                </div>
            </DataTable>

            <Dialog open={!!viewItem} onOpenChange={(open) => !open && setViewItem(null)}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl pr-6">{viewItem?.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                        <div className="grid gap-6">
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("Spex.year")}</p>
                                <p className="text-sm">{viewItem?.year}</p>
                            </div>

                            {viewItem?.revivals && viewItem.revivals.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("Spex.revivals")}</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {[...viewItem.revivals]
                                            .filter((r) => r !== null && r !== undefined)
                                            .sort((a, b) => Number(a.year) - Number(b.year))
                                            .map((revival) => (
                                                <Badge key={revival.id} variant="secondary" className="text-xs">
                                                    {revival.year}
                                                </Badge>
                                            ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("Spex.posterUrl")}</p>
                                <div
                                    className="w-32 h-32 overflow-hidden rounded-lg border bg-muted p-2 flex items-center justify-center relative">
                                    {viewItem?.posterUrl ? (
                                        <Image
                                            src={getProxiedImageUrl(viewItem.posterUrl, viewItem.lastModifiedAt)}
                                            alt={viewItem.title}
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

                            {viewItem?.category && (
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("Spex.category")}</p>
                                    <p className="text-sm">{viewItem.category.name}</p>
                                </div>
                            )}
                        </div>

                        {viewItem && (
                            <AuditInfo item={viewItem}/>
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
                    <SpexForm
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