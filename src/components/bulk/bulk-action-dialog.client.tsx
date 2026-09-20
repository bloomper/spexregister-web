"use client";

import {useState, useTransition} from "react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {useTranslations} from "next-intl";
import {AlertTriangle} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";
import {BulkResult, SpexareBulkInput, SpexareBulkOperation} from "@/gql/schema";
import {BulkOptions, BulkPayload, findBulkOperation} from "@/components/bulk/registry.client";

export type BulkActions = {
    preview: (input: SpexareBulkInput) => Promise<BulkResult>;
    apply: (input: SpexareBulkInput, reason: string) => Promise<BulkResult>;
};

export type BulkTargetChoice = "selection" | "filter";

interface BulkActionDialogProps {
    operation: SpexareBulkOperation | null;
    onClose: () => void;
    options: BulkOptions;
    actions: BulkActions;
    selectedIds: string[];
    filter: string | null;
}

export function BulkActionDialog({
                                     operation,
                                     onClose,
                                     options,
                                     actions,
                                     selectedIds,
                                     filter,
                                 }: BulkActionDialogProps) {
    const t = useTranslations();
    const router = useRouter();
    const [payload, setPayload] = useState<BulkPayload>({});
    const [target, setTarget] = useState<BulkTargetChoice>(selectedIds.length > 0 ? "selection" : "filter");
    const [preview, setPreview] = useState<{ key: string; result: BulkResult } | null>(null);
    const [applied, setApplied] = useState<BulkResult | null>(null);
    const [isPending, startTransition] = useTransition();

    if (!operation) {
        return null;
    }

    const def = findBulkOperation(operation);
    const operationLabel = t(`Spexare.bulk.operations.${operation}`);
    const canUseSelection = selectedIds.length > 0;
    const canUseFilter = Boolean(filter);
    const effectiveTarget = canUseSelection && canUseFilter ? target : (canUseSelection ? "selection" : "filter");

    const input: SpexareBulkInput = {
        operation,
        target: effectiveTarget === "selection" ? {ids: selectedIds} : {filter},
        ...payload,
    };
    const key = JSON.stringify(input);
    const isPreviewCurrent = preview?.key === key;
    const isComplete = def.isComplete(payload) && (canUseSelection || canUseFilter);

    const close = () => {
        setPayload({});
        setPreview(null);
        setApplied(null);
        onClose();
    };

    const handlePreview = () => {
        startTransition(async () => {
            try {
                setPreview({key, result: await actions.preview(input)});
            } catch (e) {
                console.error("Failed to preview bulk operation", e);
                toast.error(t("Spexare.bulk.previewFailed"));
            }
        });
    };

    const handleApply = () => {
        startTransition(async () => {
            try {
                const reason = t("Spexare.bulk.reason", {
                    operation: operationLabel,
                    count: preview?.result.applied ?? 0,
                });

                const result = await actions.apply(input, reason);

                setApplied(result);
                toast.success(t("Spexare.bulk.applied", {count: result.applied}));
                router.refresh();
            } catch (e) {
                console.error("Failed to apply bulk operation", e);
                toast.error(t("Spexare.bulk.applyFailed"));
            }
        });
    };

    const shown = applied ?? (isPreviewCurrent ? preview.result : null);

    return (
        <Dialog open onOpenChange={(next) => !next && close()}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{operationLabel}</DialogTitle>
                    <DialogDescription>{t("Spexare.bulk.description")}</DialogDescription>
                </DialogHeader>

                <div className="min-w-0 space-y-4">
                    {!applied && (
                        <>
                            {canUseSelection && canUseFilter && (
                                <div className="space-y-1.5">
                                    <Label>{t("Spexare.bulk.target")}</Label>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            type="button"
                                            variant={effectiveTarget === "selection" ? "default" : "outline"}
                                            size="sm"
                                            className="h-8"
                                            disabled={isPending}
                                            onClick={() => setTarget("selection")}
                                        >
                                            {t("Spexare.bulk.targetSelection", {count: selectedIds.length})}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={effectiveTarget === "filter" ? "default" : "outline"}
                                            size="sm"
                                            className="h-8"
                                            disabled={isPending}
                                            onClick={() => setTarget("filter")}
                                        >
                                            {t("Spexare.bulk.targetFilter")}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <def.Fields
                                payload={payload}
                                setPayload={(next) => setPayload(next)}
                                options={options}
                                disabled={isPending}
                            />

                            <Separator/>
                        </>
                    )}

                    {shown ? (
                        <BulkResultSummary result={shown} isApplied={Boolean(applied)}/>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            {isComplete ? t("Spexare.bulk.previewHint") : t("Spexare.bulk.incomplete")}
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={close} disabled={isPending}>
                        {applied ? t("Common.close") : t("Common.cancel")}
                    </Button>
                    {!applied && (
                        isPreviewCurrent ? (
                            <Button
                                onClick={handleApply}
                                disabled={isPending || preview.result.applied === 0}
                            >
                                {t("Spexare.bulk.apply", {count: preview.result.applied})}
                            </Button>
                        ) : (
                            <Button onClick={handlePreview} disabled={isPending || !isComplete}>
                                {t("Spexare.bulk.preview")}
                            </Button>
                        )
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function BulkResultSummary({result, isApplied}: { result: BulkResult; isApplied: boolean }) {
    const t = useTranslations();
    const changed = result.entries.filter((e) => e.outcome === "APPLIED");
    const blocked = result.entries.filter((e) => e.outcome === "NOT_PERMITTED");

    return (
        <div className="min-w-0 space-y-2 text-sm">
            <p className="font-medium">
                {t(isApplied ? "Spexare.bulk.summaryApplied" : "Spexare.bulk.summaryPreview", {
                    applied: result.applied,
                    unchanged: result.unchanged,
                    requested: result.requested,
                })}
            </p>

            {blocked.length > 0 && (
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0"/>
                    {t("Spexare.bulk.blocked", {count: blocked.length})}
                </p>
            )}

            {changed.length > 0 && (
                <ScrollArea className="max-h-48 rounded-md border">
                    <ul className="divide-y text-xs">
                        {changed.map((entry) => (
                            <li key={entry.id} className="flex min-w-0 items-baseline gap-2 px-2 py-1.5">
                                <span className="truncate font-medium">{entry.label}</span>
                                {entry.detail && (
                                    <span className="truncate text-muted-foreground">{entry.detail}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </ScrollArea>
            )}
        </div>
    );
}
