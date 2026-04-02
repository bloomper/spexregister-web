"use client";

import {useState} from "react";
import {Download, FileSpreadsheet, FileText, Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {ImpexType, JobReference, ReportType} from "@/gql/graphql";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {useJobTracker} from "@/hooks/use-job-tracker.client";
import {useTranslations} from "next-intl";

type ExportAction = (ids: string[] | null, filter: string | null, type: ImpexType) => Promise<JobReference>;
type ExportActionWithReportType = (ids: string[] | null, filter: string | null, type: ImpexType, reportType: ReportType) => Promise<JobReference>;

interface ExportButtonProps {
    exportAction: ExportAction | ExportActionWithReportType;
    selectedIds?: string[];
    filterQuery?: string;
    getFilterQuery?: () => string | null;
    requiresReportType?: boolean;
}

export function ExportButton({
                                 exportAction,
                                 selectedIds = [],
                                 filterQuery,
                                 getFilterQuery,
                                 requiresReportType = false
                             }: ExportButtonProps) {
    const t = useTranslations();
    const [loading, setLoading] = useState(false);
    const [activeJobId, setActiveJobId] = useState<string | null>(null);

    useJobTracker(activeJobId, () => setActiveJobId(null));

    const handleExport = async (type: ImpexType, reportType?: ReportType) => {
        setLoading(true);
        try {
            const ids = selectedIds.length > 0 ? selectedIds : null;
            const filter = getFilterQuery?.() ?? filterQuery ?? null;

            let result: JobReference;

            if (requiresReportType && reportType) {
                result = await (exportAction as ExportActionWithReportType)(ids, filter, type, reportType);
            } else {
                result = await (exportAction as ExportAction)(ids, filter, type);
            }

            setActiveJobId(result.id);
            toast.info(t("Impex.exportStarted"));
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            toast.error(t("Impex.exportFailed"), {description: message});
        } finally {
            setLoading(false);
        }
    };

    const label = `${t("Impex.export")}${selectedIds.length > 0 ? ` (${selectedIds.length})` : ""}`;
    const standardTypes = Object.values(ImpexType).filter(v => v !== ImpexType.Pdf);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Download className="mr-2 h-4 w-4"/>}
                    {label}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{t("Impex.selectFormat")}</DropdownMenuLabel>
                <DropdownMenuSeparator/>

                {standardTypes.map((type) => (
                    <DropdownMenuItem key={type} onClick={() => handleExport(type)}>
                        <FileSpreadsheet className="mr-2 h-4 w-4"/>
                        {t(`Impex.types.${type}`)}
                    </DropdownMenuItem>
                ))}

                {requiresReportType && (
                    <>
                        <DropdownMenuSeparator/>
                        <DropdownMenuLabel>{t("Impex.types.PDF")}</DropdownMenuLabel>
                        {Object.values(ReportType).map((reportType) => (
                            <DropdownMenuItem key={reportType} onClick={() => handleExport(ImpexType.Pdf, reportType)}>
                                <FileText className="mr-2 h-4 w-4"/>
                                {t(`Impex.reportTypes.${reportType}`)}
                            </DropdownMenuItem>
                        ))}
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
