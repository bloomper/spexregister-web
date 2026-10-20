"use client";

import {useState, useTransition} from "react";
import {useTranslations} from "next-intl";
import {toast} from "sonner";
import {Download, Loader2, UserX} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Textarea} from "@/components/ui/textarea";
import {useJobTracker} from "@/hooks/use-job-tracker.client";
import {ImpexType} from "@/gql/schema";
import {exportMineAction, getMineExportStatusAction, requestRemovalAction} from "@/app/(app)/my-profile/actions.server";

const REASON_MAX_LENGTH = 2000;

export function MyData() {
    const t = useTranslations();
    const [jobId, setJobId] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [isRemovalOpen, setIsRemovalOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [isPending, startTransition] = useTransition();

    useJobTracker(jobId, (succeeded) => {
        if (succeeded && jobId) {
            const link = document.createElement("a");
            link.href = `/api/impex-result-download-proxy?id=${encodeURIComponent(jobId)}`;
            link.download = "";
            link.click();
        }
        setJobId(null);
        setIsExporting(false);
    }, getMineExportStatusAction);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const result = await exportMineAction(ImpexType.Excel);
            setJobId(result.id);
            toast.info(t("Impex.exportStarted"));
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            toast.error(t("Impex.exportFailed"), {description: message});
            setIsExporting(false);
        }
    };

    const handleRemovalRequest = () => {
        startTransition(async () => {
            try {
                await requestRemovalAction({reason});
                toast.success(t("MyData.removalRequestSent"));
                setIsRemovalOpen(false);
                setReason("");
            } catch (error) {
                void error;
                toast.error(t("MyData.removalRequestFailed"));
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("MyData.heading")}</CardTitle>
                <CardDescription>
                    <p>{t("MyData.description")}</p>
                    <p className="mt-2">{t("MyData.unpublishHint")}</p>
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" onClick={handleExport} disabled={isExporting}>
                    {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> :
                        <Download className="mr-2 h-4 w-4"/>}
                    {t("MyData.export")}
                </Button>
                <Button variant="outline" className="text-destructive" onClick={() => setIsRemovalOpen(true)}>
                    <UserX className="mr-2 h-4 w-4"/>
                    {t("MyData.requestRemoval")}
                </Button>
            </CardContent>

            <Dialog open={isRemovalOpen} onOpenChange={(open) => !isPending && setIsRemovalOpen(open)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{t("MyData.requestRemoval")}</DialogTitle>
                        <DialogDescription>{t("MyData.removalRequestDescription")}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2">
                        <label htmlFor="removal-reason" className="text-sm font-medium">
                            {t("MyData.reason")}
                        </label>
                        <Textarea
                            id="removal-reason"
                            value={reason}
                            maxLength={REASON_MAX_LENGTH}
                            onChange={(e) => setReason(e.target.value)}
                            disabled={isPending}
                            rows={5}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRemovalOpen(false)} disabled={isPending}>
                            {t("Common.cancel")}
                        </Button>
                        <Button variant="destructive" onClick={handleRemovalRequest} disabled={isPending}>
                            {isPending ? t("MyData.sending") : t("MyData.send")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
