"use client";

import {useTranslations} from "next-intl";
import {useState, useTransition} from "react";
import {toast} from "sonner";
import {Activity, Drama, Edit2, Plus, Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {createActivityAction, deleteActivityAction} from "@/app/(app)/spexare/actions.server";
import {DataEmpty} from "@/components/data-empty";
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
import {SpexActivityForm} from "@/components/spexare/activity/spex-activity/spex-activity-form.client";
import {TaskActivityManager} from "@/components/spexare/activity/task-activity/task-activity-manager.client";
import {cn} from "@/utils/utils";
import {Activity as ActivityType, Spex, SpexCategory, Task, TaskActivity, TaskCategory, Type} from "@/gql/graphql";
import {useRouter} from "next/navigation";

interface ActivityManagerProps {
    spexareId: string;
    types: Type[];
    tasks: Task[];
    taskCategories: TaskCategory[];
    spex: Spex[];
    spexCategories: SpexCategory[];
    initialActivities: ActivityType[];
}

export function ActivityManager({
                                    spexareId,
                                    types,
                                    tasks,
                                    taskCategories,
                                    spex,
                                    spexCategories,
                                    initialActivities
                                }: ActivityManagerProps) {
    const t = useTranslations();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [editingActivityId, setEditingActivityId] = useState<string | null>(null);

    const handleAddActivity = () => {
        startTransition(async () => {
            try {
                await createActivityAction(spexareId);
                toast.success(t("Common.updateSuccess"));
                router.refresh();
            } catch (error) {
                toast.error(t("Common.errorOccurred"));
            }
        });
    };

    const handleDeleteActivity = (id: string) => {
        startTransition(async () => {
            try {
                await deleteActivityAction(spexareId, id);
                toast.success(t("Common.deleteSuccess"));
                router.refresh();
            } catch (error) {
                toast.error(t("Common.errorOccurred"));
            }
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Button onClick={handleAddActivity} disabled={isPending} size="sm">
                    <Plus className="mr-2 h-4 w-4"/>
                    {t("Common.add")}
                </Button>
            </div>

            {initialActivities.length === 0 ? (
                <DataEmpty icon={Activity}/>
            ) : (
                <div className="relative space-y-8 pt-4 w-full">
                    <div className="absolute left-3 top-0 bottom-0 w-px bg-border/50"/>

                    {initialActivities.map((activity) => (
                        <div key={activity.id} className="relative pl-10 group w-full overflow-hidden">
                            <div className="absolute left-0 top-1 z-10">
                                <div className={cn(
                                    "flex items-center justify-center w-6 h-6 rounded-full border-2 border-background shadow-sm transition-colors",
                                    activity.spexActivity ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                )}>
                                    <Drama className="h-3 w-3"/>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 w-full min-w-0">
                                <div className="flex items-start justify-between gap-2 w-full">
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-sm font-bold text-foreground truncate block leading-tight">
                                            {activity.spexActivity?.spex?.title || t("Spexare.Activity.newActivity")}
                                        </h4>
                                        {activity.spexActivity?.spex?.year && (
                                            <div
                                                className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest truncate">
                                                {activity.spexActivity.spex.year}
                                            </div>
                                        )}
                                    </div>

                                    <div className="shrink-0 flex items-center gap-1">
                                        {activity.spexActivity && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                                                onClick={() => setEditingActivityId(activity.id)}
                                            >
                                                <Edit2 className="h-4 w-4"/>
                                            </Button>
                                        )}

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>{t("Common.deleteHeading")}</AlertDialogTitle>
                                                    <AlertDialogDescription>{t("Common.deleteConfirmation")}</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>{t("Common.cancel")}</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteActivity(activity.id)}
                                                                       className="bg-destructive text-destructive-foreground">
                                                        {t("Common.delete")}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>

                                <div
                                    className="relative bg-muted/30 rounded-lg border border-border/40 w-full min-w-0 overflow-hidden">
                                    <div className="p-3 sm:p-4 overflow-x-auto">
                                        {!activity.spexActivity || editingActivityId === activity.id ? (
                                            <SpexActivityForm
                                                key={editingActivityId === activity.id ? `edit-spex-${activity.spexActivity?.id}` : `new-spex-${activity.id}`}
                                                spexareId={spexareId}
                                                spex={spex}
                                                spexCategories={spexCategories}
                                                activityId={activity.id}
                                                item={activity.spexActivity ?? undefined}
                                                onSuccess={() => setEditingActivityId(null)}
                                            />
                                        ) : (
                                            <TaskActivityManager
                                                spexareId={spexareId}
                                                activityId={activity.id}
                                                types={types}
                                                tasks={tasks}
                                                taskCategories={taskCategories}
                                                initialTaskActivities={(activity.taskActivities ?? []).filter(
                                                    (taskActivity): taskActivity is TaskActivity => !!taskActivity
                                                )}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
