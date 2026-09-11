"use client";

import {useState, useTransition} from "react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {useTranslations} from "next-intl";
import {History} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {AuditedType, RestorePreview, RestoreResult} from "@/gql/schema";

const CASCADING_TYPES: AuditedType[] = [AuditedType.Spexare, AuditedType.Activity, AuditedType.TaskActivity];

export type RestoreActions = {
    preview: (type: AuditedType, id: string, revision: number, cascade: boolean) => Promise<RestorePreview>;
    restore: (type: AuditedType, id: string, revision: number, cascade: boolean) => Promise<RestoreResult>;
};

interface RestoreDialogProps {
    id: string;
    type: AuditedType;
    revision: number;
    actions: RestoreActions;
    onRestored?: () => void;
}

export function RestoreDialog({id, type, revision, actions, onRestored}: RestoreDialogProps) {
    const t = useTranslations();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [cascade, setCascade] = useState(false);
    const [preview, setPreview] = useState<RestorePreview | null>(null);
    const [isPending, startTransition] = useTransition();

    const supportsCascade = CASCADING_TYPES.includes(type);

    const loadPreview = (nextCascade: boolean) => {
        setPreview(null);
        startTransition(async () => {
            try {
                setPreview(await actions.preview(type, id, revision, nextCascade));
            } catch (e) {
                console.error("Failed to load restore preview", e);
                toast.error(t("Audit.restoreFailed"));
            }
        });
    };

    const handleOpenChange = (next: boolean) => {
        setOpen(next);
        if (next) {
            loadPreview(cascade);
        }
    };

    const handleCascadeChange = (next: boolean) => {
        setCascade(next);
        loadPreview(next);
    };

    const handleConfirm = () => {
        startTransition(async () => {
            try {
                await actions.restore(type, id, revision, cascade);
                toast.success(t("Audit.restored"));
                setOpen(false);
                onRestored?.();
                router.refresh();
            } catch (e) {
                console.error("Failed to restore revision", e);
                toast.error(t("Audit.restoreFailed"));
            }
        });
    };

    const counts = preview
        ? preview.entries.reduce(
            (acc, entry) => {
                if (entry.action === "UPDATE") acc.updated += 1;
                if (entry.action === "CREATE") acc.created += 1;
                if (entry.action === "DELETE") acc.deleted += 1;
                return acc;
            },
            {updated: 0, created: 0, deleted: 0},
        )
        : null;

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-5 px-1 text-[10px]">
                    <History className="h-3 w-3"/>
                    {t("Audit.restore")}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("Audit.restoreTitle")}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t("Audit.restoreDescription", {revision})}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {supportsCascade && (
                    <div className="flex items-start gap-3 rounded-md border p-3">
                        <Switch id="cascade" checked={cascade} onCheckedChange={handleCascadeChange}
                                disabled={isPending}/>
                        <div className="space-y-0.5">
                            <Label htmlFor="cascade">{t("Audit.cascade")}</Label>
                            <p className="text-xs text-muted-foreground">{t("Audit.cascadeDescription")}</p>
                        </div>
                    </div>
                )}

                <div className="text-sm">
                    {isPending && !preview && <p className="text-muted-foreground">{t("Audit.loadingPreview")}</p>}
                    {preview && counts && (
                        <>
                            <p className="font-medium">
                                {t("Audit.impact", counts)}
                            </p>
                            {preview.entries.length === 0 && (
                                <p className="text-muted-foreground">{t("Audit.noChanges")}</p>
                            )}
                            {preview.warnings.length > 0 && (
                                <ul className="mt-2 list-disc space-y-0.5 pl-4 text-xs text-muted-foreground">
                                    {[...new Set(preview.warnings.map((w) => w.code))].map((code) => (
                                        <li key={code}>{t(`Audit.warnings.${code}`)}</li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>{t("Common.cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm} disabled={isPending || !preview}>
                        {t("Audit.confirm")}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
