"use client";

import {ColumnDef} from "@tanstack/react-table";
import {ArrowDown, ArrowUp, ArrowUpDown, CheckCircle2, Circle, LucideIcon, MoreHorizontal} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {useTranslations} from "next-intl";
import {Translated} from "@/components/translated.client";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {formatDate, formatDateTime} from "@/utils/utils";
import {TableThumbnail} from "@/components/data-table-thumbnail.client";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";

export const columnHelper = {
    select: <T, >(): ColumnDef<T> => ({
        id: "select",
        header: ({table}) => {
            const t = useTranslations();
            return (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
                    onClick={(e) => e.stopPropagation()}
                    aria-label={t("Common.select")}
                />
            );
        },
        enableSorting: false,
        enableHiding: false,
    }),
    text: <T, >(id: string, translationId: string, accessorKey: string = id, className?: string): ColumnDef<T> => ({
        id,
        accessorKey,
        header: ({column}) => {
            if (!column.getCanSort()) {
                return <Translated id={translationId}/>;
            }

            const isSorted = column.getIsSorted();
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="-ml-4 h-8 data-[state=open]:bg-accent"
                >
                    <Translated id={translationId}/>
                    {isSorted === "desc" ? <ArrowDown className="ml-2 h-4 w-4"/> : isSorted === "asc" ?
                        <ArrowUp className="ml-2 h-4 w-4"/> : <ArrowUpDown className="ml-2 h-4 w-4"/>}
                </Button>
            );
        },
        cell: ({row}) => {
            const value = row.getValue(id) as string;
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="max-w-[300px] truncate font-medium cursor-default">{value}</div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[400px] wrap-break-word">{value}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
        meta: className ? {className} : undefined,
    }),
    date: <T, >(id: string, translationId: string, accessorKey: string = id, className?: string): ColumnDef<T> => ({
        id,
        accessorKey,
        header: ({column}) => {
            if (!column.getCanSort()) {
                return <Translated id={translationId}/>;
            }

            const isSorted = column.getIsSorted();
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="-ml-4 h-8"
                >
                    <Translated id={translationId}/>
                    {isSorted === "desc" ? <ArrowDown className="ml-2 h-4 w-4"/> : isSorted === "asc" ?
                        <ArrowUp className="ml-2 h-4 w-4"/> : <ArrowUpDown className="ml-2 h-4 w-4"/>}
                </Button>
            );
        },
        cell: ({row}) => {
            const value = row.getValue(id) as string;
            return value ? formatDate(value) : "-";
        },
        meta: className ? {className} : undefined,
    }),
    dateTime: <T, >(id: string, translationId: string, accessorKey: string = id, className?: string): ColumnDef<T> => ({
        id,
        accessorKey,
        header: ({column}) => {
            if (!column.getCanSort()) {
                return <Translated id={translationId}/>;
            }

            const isSorted = column.getIsSorted();
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                    className="-ml-4 h-8"
                >
                    <Translated id={translationId}/>
                    {isSorted === "desc" ? <ArrowDown className="ml-2 h-4 w-4"/> : isSorted === "asc" ?
                        <ArrowUp className="ml-2 h-4 w-4"/> : <ArrowUpDown className="ml-2 h-4 w-4"/>}
                </Button>
            );
        },
        cell: ({row}) => {
            const value = row.getValue(id) as string;
            return value ? formatDateTime(value) : "-";
        },
        meta: className ? {className} : undefined,
    }),

    image: <T, >(id: string, translationId: string, accessorKey: string, fallbackIcon: LucideIcon): ColumnDef<T> => ({
        id,
        accessorKey,
        header: () => <Translated id={translationId}/>,
        cell: ({row}) => (
            <TableThumbnail
                url={row.getValue(id)}
                lastModifiedAt={(row.original as any).lastModifiedAt}
                fallbackIcon={fallbackIcon}
            />
        ),
    }),
    boolean: <T, >(id: string, translationId: string, className?: string): ColumnDef<T> => ({
        id,
        accessorKey: id,
        header: () => <Translated id={translationId}/>,
        cell: ({row}) => (
            <div className="flex items-center gap-2">
                {row.getValue(id) ? <CheckCircle2 className="h-4 w-4 text-green-500"/> :
                    <Circle className="h-4 w-4 text-muted-foreground"/>}
            </div>
        ),
        meta: className ? {className} : undefined,
    }),
    audit: <T, >(): ColumnDef<T>[] => [
        {
            id: "createdAt",
            accessorKey: "createdAt",
            header: ({column}) => {
                if (!column.getCanSort()) {
                    return <Translated id="Common.createdAt"/>;
                }

                const isSorted = column.getIsSorted();
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(isSorted === "asc")}
                            className="-ml-4 h-8">
                        <Translated id="Common.createdAt"/>
                        {isSorted === "desc" ? <ArrowDown className="ml-2 h-4 w-4"/> : isSorted === "asc" ?
                            <ArrowUp className="ml-2 h-4 w-4"/> : <ArrowUpDown className="ml-2 h-4 w-4"/>}
                    </Button>
                );
            },
            cell: ({row}) => formatDateTime(row.getValue("createdAt")) || "-",
            meta: {className: "hidden xl:table-cell"}
        },
        {
            id: "lastModifiedAt",
            accessorKey: "lastModifiedAt",
            header: ({column}) => {
                if (!column.getCanSort()) {
                    return <Translated id="Common.lastModifiedAt"/>;
                }

                const isSorted = column.getIsSorted();
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(isSorted === "asc")}
                            className="-ml-4 h-8">
                        <Translated id="Common.lastModifiedAt"/>
                        {isSorted === "desc" ? <ArrowDown className="ml-2 h-4 w-4"/> : isSorted === "asc" ?
                            <ArrowUp className="ml-2 h-4 w-4"/> : <ArrowUpDown className="ml-2 h-4 w-4"/>}
                    </Button>
                );
            },
            cell: ({row}) => formatDateTime(row.getValue("lastModifiedAt")) || "-",
            meta: {className: "hidden xl:table-cell"}
        }
    ],
    actions: <T, >(): ColumnDef<T> => ({
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
                                <MoreHorizontal className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onSelect={() => meta?.setEditItem(item)}>{t("Common.edit")}</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive"
                                              onSelect={() => meta?.setDeleteItem(item)}>{t("Common.delete")}</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    })
};