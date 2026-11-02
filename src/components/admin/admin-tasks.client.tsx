"use client";

import {useEffect, useState, useTransition} from "react";
import {useTranslations} from "next-intl";
import {toast} from "sonner";
import {CircleAlert, CircleCheck, Loader2, Play} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import type {MaintenanceJob} from "@/gql/schema";
import type {MaintenanceJobStatus} from "@/lib/admin/admin.server";
import {getMaintenanceJobsAction, runMaintenanceJobAction} from "@/app/(app)/admin/maintenance/actions.server";
import {formatDateTime} from "@/utils/utils";

const POLL_INTERVAL_MS = 5000;

type AdminTasksProps = {
    jobs: MaintenanceJobStatus[];
};

/**
 * The scheduled maintenance jobs, each with its schedule, its latest run and a button to run it now. Refreshes while a
 * job is running.
 */
export function AdminTasks({jobs: initialJobs}: AdminTasksProps) {
    const t = useTranslations("Admin");
    const tc = useTranslations("Common");
    const [jobs, setJobs] = useState(initialJobs);
    const [starting, setStarting] = useState<MaintenanceJob | null>(null);
    const [, startTransition] = useTransition();
    const anyRunning = jobs.some(job => job.running);

    useEffect(() => {
        if (!anyRunning) {
            return;
        }
        const timer = setInterval(() => {
            getMaintenanceJobsAction().then(setJobs).catch(() => undefined);
        }, POLL_INTERVAL_MS);

        return () => clearInterval(timer);
    }, [anyRunning]);

    const handleRun = (job: MaintenanceJob) => {
        setStarting(job);
        startTransition(async () => {
            try {
                const started = await runMaintenanceJobAction(job);

                if (started) {
                    toast.success(t("jobStarted", {job: t(`jobs.${job}.title`)}));
                    setJobs(current => current.map(status => status.job === job ? {...status, running: true} : status));
                } else {
                    toast.info(t("jobAlreadyRunning", {job: t(`jobs.${job}.title`)}));
                }
            } catch (error) {
                void error;
                toast.error(tc("errorOccurred"));
            } finally {
                setStarting(null);
            }
        });
    };

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {jobs.map(status => (
                <JobCard
                    key={status.job}
                    status={status}
                    starting={starting === status.job}
                    onRun={() => handleRun(status.job)}
                />
            ))}
        </div>
    );
}

type JobCardProps = {
    status: MaintenanceJobStatus;
    starting: boolean;
    onRun: () => void;
};

function JobCard({status, starting, onRun}: JobCardProps) {
    const t = useTranslations("Admin");
    const busy = starting || status.running;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <CardTitle>{t(`jobs.${status.job}.title`)}</CardTitle>
                    {status.running && <Badge variant="secondary">{t("running")}</Badge>}
                </div>
                <CardDescription>{t(`jobs.${status.job}.description`)}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                    <dt className="text-muted-foreground">{t("schedule")}</dt>
                    <dd>{status.schedule ? <code className="text-xs">{status.schedule}</code> : t("notScheduled")}</dd>
                    <dt className="text-muted-foreground">{t("lastRun")}</dt>
                    <dd><LastRun status={status}/></dd>
                </dl>
                <div>
                    <Button variant="outline" onClick={onRun} disabled={busy}>
                        {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Play className="mr-2 h-4 w-4"/>}
                        {t("runNow")}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function LastRun({status}: { status: MaintenanceJobStatus }) {
    const t = useTranslations("Admin");

    if (!status.lastStartedAt) {
        return <span>{t("neverRun")}</span>;
    }
    if (status.lastSucceeded === false) {
        return (
            <span className="inline-flex items-center gap-1 text-destructive">
                <CircleAlert className="h-4 w-4"/>
                {t("lastRunFailed", {at: formatDateTime(status.lastStartedAt)})}
            </span>
        );
    }
    if (status.lastSucceeded) {
        return (
            <span className="inline-flex items-center gap-1">
                <CircleCheck className="h-4 w-4 text-green-600"/>
                {t("lastRunSucceeded", {at: formatDateTime(status.lastFinishedAt ?? status.lastStartedAt)})}
            </span>
        );
    }
    return <span>{t("lastRunStarted", {at: formatDateTime(status.lastStartedAt)})}</span>;
}
