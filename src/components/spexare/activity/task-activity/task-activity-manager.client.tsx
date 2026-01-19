"use client";

import {useTranslations} from "next-intl";
import {useState, useTransition} from "react";
import {toast} from "sonner";
import {Edit2, Trash2, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {deleteActorAction, deleteTaskActivityAction} from "@/app/(app)/spexare/actions.server";
import {Badge} from "@/components/ui/badge";
import {Task, TaskCategory, Type, TypeType} from "@/gql/graphql";
import {ActorForm} from "@/components/spexare/activity/task-activity/actor/actor-form.client";
import {TaskActivityForm} from "@/components/spexare/activity/task-activity/task-activity-form.client";
import {cn} from "@/utils/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {useRouter} from "next/navigation";

interface TaskActivityManagerProps {
    spexareId: string;
    activityId: string;
    types: Type[];
    tasks: Task[];
    taskCategories: TaskCategory[];
    initialTaskActivities: any[];
}

export function TaskActivityManager({
                                        spexareId,
                                        activityId,
                                        types,
                                        tasks,
                                        taskCategories,
                                        initialTaskActivities
                                    }: TaskActivityManagerProps) {
    const t = useTranslations();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [editingActorId, setEditingActorId] = useState<string | null>(null);
    const [editingTaskActivityId, setEditingTaskActivityId] = useState<string | null>(null);

    const vocals = types.filter(t => t.type === TypeType.Vocal);

    const handleDeleteTaskActivity = (id: string) => {
        startTransition(async () => {
            try {
                await deleteTaskActivityAction(spexareId, activityId, id);
                toast.success(t("Common.deleteSuccess"));
                router.refresh();
            } catch (error) {
                toast.error(t("Common.errorOccurred"));
            }
        });
    };

    const handleDeleteActor = (id: string, vocalId: string, taskActivityId: string) => {
        startTransition(async () => {
            try {
                await deleteActorAction(spexareId, activityId, taskActivityId, vocalId, id);
                toast.success(t("Common.deleteSuccess"));
                router.refresh();
            } catch (error) {
                toast.error(t("Common.errorOccurred"));
            }
        });
    };

    return (
        <div className="space-y-4">
            {initialTaskActivities.length > 0 && (
                <div className="space-y-2">
                    {initialTaskActivities.map((taskActivity) => {
                        const isEditingThisTask = editingTaskActivityId === taskActivity.id;
                        const actors = taskActivity.actors || [];
                        const needsActor = taskActivity.task?.category?.actorPresent;

                        return (
                            <div key={taskActivity.id}
                                 className="space-y-3 pb-3 border-b border-border/20 last:border-0 last:pb-0">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant="secondary" className="px-3 py-1 h-7 shrink-0">
                                            {taskActivity.task?.name}
                                        </Badge>

                                        {actors.map((actor: any) => (
                                            <div key={actor.id}
                                                 className="text-[11px] text-muted-foreground font-medium italic bg-muted/50 pl-2 pr-1 py-0.5 rounded-sm inline-flex items-center gap-1.5 border border-border/40">
                                                {actor.role && (
                                                    <span>
                                                        <span
                                                            className="not-italic font-bold uppercase text-[9px] opacity-60 mr-1">
                                                            {t("Spexare.Activity.TaskActivity.Actor.role")}:
                                                        </span>
                                                        {actor.role}
                                                    </span>
                                                )}
                                                {actor.vocal?.label && (
                                                    <span>
                                                        <span
                                                            className="not-italic font-bold uppercase text-[9px] opacity-60 mr-1">
                                                            {t("Spexare.Activity.TaskActivity.Actor.vocal")}:
                                                        </span>
                                                        {actor.vocal.label}
                                                    </span>
                                                )}

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-4 w-4 text-muted-foreground hover:text-primary p-0"
                                                    onClick={() => setEditingActorId(actor.id)}
                                                >
                                                    <Edit2 className="h-2.5 w-2.5"/>
                                                </Button>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-4 w-4 text-muted-foreground hover:text-destructive p-0"
                                                            disabled={isPending}
                                                        >
                                                            <X className="h-2.5 w-2.5"/>
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>{t("Common.deleteHeading")}</AlertDialogTitle>
                                                            <AlertDialogDescription>{t("Common.deleteConfirmation")}</AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>{t("Common.cancel")}</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDeleteActor(actor.id, actor.vocal?.id, taskActivity.id)}
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            >
                                                                {t("Common.delete")}
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-muted-foreground hover:text-primary transition-colors"
                                            onClick={() => setEditingTaskActivityId(taskActivity.id)}
                                            disabled={isPending}
                                        >
                                            <Edit2 className="h-3.5 w-3.5"/>
                                        </Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                                                    disabled={isPending}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5"/>
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>{t("Common.deleteHeading")}</AlertDialogTitle>
                                                    <AlertDialogDescription>{t("Common.deleteConfirmation")}</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>{t("Common.cancel")}</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDeleteTaskActivity(taskActivity.id)}
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    >
                                                        {t("Common.delete")}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>

                                {isEditingThisTask && (
                                    <div className="pl-4">
                                        <TaskActivityForm
                                            key={`edit-task-${taskActivity.id}`}
                                            spexareId={spexareId}
                                            activityId={activityId}
                                            item={taskActivity}
                                            tasks={tasks}
                                            taskCategories={taskCategories}
                                            existingTaskIds={initialTaskActivities.map(ta => ta.task?.id).filter(Boolean)}
                                            onSuccess={() => setEditingTaskActivityId(null)}
                                        />
                                    </div>
                                )}

                                {needsActor && !isEditingThisTask && (
                                    <div className="pl-4 space-y-2">
                                        <ActorForm
                                            key={editingActorId ? `edit-actor-${editingActorId}` : `new-actor-${taskActivity.id}-${actors.length}`}
                                            spexareId={spexareId}
                                            activityId={activityId}
                                            taskActivityId={taskActivity.id}
                                            vocals={vocals}
                                            item={actors.find((a: any) => a.id === editingActorId)}
                                            onSuccess={() => setEditingActorId(null)}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <div className={cn(
                "space-y-4",
                initialTaskActivities.length > 0 && "pt-4 border-t border-border/40"
            )}>
                <TaskActivityForm
                    key={`new-task-activity-${initialTaskActivities.length}`}
                    spexareId={spexareId}
                    activityId={activityId}
                    tasks={tasks}
                    taskCategories={taskCategories}
                    existingTaskIds={initialTaskActivities.map(ta => ta.task?.id).filter(Boolean)}
                />
            </div>
        </div>
    );
}