"use client";

import {useTranslations} from "next-intl";
import {Task} from "@/gql/schema";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {AuditTrail} from "@/components/data-audit-trail.client";
import {getEventsAction} from "@/app/(app)/tasks/actions.server";

export function TaskViewDialog({selected, onClose}: { selected: Task | null; onClose: () => void }) {
    const t = useTranslations();

    return (
        <Dialog open={!!selected} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-xl p-0 overflow-hidden">
                <div className="p-6">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">{selected?.name}</DialogTitle>
                        <DialogDescription className="sr-only">
                            {t("Common.details")}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-6 flex flex-col gap-4 text-sm">
                        <div>
                            <div
                                className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider mb-1">
                                {t("Task.category")}
                            </div>
                            <div className="text-base">{selected?.category?.name ?? t("Common.none")}</div>
                        </div>
                        {selected && (
                            <div className="space-y-4">
                                <AuditTrail id={selected.id} fetchAction={getEventsAction}/>
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter className="p-6 pt-0">
                    <Button variant="outline" onClick={onClose}>
                        {t("Common.close")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
