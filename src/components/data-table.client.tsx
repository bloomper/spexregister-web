"use client";

import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    RowSelectionState,
    SortingState,
    useReactTable
} from "@tanstack/react-table";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {CursorPage, CursorPageInfo} from "@/types/pagination";
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, LoaderPinwheel} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useTranslations} from "next-intl";
import {SortDirection} from "@/gql/graphql";
import {DataEmpty} from "@/components/data-empty";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    initialData: CursorPage<TData>
    initialPageSize?: number
    initialSorting?: SortingState
    meta?: Record<string, any>
    children?: React.ReactNode
    onRowClick?: (data: TData) => void
    onSelectionChange?: (selectedRows: TData[]) => void
    onFetch: (args: {
        first?: number;
        last?: number;
        after?: string | null;
        before?: string | null;
        sort?: string[];
        direction?: SortDirection;
        filter?: string;
    }) => Promise<CursorPage<TData>>
}

export function DataTable<TData, TValue>({
                                             columns,
                                             initialData,
                                             initialPageSize = 15,
                                             initialSorting = [],
                                             onFetch,
                                             meta: extraMeta,
                                             children,
                                             onRowClick,
                                             onSelectionChange
                                         }: DataTableProps<TData, TValue>) {
    const [data, setData] = useState<TData[]>(initialData.items);
    const [pageInfo, setPageInfo] = useState<CursorPageInfo>(initialData.pageInfo);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [sorting, setSorting] = useState<SortingState>(initialSorting);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [filter, setFilter] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const lastInitialData = useRef(initialData);

    if (lastInitialData.current !== initialData) {
        setData(initialData.items);
        setPageInfo(initialData.pageInfo);
        lastInitialData.current = initialData;
    }

    const handleFetch = async (args: Parameters<typeof onFetch>[0]) => {
        setLoading(true);
        setRowSelection({});
        const currentSort = sorting[0];
        let sort = args.sort;
        if (!sort && currentSort) {
            const column = table.getColumn(currentSort.id);
            const sortKey = (column?.columnDef.meta as any)?.sortKey;
            sort = [sortKey ?? currentSort.id];
        }
        const direction = args.direction || (currentSort ? (currentSort.desc ? SortDirection.Desc : SortDirection.Asc) : undefined);
        const currentFilter = args.filter !== undefined ? args.filter : filter;

        try {
            const result = await onFetch({...args, sort, direction, filter: currentFilter});
            setData(result.items);
            setPageInfo(result.pageInfo);
        } finally {
            setLoading(false);
        }
    };

    const refresh = () => {
        void handleFetch({first: pageSize});
    };

    const handleFilterChange = React.useCallback((newFilter: string) => {
        setFilter(newFilter);
        void handleFetch({first: pageSize, filter: newFilter});
    }, [pageSize, filter]);

    const extraMetaRef = useRef(extraMeta);
    extraMetaRef.current = extraMeta;

    useEffect(() => {
        if (extraMetaRef.current?.setRefresh) {
            extraMetaRef.current.setRefresh(() => refresh);
        }
        if (extraMetaRef.current?.setFilter) {
            extraMetaRef.current.setFilter(() => handleFilterChange);
        }
    }, [handleFilterChange, refresh]);

    const handlePageChange = (direction: "next" | "prev" | "first" | "last") => {
        if (direction === "first") {
            void handleFetch({first: pageSize});
        } else if (direction === "last") {
            void handleFetch({last: pageSize});
        } else if (direction === "next" && pageInfo.endCursor) {
            void handleFetch({first: pageSize, after: pageInfo.endCursor});
        } else if (direction === "prev" && pageInfo.startCursor) {
            void handleFetch({last: pageSize, before: pageInfo.startCursor});
        }
    };

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            rowSelection,
        },
        onSortingChange: (updater) => {
            const nextSorting = typeof updater === 'function' ? updater(sorting) : updater;
            setSorting(nextSorting);

            const sortField = nextSorting[0];
            let sortId = sortField?.id;
            if (sortField) {
                const column = table.getColumn(sortField.id);
                const sortKey = (column?.columnDef.meta as any)?.sortKey;
                if (sortKey) {
                    sortId = sortKey;
                }
            }

            void handleFetch({
                first: pageSize,
                sort: sortId ? [sortId] : undefined,
                direction: sortField ? (sortField.desc ? SortDirection.Desc : SortDirection.Asc) : undefined
            });
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        getRowId: (row: any) => row.id,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualSorting: true,
        meta: {
            refresh,
            setFilter: handleFilterChange,
            ...extraMeta
        }
    });

    useEffect(() => {
        if (onSelectionChange) {
            const selectedData = table.getSelectedRowModel().rows.map((row) => row.original);
            onSelectionChange(selectedData);
        }
    }, [rowSelection, table, onSelectionChange]);

    const t = useTranslations();

    const handlePageSizeChange = (value: string) => {
        const newSize = parseInt(value, 10);
        setPageSize(newSize);
        void handleFetch({first: newSize});
    };

    return (
        <div className="space-y-4">
            {children}
            <div className={`rounded-md border transition-opacity ${loading ? "opacity-50" : "opacity-100"}`}>
                {loading && (
                    <div
                        className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
                        <LoaderPinwheel className="h-6 w-6 animate-spin text-muted-foreground"/>
                    </div>
                )}
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const meta = header.column.columnDef.meta as { className?: string };
                                    return (
                                        <TableHead key={header.id} className={meta?.className}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className={onRowClick ? "cursor-pointer" : ""}
                                    onClick={() => onRowClick?.(row.original)}
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        const meta = cell.column.columnDef.meta as { className?: string };
                                        return (
                                            <TableCell
                                                key={cell.id}
                                                className={meta?.className}
                                                onClick={(e) => {
                                                    if (cell.column.id === "select") {
                                                        e.stopPropagation();
                                                    }
                                                }}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <DataEmpty/>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row items-center justify-between py-4">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">{t("Common.rowsPerPage")}</p>
                    <Select value={`${pageSize}`} onValueChange={handlePageSizeChange}>
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={pageSize}/>
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 15, 20, 25, 30, 40, 50].map((size) => (
                                <SelectItem key={size} value={`${size}`}>{size}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => handlePageChange("first")}
                        disabled={!pageInfo.hasPreviousPage || loading}
                    >
                        <ChevronsLeft className="h-4 w-4"/>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handlePageChange("prev")}
                        disabled={!pageInfo.hasPreviousPage || loading}
                    >
                        <ChevronLeft className="h-4 w-4"/>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handlePageChange("next")}
                        disabled={!pageInfo.hasNextPage || loading}
                    >
                        <ChevronRight className="h-4 w-4"/>
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => handlePageChange("last")}
                        disabled={!pageInfo.hasNextPage || loading}
                    >
                        <ChevronsRight className="h-4 w-4"/>
                    </Button>
                </div>
            </div>
        </div>
    );
}
