"use client";

import {ColumnDef} from "@tanstack/react-table";
import {ArrowDown, ArrowUp, ArrowUpDown, CheckCircle2, Circle, MoreHorizontal, Plus, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {News} from "@/gql/graphql";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {formatDate, formatDateTime} from "@/utils/utils";
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
import {NewsForm} from "@/components/news/news-form.client";
import {useEffect, useRef, useState, useTransition} from "react";
import {bulkDeleteNewsAction, deleteNewsAction, fetchNewsPageAction} from "@/app/(app)/news/actions.server";
import {toast} from "sonner";
import {Sheet} from "@/components/ui/sheet";
import {CursorPage} from "@/types/pagination";
import {useRouter} from "next/navigation";
import {DataTableSkeleton} from "@/components/data-table-skeleton";
import {Input} from "@/components/ui/input";
import {DataTableFacetedFilter} from "@/components/data-table-facet-filter";
import Link from "next/link";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Checkbox} from "@/components/ui/checkbox";


function Translated({id}: { id: string }) {
    const t = useTranslations();
    return <>{t(id)}</>;
}

export const columns: ColumnDef<News>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
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
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "subject",
        header: ({column}) => {
            const isSorted = column.getIsSorted();
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="-ml-4 h-8 data-[state=open]:bg-accent"
                >
                    <Translated id="News.subject"/>
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
            const subject = row.getValue("subject") as string;

            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="max-w-[300px] truncate font-medium cursor-default">
                                {subject}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[400px] wrap-break-word">
                            {subject}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
    },
    {
        accessorKey: "published",
        header: () => <Translated id="News.published"/>,
        cell: ({row}) => {
            const isPublished = !!row.getValue("published");
            return (
                <div className="flex items-center gap-2">
                    {isPublished ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500"/>
                    ) : (
                        <Circle className="h-4 w-4 text-muted-foreground"/>
                    )}
                </div>
            )
        },
        meta: {className: "hidden md:table-cell"}
    },
    {
        accessorKey: "visibleFrom",
        header: ({column}) => {
            const isSorted = column.getIsSorted();
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="-ml-4 h-8 data-[state=open]:bg-accent"
                >
                    <Translated id="News.visibleFrom"/>
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
        cell: ({row}) => formatDate(row.getValue("visibleFrom") as string) || "-",
        meta: {className: "hidden lg:table-cell"}
    },
    {
        accessorKey: "visibleTo",
        header: ({column}) => {
            const isSorted = column.getIsSorted();
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="-ml-4 h-8 data-[state=open]:bg-accent"
                >
                    <Translated id="News.visibleTo"/>
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
        cell: ({row}) => formatDate(row.getValue("visibleTo") as string) || "-",
        meta: {className: "hidden xl:table-cell"}
    },
    {
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
            const news = row.original;
            const t = useTranslations();

            const meta = table.options.meta as any;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">{t("Common.openMenu")}</span>
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => meta?.setEditItem(news)}>
                            {t("Common.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-destructive"
                            onSelect={() => meta?.setDeleteItem(news)}
                        >
                            {t("Common.delete")}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export function NewsTable({
                              initialData,
                              defaultPublishedStates = ["true"]
                          }: {
    initialData: CursorPage<News>,
    defaultPublishedStates?: string[]
}) {
    const t = useTranslations();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [viewItem, setViewItem] = useState<News | null>(null);
    const [editItem, setEditItem] = useState<News | null>(null);
    const [deleteItem, setDeleteItem] = useState<News | null>(null);
    const [selectedRows, setSelectedRows] = useState<News[]>([]);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);
    const [subjectFilter, setSubjectFilter] = useState("");
    const [publishedValues, setPublishedValues] = useState<Set<string>>(new Set(defaultPublishedStates));
    const setFilterRef = useRef<((filter: string) => void) | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleDelete = () => {
        if (!deleteItem) {
            return;
        }

        startTransition(async () => {
            try {
                await deleteNewsAction(deleteItem.id);
                setDeleteItem(null);
                toast.success(t("Common.deleteSuccess"));
                router.refresh();
            } catch (error) {
                toast.error(t("Common.errorOccurred"));
            }
        });
    };

    const handleBulkDelete = () => {
        const ids = selectedRows.map(r => r.id);
        startTransition(async () => {
            try {
                await bulkDeleteNewsAction(ids);
                setIsBulkDeleting(false);
                setSelectedRows([]);
                toast.success(t("Common.deleteBulkSuccess"));
                router.refresh();
            } catch (error) {
                toast.error(t("Common.errorOccurred"));
            }
        });
    };

    const buildFilterString = (subject: string, published: Set<string>) => {
        const parts: string[] = [];
        if (subject) parts.push(`subject:*${subject}*`);
        if (published.size > 0 && published.size < 2) {
            const val = published.has("true") ? "TRUE" : "FALSE";
            parts.push(`published:${val}`);
        } else if (published.size === 2) {
            parts.push(`(published:TRUE OR published:FALSE)`);
        }
        return parts.join(" AND ");
    };

    const lastQueryRef = useRef<string>(buildFilterString("", new Set(defaultPublishedStates)));
    const [isPending, startTransition] = useTransition();

    const isFilterActive = subjectFilter !== "" ||
        publishedValues.size !== defaultPublishedStates.length ||
        ![...publishedValues].every(value => defaultPublishedStates.includes(value));

    useEffect(() => {
        const query = buildFilterString(subjectFilter, publishedValues);

        const timer = setTimeout(() => {
            if (setFilterRef.current && query !== lastQueryRef.current) {
                lastQueryRef.current = query;
                setFilterRef.current(query);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [subjectFilter, publishedValues]);

    if (!mounted) {
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
                onFetch={(args) => fetchNewsPageAction({...args, full: true})}
                meta={{
                    setEditItem,
                    setDeleteItem,
                    setFilter: (fn: any) => {
                        setFilterRef.current = typeof fn === 'function' && fn.length === 0 ? fn() : fn;
                    },
                }}
            >
                <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Input
                            placeholder={t("News.filterSubject")}
                            value={subjectFilter}
                            onChange={(e) => setSubjectFilter(e.target.value)}
                            className="h-8 w-full sm:w-[150px] lg:w-[250px]"
                        />

                        <div className="flex items-center gap-2">
                            <DataTableFacetedFilter
                                title={t("News.published")}
                                selectedValues={publishedValues}
                                onSelect={setPublishedValues}
                                options={[
                                    {label: "Published", value: "true", icon: CheckCircle2},
                                    {label: "Draft", value: "false", icon: Circle},
                                ]}
                            />

                            {isFilterActive && (
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setSubjectFilter("");
                                        setPublishedValues(new Set(defaultPublishedStates));
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
                        <Link href="/news/create">
                            <Plus className="mr-2 h-4 w-4"/>
                            {t("News.createTitle")}
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
                    </DialogHeader>
                    <div className="space-y-6">
                        <div className="whitespace-pre-wrap text-sm text-foreground max-h-[50vh] overflow-y-auto">
                            {viewItem?.text}
                        </div>

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
                    <NewsForm
                        news={editItem}
                        onSuccess={() => {
                            setEditItem(null);
                            router.refresh();
                        }}
                    />
                )}
            </Sheet>

            <AlertDialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("Common.deleteTitle")}</AlertDialogTitle>
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
                        <AlertDialogTitle>{t("Common.deleteBulkTitle")}</AlertDialogTitle>
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