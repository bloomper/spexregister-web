"use client";

import {ColumnDef} from "@tanstack/react-table";
import {ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal, Plus, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Tag} from "@/gql/graphql";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {formatDateTime} from "@/utils/utils";
import {useTranslations} from "next-intl";
import {DataTable} from "@/components/data-table.client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {TagForm} from "@/components/tag";
import {useEffect, useRef, useState} from "react";
import {bulkDeleteAction, deleteAction, getPageAction} from "@/app/(app)/tags/actions.server";
import {Sheet} from "@/components/ui/sheet";
import {CursorPage} from "@/types/pagination";
import {useRouter} from "next/navigation";
import {DataTableSkeleton} from "@/components/data-table-skeleton";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Checkbox} from "@/components/ui/checkbox";
import {useDataTableActions} from "@/hooks/use-data-table-actions";
import {Translated} from "@/components/translated.client";


export const columns: ColumnDef<Tag>[] = [
    {
        id: "select",
        header: ({table}) => {
            const t = useTranslations();
            return (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label={t("Common.selectAll")}
                />
            );
        },
        cell: ({row}) => {
            const t = useTranslations();
            return (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.stopPropagation();
                        }
                    }}
                    aria-label={t("Common.select")}
                />
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "name",
        accessorKey: "name",
        header: ({column}) => {
            const isSorted = column.getIsSorted();
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="-ml-4 h-8 data-[state=open]:bg-accent"
                >
                    <Translated id="Tag.name"/>
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
            const name = row.getValue("name") as string;

            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="max-w-[300px] truncate font-medium cursor-default">
                                {name}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[400px] wrap-break-word">
                            {name}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
    },
    {
        id: "createdAt",
        accessorKey: "createdAt",
        header: ({column}) => {
            const isSorted = column.getIsSorted();
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="-ml-4 h-8 data-[state=open]:bg-accent"
                >
                    <Translated id="Common.createdAt"/>
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
        cell: ({row}) => formatDateTime(row.getValue("createdAt") as string) || "-",
        meta: {className: "hidden xl:table-cell"}
    },
    {
        id: "lastModifiedAt",
        accessorKey: "lastModifiedAt",
        header: ({column}) => {
            const isSorted = column.getIsSorted();
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="-ml-4 h-8 data-[state=open]:bg-accent"
                >
                    <Translated id="Common.lastModifiedAt"/>
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
        cell: ({row}) => formatDateTime(row.getValue("lastModifiedAt") as string) || "-",
        meta: {className: "hidden xl:table-cell"}
    },
    {
        id: "actions",
        cell: ({row, table}) => {
            const item = row.original;
            const t = useTranslations();

            const meta = table.options.meta as any;

            return (
                <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">{t("Common.openMenu")}</span>
                                <MoreHorizontal className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => meta?.setEditItem(item)}>
                                {t("Common.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-destructive"
                                onSelect={() => meta?.setDeleteItem(item)}
                            >
                                {t("Common.delete")}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];

export function TagTable({
                             initialData,
                         }: {
    initialData: CursorPage<Tag>,
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
    } = useDataTableActions<Tag>(
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
            parts.push(`name:*${query}*`);
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
        return <DataTableSkeleton columnCount={4} rowCount={15}/>;
    }

    return (
        <>
            <DataTable
                columns={columns}
                initialData={initialData}
                initialSorting={[{id: "name", desc: true}]}
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
                            placeholder={t("Tag.filterPlaceholder")}
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
                    </div>

                    <Button asChild size="sm" className="h-8 w-full lg:w-auto">
                        <Link href="/tags/create">
                            <Plus className="mr-2 h-4 w-4"/>
                            {t("Tag.createHeading")}
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
                        {viewItem && (
                            <div
                                className="grid grid-cols-2 gap-4 rounded-lg border bg-muted/30 p-3 text-[11px] text-muted-foreground">
                                <div className="space-y-1">
                                    <p className="font-semibold text-foreground/70 uppercase tracking-wider">{t("Common.createdAt")}</p>
                                    <p>{formatDateTime(viewItem.createdAt)} ({viewItem.createdBy})</p>
                                </div>
                                {viewItem.lastModifiedAt && (
                                    <div className="space-y-1">
                                        <p className="font-semibold text-foreground/70 uppercase tracking-wider">{t("Common.lastModifiedAt")}</p>
                                        <p>{formatDateTime(viewItem.lastModifiedAt)} ({viewItem.lastModifiedBy})</p>
                                    </div>
                                )}
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
                    <TagForm
                        item={editItem}
                        onSuccess={() => {
                            setEditItem(null);
                            setFilterQuery("");
                            router.refresh();
                        }}
                    />
                )}
            </Sheet>

            <AlertDialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("Common.deleteHeading")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t("Common.deleteConfirmation")}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>{t("Common.cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            disabled={isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isPending ? t("Common.deleting") : t("Common.delete")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={isBulkDeleting} onOpenChange={setIsBulkDeleting}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("Common.deleteBulkHeading")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t("Common.deleteBulkConfirmation")}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>{t("Common.cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleBulkDelete();
                            }}
                            disabled={isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isPending ? t("Common.deleting") : t("Common.delete")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}