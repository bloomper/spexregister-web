"use client";

import {useTranslations} from "next-intl";
import {ClipboardPen} from "lucide-react";
import {Button} from "@/components/ui/button";
import {type EntityType, useEditQueue} from "@/components/edit-queue/edit-queue-provider.client";

export function AddSelectedToQueueButton<T extends { id: string }>({
                                                                       entityType,
                                                                       items,
                                                                   }: {
    entityType: EntityType;
    items: T[];
}) {
    const t = useTranslations();
    const {enqueueMany} = useEditQueue();

    if (items.length === 0) {
        return null;
    }

    return (
        <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => enqueueMany(entityType, items)}
        >
            <ClipboardPen className="mr-2 h-4 w-4"/>
            {t("EditQueue.addSelected", {count: items.length})}
        </Button>
    );
}
