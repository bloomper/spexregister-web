"use client";

import {useTranslations} from "next-intl";
import {Task} from "@/gql/schema";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {SpexipediaEditButton} from "@/components/spexipedia-edit-button.client";

type TaskCardProps = {
    task: Task;
    editUrl?: string | null;
    onSelect: () => void;
};

export function TaskCard({task, editUrl, onSelect}: TaskCardProps) {
    const t = useTranslations();

    return (
        <Card
            className="group relative h-full transition-colors hover:bg-muted/50 cursor-pointer overflow-hidden flex flex-col p-0"
        >
            {editUrl && <SpexipediaEditButton href={editUrl}/>}
            <div
                className="flex flex-col h-full"
                onClick={onSelect}
            >
                <CardHeader className="space-y-0.5 p-3">
                    <div className="flex items-center justify-between gap-2">
                        <CardDescription className="text-xs sm:text-[10px]">
                            {task.category?.name ?? t("Common.none")}
                        </CardDescription>
                        {task.retired && <Badge variant="outline">{t("Task.retired")}</Badge>}
                    </div>
                    <CardTitle className="line-clamp-1 text-sm font-bold leading-tight">{task.name}</CardTitle>
                </CardHeader>
            </div>
        </Card>
    );
}
