"use client";

import { useTranslations } from "next-intl";
import { Drama, History } from "lucide-react";
import { Badge } from "@bloomper/fgv-web-ui/ui/badge";
import { DataEmpty } from "@bloomper/fgv-web-ui/shell/data-empty";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@bloomper/fgv-web-ui/ui/tooltip";
import { Activity, Actor, TaskActivity } from "@/gql/schema";

interface ActivityTimelineProps {
  activities: Activity[];
}

/**
 * A spexare's activities as a timeline, newest spex first.
 */
export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const t = useTranslations();

  if (!activities || activities.length === 0) {
    return (
      <div className="py-6">
        <DataEmpty icon={History} />
      </div>
    );
  }

  const sortedActivities = [...activities].sort((a, b) => {
    const yearA = parseInt(a.spexActivity?.spex?.year || "0");
    const yearB = parseInt(b.spexActivity?.spex?.year || "0");
    return yearB - yearA;
  });

  return (
    <div className="before:via-border relative space-y-8 pt-4 pb-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:to-transparent">
      <TooltipProvider>
        {sortedActivities.map((activity) => {
          const taskActivities = activity.taskActivities?.filter((item): item is TaskActivity => !!item) ?? [];
          return (
            <div
              key={activity.id}
              className="relative pl-12"
            >
              <div className="bg-background absolute left-0 z-10 flex h-10 w-10 items-center justify-center rounded-full border shadow-sm">
                <Drama className="text-link h-4 w-4" />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <h4 className="decoration-muted-foreground/30 cursor-help text-sm font-bold underline decoration-dotted underline-offset-4" />
                      }
                    >
                      {activity.spexActivity?.spex?.title || t("Common.none")}
                    </TooltipTrigger>
                    {activity.spexActivity?.spex?.category?.name && (
                      <TooltipContent>
                        <p className="text-xs font-medium">{activity.spexActivity.spex.category.name}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                  <span className="text-muted-foreground text-xs font-medium">{activity.spexActivity?.spex?.year}</span>
                  {activity.spexActivity?.spex?.revival && (
                    <Badge
                      variant="outline"
                      className="border-primary/30 text-link/70 h-4 py-0 text-xs uppercase sm:text-[10px]"
                    >
                      {t("Spexare.Activity.SpexActivity.revival")}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {taskActivities.map((taskActivity) => {
                    const actors = taskActivity.actors?.filter((actor): actor is Actor => !!actor) ?? [];
                    const hasActors = actors.length > 0;

                    return (
                      <div
                        key={taskActivity.id}
                        className="bg-muted/20 border-border/40 flex w-full flex-col gap-1.5 rounded-lg border p-2"
                      >
                        <div className="flex items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Badge
                                  variant="secondary"
                                  className="h-5 shrink-0 cursor-help border-transparent px-2 text-[11px] font-bold tracking-tight uppercase shadow-none sm:text-[9px]"
                                />
                              }
                            >
                              {taskActivity.task?.name}
                            </TooltipTrigger>
                            {taskActivity.task?.category?.name && (
                              <TooltipContent>
                                <p className="text-xs font-medium">{taskActivity.task.category.name}</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </div>

                        {hasActors && (
                          <div className="flex flex-col gap-1 pl-1">
                            {actors.map((actor) => (
                              <div
                                key={actor.id}
                                className="border-primary/20 flex flex-wrap items-center gap-x-3 gap-y-0.5 border-l-2 py-0.5 pl-2 text-xs sm:text-[11px]"
                              >
                                {(actor.character?.name || actor.role) && (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-muted-foreground/70 text-[11px] font-bold uppercase sm:text-[9px]">
                                      {t(
                                        actor.character
                                          ? "Spexare.Activity.TaskActivity.Actor.character"
                                          : "Spexare.Activity.TaskActivity.Actor.role"
                                      )}
                                      :
                                    </span>
                                    <span className="text-foreground/90 leading-tight font-semibold">
                                      {actor.character?.name ?? actor.role}
                                    </span>
                                  </div>
                                )}
                                {actor.vocal?.label && (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-muted-foreground/70 text-[11px] font-bold uppercase sm:text-[9px]">
                                      {t("Spexare.Activity.TaskActivity.Actor.vocal")}:
                                    </span>
                                    <span className="text-muted-foreground leading-tight font-medium">
                                      {actor.vocal.label}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </TooltipProvider>
    </div>
  );
}
