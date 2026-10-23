"use client";

import {useTranslations} from "next-intl";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {Checkbox} from "@/components/ui/checkbox";

interface PurgeOption {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}

interface DataTableDeleteDialogsProps<T> {
    deleteItem: T | null;
    setDeleteItem: (item: T | null) => void;
    isBulkDeleting: boolean;
    setIsBulkDeleting: (open: boolean) => void;
    isPending: boolean;
    handleDelete: () => void;
    handleBulkDelete: () => void;
    purge?: PurgeOption;
}

function PurgeCheckbox({id, purge, disabled}: { id: string; purge: PurgeOption; disabled: boolean }) {
    const t = useTranslations();

    return (
        <div className="flex items-start space-x-2">
            <Checkbox
                id={id}
                checked={purge.checked}
                onCheckedChange={(checked) => purge.onCheckedChange(checked)}
                disabled={disabled}
            />
            <div className="grid gap-1">
                <label
                    htmlFor={id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    {t("Common.deletePurge")}
                </label>
                <p className="text-sm text-muted-foreground">{t("Common.deletePurgeDescription")}</p>
            </div>
        </div>
    );
}

export function DataTableDeleteDialogs<T>({
                                              deleteItem,
                                              setDeleteItem,
                                              isBulkDeleting,
                                              setIsBulkDeleting,
                                              isPending,
                                              handleDelete,
                                              handleBulkDelete,
                                              purge,
                                          }: DataTableDeleteDialogsProps<T>) {
    const t = useTranslations();

    return (
        <>
            <AlertDialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("Common.deleteHeading")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t("Common.deleteConfirmation")}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    {purge && <PurgeCheckbox id="delete-purge" purge={purge} disabled={isPending}/>}
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>{t("Common.cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            disabled={isPending}
                            variant="destructive"
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
                    {purge && <PurgeCheckbox id="bulk-delete-purge" purge={purge} disabled={isPending}/>}
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>{t("Common.cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleBulkDelete();
                            }}
                            disabled={isPending}
                            variant="destructive"
                        >
                            {isPending ? t("Common.deleting") : t("Common.delete")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
