"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Activity, Drama, Edit2, Plus, Trash2 } from "lucide-react";
import { Button } from "@bloomper/fgv-web-ui/ui/button";
import { createActivityAction, deleteActivityAction } from "@/app/(app)/spexare/actions.server";
import { DataEmpty } from "@bloomper/fgv-web-ui/shell/data-empty";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@bloomper/fgv-web-ui/ui/alert-dialog";
import { SpexActivityForm } from "@/components/spexare/activity/spex-activity/spex-activity-form.client";
import { TaskActivityManager } from "@/components/spexare/activity/task-activity/task-activity-manager.client";
import { AggregateAuditTrail } from "@/components/audit/aggregate-audit-trail.client";
import { cn } from "@/utils/utils";
import {
  Activity as ActivityType,
  AuditedType,
  Spex,
  SpexCategory,
  Task,
  TaskActivity,
  TaskCategory,
  Type,
} from "@/gql/schema";
import { useRefresh } from "@/hooks/use-refresh.client";

interface ActivityManagerProps {
  spexareId: string;
  types: Type[];
  tasks: Task[];
  taskCategories: TaskCategory[];
  spex: Spex[];
  spexCategories: SpexCategory[];
  initialActivities: ActivityType[];
}

/**
 * A spexare's activities: adding one with its spex, and the tasks and roles of each.
 */
export function ActivityManager({
  spexareId,
  types,
  tasks,
  taskCategories,
  spex,
  spexCategories,
  initialActivities,
}: ActivityManagerProps) {
  const t = useTranslations();
  const refresh = useRefresh();
  const [isPending, startTransition] = useTransition();
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);

  const handleAddActivity = () => {
    startTransition(async () => {
      try {
        await createActivityAction(spexareId);
        toast.success(t("Common.updateSuccess"));
        refresh();
      } catch (error) {
        void error;
        toast.error(t("Common.errorOccurred"));
      }
    });
  };

  const handleDeleteActivity = (id: string) => {
    startTransition(async () => {
      try {
        await deleteActivityAction(spexareId, id);
        toast.success(t("Common.deleteSuccess"));
        refresh();
      } catch (error) {
        void error;
        toast.error(t("Common.errorOccurred"));
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          onClick={handleAddActivity}
          disabled={isPending}
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("Common.add")}
        </Button>
      </div>

      {initialActivities.length === 0 ? (
        <DataEmpty icon={Activity} />
      ) : (
        <div className="relative w-full space-y-8 pt-4">
          <div className="bg-border/50 absolute top-0 bottom-0 left-3 w-px" />

          {initialActivities.map((activity) => (
            <div
              key={activity.id}
              className="group relative w-full overflow-hidden pl-10"
            >
              <div className="absolute top-1 left-0 z-10">
                <div
                  className={cn(
                    "border-background flex h-6 w-6 items-center justify-center rounded-full border-2 shadow-sm transition-colors",
                    activity.spexActivity ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                >
                  <Drama className="h-3 w-3" />
                </div>
              </div>

              <div className="flex w-full min-w-0 flex-col gap-3">
                <div className="flex w-full items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-foreground block truncate text-sm leading-tight font-bold">
                      {activity.spexActivity?.spex?.title || t("Spexare.Activity.newActivity")}
                    </h4>
                    {activity.spexActivity?.spex?.year && (
                      <div className="text-muted-foreground truncate text-xs font-bold tracking-widest uppercase sm:text-[10px]">
                        {activity.spexActivity.spex.year}
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    {activity.spexActivity && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-link h-8 w-8 transition-colors"
                        onClick={() => setEditingActivityId(activity.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 transition-colors"
                          />
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t("Common.deleteHeading")}</AlertDialogTitle>
                          <AlertDialogDescription>{t("Common.deleteConfirmation")}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t("Common.cancel")}</AlertDialogCancel>
                          <AlertDialogClose
                            render={<AlertDialogAction variant="destructive" />}
                            onClick={() => handleDeleteActivity(activity.id)}
                          >
                            {t("Common.delete")}
                          </AlertDialogClose>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                <div className="bg-muted/30 border-border/40 relative w-full min-w-0 overflow-hidden rounded-lg border">
                  <div className="overflow-x-auto p-3 sm:p-4">
                    {!activity.spexActivity || editingActivityId === activity.id ? (
                      <SpexActivityForm
                        key={
                          editingActivityId === activity.id
                            ? `edit-spex-${activity.spexActivity?.id}`
                            : `new-spex-${activity.id}`
                        }
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
                        spexId={activity.spexActivity?.spex?.id}
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
      <AggregateAuditTrail
        spexareId={spexareId}
        relatedType={AuditedType.Activity}
      />
    </div>
  );
}
