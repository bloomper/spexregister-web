"use client";

import {useCallback, useMemo, useState} from "react";
import {FileSpreadsheet, Loader2, Upload} from "lucide-react";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {ImpexType, JobReference} from "@/gql/graphql";
import {useJobTracker} from "@/hooks/use-job-tracker.client";
import {useTranslations} from "next-intl";
import {cn} from "@/utils/utils";
import {useDropzone} from "react-dropzone";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

interface ImportButtonProps {
    importAction: (type: ImpexType, file: File) => Promise<JobReference>;
}

export function ImportButton({ importAction }: ImportButtonProps) {
    const t = useTranslations();
    const [loading, setLoading] = useState(false);
    const [activeJobId, setActiveJobId] = useState<string | null>(null);

    const [open, setOpen] = useState(false);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [selectedType, setSelectedType] = useState<ImpexType | null>(null);

    useJobTracker(activeJobId, () => setActiveJobId(null));

    const allowedTypes = useMemo(() => [ImpexType.Excel, ImpexType.ExcelXls], []);

    const onDrop = useCallback(
        (acceptedFiles: File[], fileRejections: any[]) => {
            if (fileRejections.length > 0) {
                const rejection = fileRejections[0];
                const code = rejection?.errors?.[0]?.code;

                if (code === "file-too-large") {
                    toast.error(t("Common.fileTooLarge"));
                } else {
                    toast.error(t("Common.errorOccurred"));
                }
                return;
            }

            if (acceptedFiles.length > 0) {
                setPendingFile(acceptedFiles[0]);
            }
        },
        [t]
    );

    const {getRootProps, getInputProps, isDragActive, open: openFilePicker} = useDropzone({
        onDrop,
        accept: {
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
            "application/vnd.ms-excel": [".xls"],
        },
        maxSize: 15 * 1024 * 1024,
        multiple: false,
        disabled: loading,
        noClick: true,
    });

    const reset = () => {
        setPendingFile(null);
        setSelectedType(null);
    };

    const startImport = async () => {
        if (!pendingFile || !selectedType) {
            return;
        }
        setLoading(true);
        try {
            const result = await importAction(selectedType, pendingFile);
            setActiveJobId(result.id);
            toast.info(t("Impex.importStarted"));
            setOpen(false);
            reset();
        } catch (e: any) {
            const statusCode = e.response?.status || "ERROR";
            toast.error(t("Impex.importFailed", {statusCode}));
        } finally {
            setLoading(false);
        }
    };

    const canStart = !!pendingFile && !!selectedType && !loading;

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                className="h-8"
                disabled={loading}
                onClick={() => setOpen(true)}
                title={`${t("Common.clickToUpload")} ${t("Common.dragAndDrop")}`}
            >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Upload className="mr-2 h-4 w-4"/>}
                {t("Impex.import")}
            </Button>

            <Dialog
                open={open}
                onOpenChange={(next) => {
                    setOpen(next);
                    if (!next) reset();
                }}
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl pr-6">{t("Impex.import")}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div
                                {...getRootProps()}
                                className={cn(
                                    "relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 transition-colors min-h-[150px]",
                                    isDragActive ? "border-primary bg-primary/5" : "hover:bg-muted/50",
                                    loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                                )}
                            >
                                <input {...getInputProps()} />

                                {pendingFile ? (
                                    <div className="w-full flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">{pendingFile.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {(pendingFile.size / (1024 * 1024)).toFixed(2)} MB
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => openFilePicker()}
                                                disabled={loading}
                                            >
                                                {t("Common.select")}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setPendingFile(null)}
                                                disabled={loading}
                                            >
                                                {t("Common.reset")}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center space-y-2 text-center">
                                        <div className="bg-primary/10 p-3 rounded-full">
                                            {loading ? (
                                                <Loader2 className="h-6 w-6 animate-spin"/>
                                            ) : (
                                                <Upload className="h-6 w-6 text-primary"/>
                                            )}
                                        </div>

                                        <div className="text-sm">
                                            <span className="font-semibold text-primary">{t("Common.clickToUpload")}</span>
                                            <p className="text-muted-foreground">{t("Common.dragAndDrop")}</p>
                                        </div>

                                        <p className="text-xs text-muted-foreground/70">
                                            {t("Impex.importUploadHint")}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                {t("Impex.selectFormat")}
                            </p>

                            <Select
                                value={selectedType ?? undefined}
                                onValueChange={(v) => setSelectedType(v as ImpexType)}
                                disabled={!pendingFile || loading}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={pendingFile ? t("Impex.selectFormat") : t("Common.select")}/>
                                </SelectTrigger>
                                <SelectContent>
                                    {allowedTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            <span className="flex items-center">
                                                <FileSpreadsheet className="mr-2 h-4 w-4"/>
                                                {t(`Impex.types.${type}`)}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                            {t("Common.cancel")}
                        </Button>
                        <Button onClick={startImport} disabled={!canStart}>
                            {loading ? t("Common.loading") : t("Impex.import")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
