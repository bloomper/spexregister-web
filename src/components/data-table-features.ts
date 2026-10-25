import {
    type ColumnDef,
    metaHelper,
    type RowData,
    rowSelectionFeature,
    rowSortingFeature,
    tableFeatures,
    type TableFeatures
} from "@tanstack/react-table";

/**
 * A column's class name, and the field to sort by on the server when it is not the column's id.
 */
export type DataTableColumnMeta = {
    className?: string;
    sortKey?: string;
};

/**
 * What a data table shares with its columns and toolbar: hooks to receive its refresh and filter functions, and to open
 * a row for edit or delete or add it to the edit queue.
 */
export type DataTableMeta<TData> = {
    setRefresh?: (handler: () => void) => void;
    setFilter?: (handler: (filter: string) => void) => void;
    setEditItem?: (item: TData | null) => void;
    setDeleteItem?: (item: TData | null) => void;
    addToQueue?: (item: TData) => void;
};

declare module "@tanstack/react-table" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-object-type
    interface TableMeta<in out TFeatures extends TableFeatures, in out TData extends RowData>
        extends DataTableMeta<TData> {
    }
}

/**
 * The TanStack Table features of every data table: row selection, sorting and typed column meta.
 */
export const dataTableFeatures = tableFeatures({
    rowSelectionFeature,
    rowSortingFeature,
    columnMeta: metaHelper<DataTableColumnMeta>()
});

export type DataTableFeatures = typeof dataTableFeatures;

export type DataTableColumnDef<TData extends RowData> = ColumnDef<DataTableFeatures, TData>;
