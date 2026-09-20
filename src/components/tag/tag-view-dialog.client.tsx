"use client";

import {useTranslations} from "next-intl";
import {Tag} from "@/gql/schema";
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
import {getRestorePreviewAction, getRevisionsAction, restoreRevisionAction} from "@/app/(app)/tags/actions.server";

const restoreActions = {
    preview: getRestorePreviewAction,
    restore: restoreRevisionAction,
};

export function TagViewDialog({selected, onClose}: { selected: Tag | null; onClose: () => void }) {
    const t = useTranslations();

    return (
        <Dialog open={!!selected} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{selected?.name}</DialogTitle>
                    <DialogDescription className="sr-only">
                        {t("Common.details")}
                    </DialogDescription>
                </DialogHeader>
                {selected && (
                    <div className="space-y-4">
                        <AuditTrail id={selected.id} fetchAction={getRevisionsAction}
                                    restoreActions={restoreActions} onRestored={onClose}/>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        {t("Common.close")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
