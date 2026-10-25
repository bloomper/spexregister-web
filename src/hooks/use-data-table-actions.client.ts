"use client";

import {useState, useTransition} from "react";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {useTranslations} from "next-intl";
import {track} from "@/utils/umami";

/**
 * The state of a data table's view, edit and delete dialogs and its selection, and the handlers that delete one row or
 * the selected rows, show the outcome and refresh the page. Deletions are tracked in Umami when `trackedEntity` is
 * given.
 */
export function useDataTableActions<T extends { id: string }>(
    deleteAction: (id: string) => Promise<unknown>,
    bulkDeleteAction?: (ids: string[]) => Promise<unknown>,
    onSuccess?: (deleted?: T) => void,
    trackedEntity?: string,
) {
    const t = useTranslations();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [viewItem, setViewItem] = useState<T | null>(null);
    const [editItem, setEditItem] = useState<T | null>(null);
    const [deleteItem, setDeleteItem] = useState<T | null>(null);
    const [selectedRows, setSelectedRows] = useState<T[]>([]);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    const handleDelete = () => {
        if (!deleteItem) {
            return;
        }
        startTransition(async () => {
            try {
                await deleteAction(deleteItem.id);
                if (trackedEntity) {
                    track(`${trackedEntity}-delete`, {count: 1});
                }
                setDeleteItem(null);
                toast.success(t("Common.deleteSuccess"));
                onSuccess?.(deleteItem);
                router.refresh();
            } catch (error) {
                void error;
                toast.error(t("Common.errorOccurred"));
            }
        });
    };

    const handleBulkDelete = () => {
        if (!bulkDeleteAction || selectedRows.length === 0) {
            return;
        }
        const ids = selectedRows.map((r) => r.id);
        startTransition(async () => {
            try {
                await bulkDeleteAction(ids);
                if (trackedEntity) {
                    track(`${trackedEntity}-delete`, {count: ids.length});
                }
                setIsBulkDeleting(false);
                setSelectedRows([]);
                toast.success(t("Common.deleteBulkSuccess"));
                onSuccess?.();
                router.refresh();
            } catch (error) {
                void error;
                toast.error(t("Common.errorOccurred"));
            }
        });
    };

    return {
        viewItem, setViewItem,
        editItem, setEditItem,
        deleteItem, setDeleteItem,
        selectedRows, setSelectedRows,
        isBulkDeleting, setIsBulkDeleting,
        isPending,
        handleDelete,
        handleBulkDelete
    };
}
