import {
    metaHelper,
    rowSelectionFeature,
    rowSortingFeature,
    tableFeatures,
    type ColumnDef,
    type RowData,
    type TableFeatures
} from "@tanstack/react-table";

export type DataTableColumnMeta = {
    className?: string;
    sortKey?: string;
};

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

export const dataTableFeatures = tableFeatures({
    rowSelectionFeature,
    rowSortingFeature,
    columnMeta: metaHelper<DataTableColumnMeta>()
});

export type DataTableFeatures = typeof dataTableFeatures;

export type DataTableColumnDef<TData extends RowData> = ColumnDef<DataTableFeatures, TData>;
