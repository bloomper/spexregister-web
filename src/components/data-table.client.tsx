"use client";

import * as React from "react";
import {useCallback, useEffect, useRef, useState} from "react";
import {RowSelectionState, SortingState, useTable} from "@tanstack/react-table";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {CursorPage, CursorPageInfo} from "@/types/pagination";
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useTranslations} from "next-intl";
import {SortDirection} from "@/gql/schema";
import {DataEmpty} from "@/components/data-empty";
import {cn} from "@/utils/utils";
import {Spinner} from "@/components/ui/spinner";
import {useDataRefresh} from "@/hooks/use-data-refresh.client";
import {type DataTableColumnDef, dataTableFeatures, type DataTableMeta} from "@/components/data-table-features";

interface DataTableProps<TData extends { id: string }> {
    columns: DataTableColumnDef<TData>[]
    initialData: CursorPage<TData>
    initialPageSize?: number
    initialSorting?: SortingState
    initialFilter?: string
    meta?: DataTableMeta<TData>
    children?: React.ReactNode
    onRowClick?: (data: TData) => void
    onSelectionChange?: (selectedRows: TData[]) => void
    rowClassName?: (data: TData) => string
    showPagination?: boolean
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

export function DataTable<TData extends { id: string }>({
                                                            columns,
                                                            initialData,
                                                            initialPageSize = 15,
                                                            initialSorting = [],
                                                            initialFilter,
                                                            onFetch,
                                                            meta: extraMeta,
                                                            children,
                                                            onRowClick,
                                                            onSelectionChange,
                                                            rowClassName,
                                                            showPagination = true,
                                                        }: DataTableProps<TData>) {
    const [data, setData] = useState<TData[]>(initialData.items);
    const [pageInfo, setPageInfo] = useState<CursorPageInfo>(initialData.pageInfo);
    const [totalCount, setTotalCount] = useState(initialData.totalCount);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [sorting, setSorting] = useState<SortingState>(initialSorting);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [filter, setFilter] = useState<string | undefined>(initialFilter);
    const [loading, setLoading] = useState(false);
    const lastInitialData = useRef(initialData);

    if (lastInitialData.current !== initialData) {
        setData(initialData.items);
        setPageInfo(initialData.pageInfo);
        setTotalCount(initialData.totalCount);
        setPageIndex(0);
        lastInitialData.current = initialData;
    }

    const getSortKey = useCallback(
        (sortId: string) => {
            const column = columns.find(
                (col) => col.id === sortId || ("accessorKey" in col && col.accessorKey === sortId)
            );
            return column?.meta?.sortKey ?? sortId;
        },
        [columns]
    );

    const lastFetchArgsRef = useRef<Parameters<typeof onFetch>[0]>({first: initialPageSize});

    const fetchGenerationRef = useRef(0);

    const handleFetch = useCallback(async (args: Parameters<typeof onFetch>[0], options?: {
        keepSelection?: boolean
    }) => {
        const generation = ++fetchGenerationRef.current;

        setLoading(true);
        if (!options?.keepSelection) {
            setRowSelection({});
        }
        lastFetchArgsRef.current = args;
        const currentSort = sorting[0];
        let sort = args.sort;
        if (!sort && currentSort) {
            sort = [getSortKey(currentSort.id)];
        }
        const direction = args.direction || (currentSort ? (currentSort.desc ? SortDirection.Desc : SortDirection.Asc) : undefined);
        const currentFilter = args.filter !== undefined ? args.filter : filter;

        try {
            const result = await onFetch({...args, sort, direction, filter: currentFilter});

            if (generation !== fetchGenerationRef.current) {
                return;
            }

            setData(result.items);
            setPageInfo(result.pageInfo);
            setTotalCount(result.totalCount);
        } finally {
            if (generation === fetchGenerationRef.current) {
                setLoading(false);
            }
        }
    }, [filter, getSortKey, onFetch, sorting]);

    const refresh = useCallback(() => {
        void handleFetch(lastFetchArgsRef.current, {keepSelection: true});
    }, [handleFetch]);

    useDataRefresh(refresh);

    const handleFilterChange = useCallback((newFilter: string) => {
        setFilter(newFilter);
        setPageIndex(0);
        void handleFetch({first: pageSize, filter: newFilter});
    }, [handleFetch, pageSize]);

    const extraMetaRef = useRef(extraMeta);
    extraMetaRef.current = extraMeta;

    useEffect(() => {
        extraMetaRef.current?.setRefresh?.(refresh);
        extraMetaRef.current?.setFilter?.(handleFilterChange);
    }, [handleFilterChange, refresh]);

    const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));

    const handlePageChange = (direction: "next" | "prev" | "first" | "last") => {
        if (!showPagination) {
            return;
        }

        if (direction === "first") {
            setPageIndex(0);
            void handleFetch({first: pageSize});
        } else if (direction === "last") {
            // No cursor: the server resolves "the last page" from the total element count.
            setPageIndex(pageCount - 1);
            void handleFetch({last: pageSize});
        } else if (direction === "next" && pageInfo.endCursor) {
            setPageIndex((current) => current + 1);
            void handleFetch({first: pageSize, after: pageInfo.endCursor});
        } else if (direction === "prev" && pageInfo.startCursor) {
            setPageIndex((current) => Math.max(0, current - 1));
            void handleFetch({last: pageSize, before: pageInfo.startCursor});
        }
    };

    const table = useTable({
        features: dataTableFeatures,
        data,
        columns,
        state: {
            sorting,
            rowSelection,
        },
        onSortingChange: (updater) => {
            const nextSorting = typeof updater === "function" ? updater(sorting) : updater;
            setSorting(nextSorting);

            const sortField = nextSorting[0];
            const sortId = sortField ? getSortKey(sortField.id) : undefined;

            setPageIndex(0);
            void handleFetch({
                first: pageSize,
                sort: sortId ? [sortId] : undefined,
                direction: sortField ? (sortField.desc ? SortDirection.Desc : SortDirection.Asc) : undefined
            });
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        getRowId: (row) => row.id,
        manualSorting: true,
        meta: extraMeta
    });

    // Derived from the selection state rather than from the table instance: `useTable` hands back a
    // new table object on every state change, so depending on it here would re-run every render.
    useEffect(() => {
        onSelectionChange?.(data.filter((item) => rowSelection[item.id]));
    }, [data, onSelectionChange, rowSelection]);

    const t = useTranslations();

    const handlePageSizeChange = (value: string) => {
        if (!showPagination) {
            return;
        }

        const newSize = parseInt(value, 10);
        setPageSize(newSize);
        setPageIndex(0);
        void handleFetch({first: newSize});
    };

    return (
        <div className="space-y-4">
            {children}
            <div className={`rounded-md border transition-opacity ${loading ? "opacity-50" : "opacity-100"}`}>
                {loading && (
                    <div
                        className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
                        <Spinner className="size-8 text-muted-foreground"/>
                    </div>
                )}
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className={header.column.columnDef.meta?.className}>
                                        {header.isPlaceholder ? null : <table.FlexRender header={header}/>}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className={cn(
                                        onRowClick ? "cursor-pointer" : "",
                                        rowClassName?.(row.original)
                                    )}
                                    onClick={() => onRowClick?.(row.original)}
                                >
                                    {row.getAllCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={cell.column.columnDef.meta?.className}
                                            onClick={(e) => {
                                                if (cell.column.id === "select") {
                                                    e.stopPropagation();
                                                }
                                            }}
                                        >
                                            <table.FlexRender cell={cell}/>
                                        </TableCell>
                                    ))}
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

            {showPagination && (
                <div className="flex flex-col gap-4 sm:flex-row items-center justify-between py-4">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">{t("Common.rowsPerPage")}</p>
                        <Select value={`${pageSize}`} onValueChange={handlePageSizeChange}>
                            <SelectTrigger className="h-8 w-17.5">
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
                        <p className="text-sm font-medium whitespace-nowrap">
                            {t("Common.pageOf", {page: Math.min(pageIndex + 1, pageCount), pages: pageCount})}
                        </p>
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
            )}
        </div>
    );
}
