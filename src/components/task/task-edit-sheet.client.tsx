"use client";

import {Task, TaskCategory} from "@/gql/schema";
import {Sheet} from "@/components/ui/sheet";
import {TaskForm} from "@/components/task/task-form.client";

type TaskEditSheetProps = {
    item: Task | null;
    categories: TaskCategory[];
    onClose: () => void;
    onSuccess: () => void;
};

export function TaskEditSheet({item, categories, onClose, onSuccess}: TaskEditSheetProps) {
    return (
        <Sheet open={!!item} onOpenChange={(open) => !open && onClose()}>
            {item && (
                <TaskForm
                    item={item}
                    categories={categories}
                    onSuccess={onSuccess}
                />
            )}
        </Sheet>
    );
}
