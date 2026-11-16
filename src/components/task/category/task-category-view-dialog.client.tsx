"use client";

import {useTranslations} from "next-intl";
import {TaskCategory} from "@/gql/schema";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";

export function TaskCategoryViewDialog({selected, onClose}: { selected: TaskCategory | null; onClose: () => void }) {
    const t = useTranslations();

    return (
        <Dialog open={!!selected} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{selected?.name}</DialogTitle>
                    <DialogDescription className="sr-only">
                        {t("Common.details")}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("Task.Category.actorPresent")}</p>
                        <p className="text-sm">
                            {selected?.actorPresent ? t("Common.yes") : t("Common.no")}
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        {t("Common.close")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
