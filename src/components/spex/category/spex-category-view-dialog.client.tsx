"use client";

import Image from "next/image";
import {useTranslations} from "next-intl";
import {SpexCategory} from "@/gql/schema";
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
import {getProxiedImageUrl} from "@/utils/utils";
import {getRestorePreviewAction, getRevisionsAction, restoreRevisionAction} from "@/app/(app)/spex/categories/actions.server";

const restoreActions = {
    preview: getRestorePreviewAction,
    restore: restoreRevisionAction,
};

export function SpexCategoryViewDialog({selected, onClose}: { selected: SpexCategory | null; onClose: () => void }) {
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
                    <div className="text-sm font-medium">
                        {t("Spex.Category.firstYear")}: <span
                        className="text-muted-foreground font-normal">{selected?.firstYear}</span>
                    </div>
                    {selected?.logoUrl && (
                        <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted">
                            <Image
                                src={getProxiedImageUrl(selected.logoUrl, selected.lastModifiedAt)}
                                alt={selected.name}
                                fill
                                unoptimized
                                className="object-contain p-6"
                            />
                        </div>
                    )}
                    {selected && (
                        <div className="space-y-4">
                            <AuditTrail id={selected.id} fetchAction={getRevisionsAction}
                                        restoreActions={restoreActions} onRestored={onClose}/>
                        </div>
                    )}
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
