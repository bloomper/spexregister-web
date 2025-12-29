"use client";

import {useState, useTransition} from "react";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {useTranslations} from "next-intl";

export function useDataTableActions<T extends { id: string }>(
    deleteAction: (id: string) => Promise<any>,
    bulkDeleteAction?: (ids: string[]) => Promise<any>
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
                setDeleteItem(null);
                toast.success(t("Common.deleteSuccess"));
                router.refresh();
            } catch (error) {
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
                setIsBulkDeleting(false);
                setSelectedRows([]);
                toast.success(t("Common.deleteBulkSuccess"));
                router.refresh();
            } catch (error) {
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