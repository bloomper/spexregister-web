"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Edit2, Trash2, X } from "lucide-react";
import { Button } from "@bloomper/fgv-web-ui/ui/button";
import {
  deleteActorAction,
  deleteTaskActivityAction,
  getSpexCharactersAction,
} from "@/app/(app)/spexare/actions.server";
import { Badge } from "@bloomper/fgv-web-ui/ui/badge";
import { Actor, SpexCharacter, Task, TaskActivity, TaskCategory, Type, TypeType } from "@/gql/schema";
import { ActorForm } from "@/components/spexare/activity/task-activity/actor/actor-form.client";
import { TaskActivityForm } from "@/components/spexare/activity/task-activity/task-activity-form.client";
import { cn } from "@/utils/utils";
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
import { useRefresh } from "@/hooks/use-refresh.client";

interface TaskActivityManagerProps {
  spexareId: string;
  activityId: string;
  /**
   * The activity's spex, whose characters an actor may play.
   */
  spexId?: string | null;
  types: Type[];
  tasks: Task[];
  taskCategories: TaskCategory[];
  initialTaskActivities: TaskActivity[];
}

export function TaskActivityManager({
  spexareId,
  activityId,
  spexId,
  types,
  tasks,
  taskCategories,
  initialTaskActivities,
}: TaskActivityManagerProps) {
  const t = useTranslations();
  const refresh = useRefresh();
  const [isPending, startTransition] = useTransition();
  const [editingActorId, setEditingActorId] = useState<string | null>(null);
  const [editingTaskActivityId, setEditingTaskActivityId] = useState<string | null>(null);

  const vocals = types.filter((t) => t.type === TypeType.Vocal);
  // Loaded up front, since an actor can be added together with a new task.
  const needsCharacters = !!spexId && taskCategories.some((category) => category.actorPresent);
  const [loaded, setLoaded] = useState<{ spexId: string; characters: SpexCharacter[] } | null>(null);
  // Undefined while loading, so the role field doesn't flash a free-text input before the characters arrive.
  const characters = !spexId ? [] : loaded?.spexId === spexId ? loaded.characters : undefined;

  useEffect(() => {
    if (!needsCharacters || !spexId) {
      return;
    }
    let current = true;

    getSpexCharactersAction(spexId)
      .then((result) => current && setLoaded({ spexId, characters: result }))
      .catch(() => current && setLoaded({ spexId, characters: [] }));
    return () => {
      current = false;
    };
  }, [needsCharacters, spexId]);

  const handleDeleteTaskActivity = (id: string) => {
    startTransition(async () => {
      try {
        await deleteTaskActivityAction(spexareId, activityId, id);
        toast.success(t("Common.deleteSuccess"));
        refresh();
      } catch (error) {
        void error;
        toast.error(t("Common.errorOccurred"));
      }
    });
  };

  const handleDeleteActor = (id: string, vocalId: string, taskActivityId: string) => {
    startTransition(async () => {
      try {
        await deleteActorAction(spexareId, activityId, taskActivityId, vocalId, id);
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
      {initialTaskActivities.length > 0 && (
        <div className="space-y-2">
          {initialTaskActivities.map((taskActivity) => {
            const isEditingThisTask = editingTaskActivityId === taskActivity.id;
            const actors = taskActivity.actors?.filter((actor): actor is Actor => !!actor) ?? [];
            const needsActor = taskActivity.task?.category?.actorPresent;

            return (
              <div
                key={taskActivity.id}
                className="border-border/20 space-y-3 border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="h-7 shrink-0 px-3 py-1"
                    >
                      {taskActivity.task?.name}
                    </Badge>

                    {actors.map((actor) => (
                      <div
                        key={actor.id}
                        className="text-muted-foreground bg-muted/50 border-border/40 inline-flex items-center gap-1.5 rounded-sm border py-0.5 pr-1 pl-2 text-xs font-medium italic sm:text-[11px]"
                      >
                        {actor.character?.name && (
                          <span>
                            <span className="mr-1 text-[11px] font-bold uppercase not-italic opacity-60 sm:text-[9px]">
                              {t("Spexare.Activity.TaskActivity.Actor.character")}:
                            </span>
                            {actor.character.name}
                          </span>
                        )}
                        {actor.role && !actor.character && (
                          <span>
                            <span className="mr-1 text-[11px] font-bold uppercase not-italic opacity-60 sm:text-[9px]">
                              {t("Spexare.Activity.TaskActivity.Actor.role")}:
                            </span>
                            {actor.role}
                          </span>
                        )}
                        {actor.vocal?.label && (
                          <span>
                            <span className="mr-1 text-[11px] font-bold uppercase not-italic opacity-60 sm:text-[9px]">
                              {t("Spexare.Activity.TaskActivity.Actor.vocal")}:
                            </span>
                            {actor.vocal.label}
                          </span>
                        )}

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-link h-4 w-4 p-0"
                          onClick={() => setEditingActorId(actor.id)}
                        >
                          <Edit2 className="h-2.5 w-2.5" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive h-4 w-4 p-0"
                                disabled={isPending || !actor.vocal?.id}
                              />
                            }
                          >
                            <X className="h-2.5 w-2.5" />
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
                                onClick={() => {
                                  if (actor.vocal?.id) {
                                    handleDeleteActor(actor.id, actor.vocal.id, taskActivity.id);
                                  }
                                }}
                              >
                                {t("Common.delete")}
                              </AlertDialogClose>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ))}
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-link h-7 w-7 transition-colors"
                      onClick={() => setEditingTaskActivityId(taskActivity.id)}
                      disabled={isPending}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive h-7 w-7 shrink-0 transition-colors"
                            disabled={isPending}
                          />
                        }
                      >
                        <Trash2 className="h-3.5 w-3.5" />
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
                            onClick={() => handleDeleteTaskActivity(taskActivity.id)}
                          >
                            {t("Common.delete")}
                          </AlertDialogClose>
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
                      existingTaskIds={initialTaskActivities
                        .map((ta) => ta.task?.id)
                        .filter((id): id is string => Boolean(id))}
                      onSuccess={() => setEditingTaskActivityId(null)}
                    />
                  </div>
                )}

                {needsActor && !isEditingThisTask && (
                  <div className="space-y-2 pl-4">
                    <ActorForm
                      key={
                        editingActorId
                          ? `edit-actor-${editingActorId}`
                          : `new-actor-${taskActivity.id}-${actors.length}`
                      }
                      spexareId={spexareId}
                      activityId={activityId}
                      taskActivityId={taskActivity.id}
                      vocals={vocals}
                      characters={characters}
                      item={actors.find((actor) => actor.id === editingActorId)}
                      onSuccess={() => setEditingActorId(null)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className={cn("space-y-4", initialTaskActivities.length > 0 && "border-border/40 border-t pt-4")}>
        <TaskActivityForm
          key={`new-task-activity-${initialTaskActivities.length}`}
          spexareId={spexareId}
          activityId={activityId}
          tasks={tasks}
          taskCategories={taskCategories}
          existingTaskIds={initialTaskActivities.map((ta) => ta.task?.id).filter((id): id is string => Boolean(id))}
          vocals={vocals}
          characters={characters}
        />
      </div>
    </div>
  );
}
