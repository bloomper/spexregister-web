"use client";

import {ColumnDef} from "@tanstack/react-table";
import {ArrowDown, ArrowUp, ArrowUpDown, CheckCircle2, Circle, MoreHorizontal, Plus, User, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Spexare} from "@/gql/graphql";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {formatDateTime, getProxiedImageUrl} from "@/utils/utils";
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
import {SpexareForm} from "@/components/spexare";
import {useEffect, useRef, useState} from "react";
import {bulkDeleteAction, deleteAction, getPageAction} from "@/app/(app)/spexare/actions.server";
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
import {DataFilter} from "@/components/data-filter";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {format, parse} from "date-fns";


export const columns: ColumnDef<Spexare>[] = [
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
        id: "firstName",
        accessorKey: "firstName",
        header: ({column}) => {
            const isSorted = column.getIsSorted();
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="-ml-4 h-8 data-[state=open]:bg-accent"
                >
                    <Translated id="Spexare.firstName"/>
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
            const firstName = row.getValue("firstName") as string;

            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="max-w-[300px] truncate font-medium cursor-default">
                                {firstName}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[400px] wrap-break-word">
                            {firstName}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
    },
    {
        id: "lastName",
        accessorKey: "lastName",
        header: ({column}) => {
            const isSorted = column.getIsSorted();
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="-ml-4 h-8 data-[state=open]:bg-accent"
                >
                    <Translated id="Spexare.lastName"/>
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
            const lastName = row.getValue("lastName") as string;

            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="max-w-[300px] truncate font-medium cursor-default">
                                {lastName}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[400px] wrap-break-word">
                            {lastName}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
    },
    {
        id: "nickName",
        accessorKey: "nickName",
        header: ({column}) => {
            const isSorted = column.getIsSorted();
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="-ml-4 h-8 data-[state=open]:bg-accent"
                >
                    <Translated id="Spexare.nickName"/>
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
            const nickName = row.getValue("nickName") as string;

            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="max-w-[300px] truncate font-medium cursor-default">
                                {nickName}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[400px] wrap-break-word">
                            {nickName}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
        meta: {className: "hidden md:table-cell"}
    },
    {
        id: "image",
        accessorKey: "imageUrl",
        header: () => <Translated id="Spexare.imageUrl"/>,
        cell: ({row}) => {
            const url = row.getValue("image") as string;
            const item = row.original;

            return (
                <div
                    className="h-10 w-10 overflow-hidden rounded border bg-muted flex items-center justify-center relative">
                    {url ? (
                        <Image
                            src={getProxiedImageUrl(url, item.lastModifiedAt)}
                            alt=""
                            fill
                            unoptimized
                            className="h-full w-full object-contain"
                        />
                    ) : (
                        <User className="h-5 w-5 text-muted-foreground/40 stroke-[1.5]"/>
                    )}
                </div>
            );
        },
    },
    {
        id: "published",
        accessorKey: "published",
        header: () => <Translated id="Spexare.published"/>,
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
        id: "deceased",
        accessorKey: "deceased",
        header: () => <Translated id="Spexare.deceased"/>,
        cell: ({row}) => {
            const isDeceased = !!row.getValue("deceased");
            return (
                <div className="flex items-center gap-2">
                    {isDeceased ? (
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

export function SpexareTable({
                                 initialData,
                             }: {
    initialData: CursorPage<Spexare>,
}) {
    const t = useTranslations();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [filterQuery, setFilterQuery] = useState("");
    const [selectedPublishedValues, setSelectedPublishedValues] = useState<Set<string>>(new Set(["true", "false"]));
    const [selectedDeceasedValues, setSelectedDeceasedValues] = useState<Set<string>>(new Set(["true", "false"]));
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
    } = useDataTableActions<Spexare>(
        deleteAction,
        bulkDeleteAction,
        () => {
            setFilterQuery("");
            setSelectedPublishedValues(new Set(["true", "false"]));
            setSelectedDeceasedValues(new Set(["true", "false"]));
        }
    );

    useEffect(() => {
        setMounted(true);
    }, []);


    const buildFilterString = (query: string, published: Set<string>, deceased: Set<string>) => {
        const parts: string[] = [];
        if (query) {
            parts.push(`(firstName:*${query}* OR lastName:*${query}* OR nickName:*${query}*)`);
        }
        if (published.size < 2) {
            if (published.size === 0) {
                parts.push(`published:NULL`);
            } else {
                const val = published.has("true") ? "TRUE" : "FALSE";
                parts.push(`published:${val}`);
            }
        }
        if (deceased.size < 2) {
            if (deceased.size === 0) {
                parts.push(`deceased:NULL`);
            } else {
                const val = deceased.has("true") ? "TRUE" : "FALSE";
                parts.push(`deceased:${val}`);
            }
        }
        return parts.join(" AND ");
    };

    const lastFilterQueryRef = useRef<string>(buildFilterString("", new Set(["true", "false"]), new Set(["true", "false"])));
    const isFilterActive = filterQuery !== "" || selectedPublishedValues.size < 2 || selectedDeceasedValues.size < 2;

    useEffect(() => {
        const query = buildFilterString(filterQuery, selectedPublishedValues, selectedDeceasedValues);

        const timer = setTimeout(() => {
            if (setFilterQueryRef.current && query !== lastFilterQueryRef.current) {
                lastFilterQueryRef.current = query;
                setFilterQueryRef.current(query);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [filterQuery, selectedPublishedValues, selectedDeceasedValues]);

    if (!mounted) {
        return <DataTableSkeleton columnCount={9} rowCount={15}/>;
    }

    return (
        <>
            <DataTable
                columns={columns}
                initialData={initialData}
                initialSorting={[{id: "firstName", desc: true}]}
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
                            placeholder={t("Spexare.filterPlaceholder")}
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                            className="h-8 w-full sm:w-[150px] lg:w-[250px]"
                        />

                        <div className="flex items-center gap-2">
                            <DataFilter
                                title={t("Spexare.published")}
                                selectedValues={selectedPublishedValues}
                                onSelect={setSelectedPublishedValues}
                                onClear={() => setSelectedPublishedValues(new Set(["true", "false"]))}
                                options={[
                                    {label: t("Spexare.publishedStates.true"), value: "true", icon: CheckCircle2},
                                    {label: t("Spexare.publishedStates.false"), value: "false", icon: Circle},
                                ]}
                            />

                            <DataFilter
                                title={t("Spexare.deceased")}
                                selectedValues={selectedDeceasedValues}
                                onSelect={setSelectedDeceasedValues}
                                onClear={() => setSelectedDeceasedValues(new Set(["true", "false"]))}
                                options={[
                                    {label: t("Spexare.deceasedStates.true"), value: "true", icon: CheckCircle2},
                                    {label: t("Spexare.deceasedStates.false"), value: "false", icon: Circle},
                                ]}
                            />

                            {isFilterActive && (
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setFilterQuery("");
                                        setSelectedPublishedValues(new Set(["true", "false"]));
                                        setSelectedDeceasedValues(new Set(["true", "false"]));
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
                        <Link href="/spexare/create">
                            <Plus className="mr-2 h-4 w-4"/>
                            {t("Spexare.createHeading")}
                        </Link>
                    </Button>
                </div>
            </DataTable>

            <Dialog open={!!viewItem} onOpenChange={(open) => !open && setViewItem(null)}>
                <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
                    <div className="relative aspect-video w-full bg-muted border-b">
                        {viewItem?.imageUrl ? (
                            <Image
                                src={getProxiedImageUrl(viewItem.imageUrl, viewItem.lastModifiedAt)}
                                alt={`${viewItem.firstName} ${viewItem.lastName}`}
                                fill
                                unoptimized
                                className="object-contain w-full h-full"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <User className="h-24 w-24 text-muted-foreground/20 stroke-1"/>
                            </div>
                        )}
                    </div>
                    <div className="p-6">
                        <DialogHeader className="text-left">
                            <div className="flex items-start justify-between gap-2 text-left">
                                <div className="flex flex-col gap-1">
                                    <DialogTitle className="text-2xl leading-none text-left">
                                        {viewItem?.firstName} {viewItem?.lastName}
                                    </DialogTitle>
                                    {viewItem?.nickName && (
                                        <div className="text-muted-foreground italic text-lg leading-none text-left">
                                            {viewItem.nickName}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap justify-end gap-2 mt-1 shrink-0">
                                    {viewItem?.deceased &&
                                        <Badge variant="outline"
                                               className="text-[10px] uppercase tracking-wider shrink-0 mt-1">
                                            {t("Spexare.deceasedBadges.true")}
                                        </Badge>
                                    }
                                    {!viewItem?.published &&
                                        <Badge variant="outline"
                                               className="text-[10px] uppercase tracking-wider shrink-0 mt-1">
                                            {t("Spexare.publishedBadges.false")}
                                        </Badge>
                                    }
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="mt-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                                {viewItem?.socialSecurityNumber && (
                                    <div className="space-y-1">
                                        <div
                                            className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                                            {viewItem.socialSecurityNumber.includes("-") ? t("Spexare.socialSecurityNumber") : t("Spexare.birthDate")}
                                        </div>
                                        <div className="text-sm font-medium text-foreground">
                                            {viewItem.socialSecurityNumber.includes("-")
                                                ? viewItem.socialSecurityNumber
                                                : format(parse(viewItem.socialSecurityNumber, "yyyyMMdd", new Date()), "yyyy-MM-dd")
                                            }
                                        </div>
                                    </div>
                                )}
                                {viewItem?.graduation && (
                                    <div className="space-y-1">
                                        <div
                                            className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                                            {t("Spexare.graduation")}
                                        </div>
                                        <div className="text-sm font-medium text-foreground">{viewItem.graduation}</div>
                                    </div>
                                )}
                                {viewItem?.comment && (
                                    <div className="sm:col-span-2 space-y-1">
                                        <div
                                            className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                                            {t("Spexare.comment")}
                                        </div>
                                        <div
                                            className="text-sm text-foreground whitespace-pre-wrap leading-relaxed bg-muted/30 p-3 rounded-md border border-muted">
                                            {viewItem.comment}
                                        </div>
                                    </div>
                                )}
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
                    </div>
                    <DialogFooter className="p-6 pt-0">
                        <Button variant="outline" onClick={() => setViewItem(null)}>
                            {t("Common.close")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Sheet open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
                {editItem && (
                    <SpexareForm
                        item={editItem}
                        onSuccess={() => {
                            setEditItem(null);
                            setFilterQuery("");
                            setSelectedPublishedValues(new Set(["true", "false"]));
                            setSelectedDeceasedValues(new Set(["true", "false"]));
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