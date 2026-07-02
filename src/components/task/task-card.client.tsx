import {useTranslations} from "next-intl";
import {Pencil} from "lucide-react";
import {Task} from "@/gql/schema";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

type TaskCardProps = {
    task: Task;
    canUpdate: boolean;
    onSelect: () => void;
    onEdit: () => void;
};

export function TaskCard({task, canUpdate, onSelect, onEdit}: TaskCardProps) {
    const t = useTranslations();

    return (
        <Card
            className="group relative h-full transition-colors hover:bg-muted/50 cursor-pointer overflow-hidden flex flex-col p-0"
        >
            {canUpdate && (
                <div className="absolute top-2 right-2 z-20">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm bg-background/80 hover:bg-background"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                    >
                        <Pencil className="h-4 w-4"/>
                    </Button>
                </div>
            )}
            <div
                className="flex flex-col h-full"
                onClick={onSelect}
            >
                <CardHeader className="space-y-0.5 p-3">
                    <div className="flex items-center justify-between gap-2">
                        <CardDescription className="text-[10px]">
                            {task.category?.name ?? t("Common.none")}
                        </CardDescription>
                    </div>
                    <CardTitle className="line-clamp-1 text-sm font-bold leading-tight">{task.name}</CardTitle>
                </CardHeader>
            </div>
        </Card>
    );
}
