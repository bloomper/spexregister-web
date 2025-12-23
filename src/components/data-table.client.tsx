"use client";

import * as React from "react";
import {ColumnDef, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {CursorPage, CursorPageInfo} from "@/types/pagination";
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, LoaderPinwheel} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useTranslations} from "next-intl";
import {DataEmpty} from "@/components/data-empty";

interface RemoteDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    initialData: CursorPage<TData>;
    initialPageSize?: number;
    fetchAction: (args: any) => Promise<CursorPage<TData>>;
    extraParams?: Record<string, string>
}

export function RemoteDataTable<TData, TValue>({
                                                   columns,
                                                   initialData,
                                                   initialPageSize = 15,
                                                   fetchAction,
                                                   extraParams = {}
                                               }: RemoteDataTableProps<TData, TValue>) {
    const fetchPage = async (args: any) => {
        return fetchAction({...args, ...extraParams});
    };

    return (
        <DataTable
            columns={columns}
            initialData={initialData}
            initialPageSize={initialPageSize}
            onFetch={fetchPage}
        />
    );
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    initialData: CursorPage<TData>
    initialPageSize?: number
    onFetch: (args: {
        first?: number;
        last?: number;
        after?: string | null;
        before?: string | null
    }) => Promise<CursorPage<TData>>
}

export function DataTable<TData, TValue>({
                                             columns,
                                             initialData,
                                             initialPageSize = 15,
                                             onFetch,
                                         }: DataTableProps<TData, TValue>) {
    const [data, setData] = React.useState(initialData.items);
    const [pageInfo, setPageInfo] = React.useState<CursorPageInfo>(initialData.pageInfo);
    const [pageSize, setPageSize] = React.useState(initialPageSize);
    const [loading, setLoading] = React.useState(false);

    const handleFetch = async (args: Parameters<typeof onFetch>[0]) => {
        setLoading(true);
        try {
            const result = await onFetch(args);
            setData(result.items);
            setPageInfo(result.pageInfo);
        } finally {
            setLoading(false);
        }
    };

    const refresh = () => {
        void handleFetch({first: pageSize});
    };

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
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        meta: {
            refresh
        }
    });

    const t = useTranslations();

    const handlePageSizeChange = (value: string) => {
        const newSize = parseInt(value, 10);
        setPageSize(newSize);
        void handleFetch({first: newSize});
    };

    return (
        <div className="space-y-4">
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
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        const meta = cell.column.columnDef.meta as { className?: string };
                                        return (
                                            <TableCell key={cell.id} className={meta?.className}>
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
                        <ChevronsLeft className="h-4 w-4" />
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
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
