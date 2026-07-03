"use client";

import {useTranslations} from "next-intl";
import {ClipboardPen} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {useEditQueue} from "@/components/edit-queue/edit-queue-provider.client";

export function EditQueueButton() {
    const t = useTranslations();
    const {count, open} = useEditQueue();

    if (count === 0) {
        return null;
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            className="relative h-8 gap-2"
            onClick={open}
            aria-label={t("EditQueue.open")}
        >
            <ClipboardPen className="h-4 w-4"/>
            <span className="hidden sm:inline">{t("EditQueue.title")}</span>
            <Badge variant="secondary" className="h-5 min-w-5 justify-center px-1 tabular-nums">
                {count}
            </Badge>
        </Button>
    );
}
