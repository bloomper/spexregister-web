"use client";

import {useTranslations} from "next-intl";
import {Drama, History} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {DataEmpty} from "@/components/data-empty";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Activity, Actor, TaskActivity} from "@/gql/graphql";

interface ActivityTimelineProps {
    activities: Activity[];
}

export function ActivityTimeline({activities}: ActivityTimelineProps) {
    const t = useTranslations();

    if (!activities || activities.length === 0) {
        return (
            <div className="py-6">
                <DataEmpty icon={History}/>
            </div>
        );
    }

    const sortedActivities = [...activities].sort((a, b) => {
        const yearA = parseInt(a.spexActivity?.spex?.year || "0");
        const yearB = parseInt(b.spexActivity?.spex?.year || "0");
        return yearB - yearA;
    });

    return (
        <div
            className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent pt-4 pb-8">
            <TooltipProvider>
                {sortedActivities.map((activity) => {
                    const taskActivities = activity.taskActivities?.filter((item): item is TaskActivity => !!item) ?? [];
                    return (
                        <div key={activity.id} className="relative pl-12">
                            <div
                                className="absolute left-0 flex items-center justify-center w-10 h-10 rounded-full border bg-background shadow-sm z-10">
                                <Drama className="h-4 w-4 text-primary"/>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex flex-wrap items-baseline gap-x-2">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <h4 className="text-sm font-bold cursor-help underline decoration-dotted decoration-muted-foreground/30 underline-offset-4">
                                                {activity.spexActivity?.spex?.title || t("Common.none")}
                                            </h4>
                                        </TooltipTrigger>
                                        {activity.spexActivity?.spex?.category?.name && (
                                            <TooltipContent>
                                                <p className="text-xs font-medium">{activity.spexActivity.spex.category.name}</p>
                                            </TooltipContent>
                                        )}
                                    </Tooltip>
                                    <span className="text-xs text-muted-foreground font-medium">
                                        {activity.spexActivity?.spex?.year}
                            </span>
                                    {activity.spexActivity?.spex?.revival && (
                                        <Badge variant="outline"
                                               className="text-[10px] h-4 py-0 uppercase border-primary/30 text-primary/70">
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
                                                className="flex flex-col gap-1.5 w-full bg-muted/20 rounded-lg p-2 border border-border/40"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-[9px] font-bold uppercase px-2 h-5 tracking-tight shadow-none border-transparent shrink-0 cursor-help"
                                                            >
                                                                {taskActivity.task?.name}
                                                            </Badge>
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
                                                            <div key={actor.id}
                                                                 className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] py-0.5 border-l-2 border-primary/20 pl-2">
                                                                {actor.role && (
                                                                    <div className="flex items-center gap-1.5">
                                                                    <span
                                                                        className="text-[9px] uppercase font-bold text-muted-foreground/70">
                                                                        {t("Spexare.Activity.TaskActivity.Actor.role")}:
                                                                    </span>
                                                                        <span
                                                                            className="font-semibold text-foreground/90 leading-tight">
                                                                        {actor.role}
                                                                    </span>
                                                                    </div>
                                                                )}
                                                                {actor.vocal?.label && (
                                                                    <div className="flex items-center gap-1.5">
                                                                    <span
                                                                        className="text-[9px] uppercase font-bold text-muted-foreground/70">
                                                                        {t("Spexare.Activity.TaskActivity.Actor.vocal")}:
                                                                    </span>
                                                                        <span
                                                                            className="text-muted-foreground font-medium leading-tight">
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
                    )
                })}
            </TooltipProvider>
        </div>
    );
}
