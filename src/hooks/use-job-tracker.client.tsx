import {useEffect, useRef} from "react";
import {toast} from "sonner";
import {getJobStatusAction} from "@/app/(app)/impex/actions.server";
import {useTranslations} from "next-intl";

export function useJobTracker(jobId: string | null, onComplete?: () => void) {
    const t = useTranslations();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!jobId) {
            return;
        }

        const checkStatus = async () => {
            try {
                const status = await getJobStatusAction(jobId);

                if (status?.status === "COMPLETED") {
                    const isExport = status.name?.toLowerCase().includes("export");
                    toast.success(isExport ? t("Impex.exportCompleted") : t("Impex.importCompleted"));

                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                    }
                    onComplete?.();
                } else if (status?.status === "FAILED") {
                    const isExport = status.name?.toLowerCase().includes("export");
                    const errorMsg = status.exitStatus || t("Common.errorOccurred");

                    toast.error(
                        isExport
                            ? t("Impex.exportFailed", {error: errorMsg})
                            : t("Impex.importFailed", {error: errorMsg})
                    );

                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                    }
                    onComplete?.();
                }
            } catch (error) {
                void error;
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
                onComplete?.();
            }
        };

        timerRef.current = setInterval(checkStatus, 3000);

        checkStatus();

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [jobId, onComplete, t]);
}
