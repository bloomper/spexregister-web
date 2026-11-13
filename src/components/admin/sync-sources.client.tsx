"use client";

import {useState, useTransition} from "react";
import {useTranslations} from "next-intl";
import {toast} from "sonner";
import {CircleAlert, CircleCheck, Loader2, RefreshCw} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import type {SyncSourceStatus} from "@/lib/admin/admin.server";
import {getSyncSourcesAction, runSyncAction} from "@/app/(app)/admin/maintenance/actions.server";
import {formatDateTime} from "@/utils/utils";

/**
 * The sources Spexregister copies base data from (Spexipedia), how far each copy has got, and buttons to pull now: the
 * changes since last time, or the whole feed again to find what is here but no longer there.
 */
export function SyncSources({sources: initialSources}: { sources: SyncSourceStatus[] }) {
    const t = useTranslations("Admin.sync");
    const tc = useTranslations("Common");
    const [sources, setSources] = useState(initialSources);
    const [running, setRunning] = useState<"changes" | "full" | null>(null);
    const [missing, setMissing] = useState<string[]>([]);
    const [, startTransition] = useTransition();

    const handleRun = (full: boolean) => {
        setRunning(full ? "full" : "changes");
        startTransition(async () => {
            try {
                const result = await runSyncAction(full);

                if (result?.error) {
                    toast.error(t("failed", {error: result.error}));
                } else {
                    toast.success(t("applied", {count: result?.applied ?? 0}));
                }
                setMissing(full ? result?.missing ?? [] : []);
                setSources(await getSyncSourcesAction());
            } catch (error) {
                void error;
                toast.error(tc("errorOccurred"));
            } finally {
                setRunning(null);
            }
        });
    };

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {sources.map(source => (
                <Card key={source.name}>
                    <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                            <CardTitle>{t("title", {source: source.name})}</CardTitle>
                            {source.stale && <Badge variant="destructive">{t("stale")}</Badge>}
                        </div>
                        <CardDescription>{t("description")}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                            <dt className="text-muted-foreground">{t("lastPulled")}</dt>
                            <dd>{source.lastPulledAt ? formatDateTime(source.lastPulledAt) : t("never")}</dd>
                            <dt className="text-muted-foreground">{t("lastSuccess")}</dt>
                            <dd>
                                {source.lastError ? (
                                    <span className="inline-flex items-center gap-1 text-destructive">
                                        <CircleAlert className="h-4 w-4"/>{source.lastError}
                                    </span>
                                ) : source.lastSuccess ? (
                                    <span className="inline-flex items-center gap-1">
                                        <CircleCheck className="h-4 w-4 text-green-600"/>{formatDateTime(source.lastSuccess)}
                                    </span>
                                ) : t("never")}
                            </dd>
                            <dt className="text-muted-foreground">{t("appliedTotal")}</dt>
                            <dd>{source.applied}</dd>
                            <dt className="text-muted-foreground">{t("cursor")}</dt>
                            <dd><code className="text-xs">{source.cursor ?? "–"}</code></dd>
                        </dl>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" onClick={() => handleRun(false)} disabled={running !== null}>
                                {running === "changes" ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> :
                                    <RefreshCw className="mr-2 h-4 w-4"/>}
                                {t("pullChanges")}
                            </Button>
                            <Button variant="ghost" onClick={() => handleRun(true)} disabled={running !== null}>
                                {running === "full" && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                {t("pullAll")}
                            </Button>
                        </div>
                        {missing.length > 0 && (
                            <div className="text-sm">
                                <div className="font-medium">{t("missing", {count: missing.length})}</div>
                                <ul className="mt-1 list-disc pl-5 text-muted-foreground">
                                    {missing.map(m => <li key={m}><code className="text-xs">{m}</code></li>)}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
