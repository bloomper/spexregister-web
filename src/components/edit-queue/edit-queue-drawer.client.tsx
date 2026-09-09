"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import {useTranslations} from "next-intl";
import {ChevronLeft, ChevronRight, Save, Trash2, X} from "lucide-react";
import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Spinner} from "@/components/ui/spinner";
import {useEditQueue, type EntityType} from "@/components/edit-queue/edit-queue-provider.client";
import {editQueueRegistry} from "@/components/edit-queue/registry.client";
import {
    EditQueueFormStateProvider,
    IDLE_FORM_STATE,
    type EditQueueFormState,
} from "@/components/edit-queue/edit-queue-form-state.client";
import {getEditQueueOptions, type EditQueueOptions} from "@/app/(app)/edit-queue/actions.server";
import {emitDataRefresh} from "@/hooks/use-data-refresh.client";

const EMPTY_OPTIONS: EditQueueOptions = {
    types: [], countries: [], tags: [], tasks: [], taskCategories: [],
    spex: [], spexCategories: [], authorities: [], states: [],
};

type QueueAction =
    | { type: "goTo"; index: number }
    | { type: "close" }
    | { type: "clear" }
    | { type: "remove" };

type SaveMode = "stay" | "next" | "deferred";

export function EditQueueDrawer() {
    const t = useTranslations();
    const {count, index, current, isOpen, setOpen, goTo, updateItem, remove, clear} = useEditQueue();

    const [optionsByType, setOptionsByType] = useState<Partial<Record<EntityType, EditQueueOptions>>>({});
    const [fullItemByKey, setFullItemByKey] = useState<Record<string, { id: string }>>({});
    const [formState, setFormState] = useState<EditQueueFormState>(IDLE_FORM_STATE);
    const [pendingAction, setPendingAction] = useState<QueueAction | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formNonce, setFormNonce] = useState(0);
    const saveModeRef = useRef<SaveMode>("stay");
    const deferredActionRef = useRef<QueueAction | null>(null);

    const entry = current ? editQueueRegistry[current.entityType] : null;
    const options = current ? (optionsByType[current.entityType] ?? EMPTY_OPTIONS) : EMPTY_OPTIONS;
    const optionsReady = !entry?.needsOptions || (current ? !!optionsByType[current.entityType] : false);
    const currentKey = current ? `${current.entityType}:${current.item.id}` : "";
    const resolvedItem = entry?.fetchFull ? fullItemByKey[currentKey] : current?.item;
    const itemReady = !entry?.fetchFull || !!resolvedItem;
    const ready = optionsReady && itemReady;
    const isFirst = index === 0;
    const isLast = index >= count - 1;
    const canSave = ready && !isSaving && formState.canSubmit;

    useEffect(() => {
        if (isOpen && count === 0) {
            setOpen(false);
        }
    }, [isOpen, count, setOpen]);

    useEffect(() => {
        if (!current || !entry?.needsOptions || optionsByType[current.entityType]) {
            return;
        }
        const type = current.entityType;
        let cancelled = false;
        void getEditQueueOptions(type).then((opts) => {
            if (!cancelled) {
                setOptionsByType((prev) => ({...prev, [type]: opts}));
            }
        });
        return () => {
            cancelled = true;
        };
    }, [current, entry, optionsByType]);

    useEffect(() => {
        if (!current || !entry?.fetchFull || fullItemByKey[currentKey]) {
            return;
        }
        const key = currentKey;
        const id = current.item.id;
        let cancelled = false;
        void entry.fetchFull(id).then((full) => {
            if (!cancelled && full) {
                setFullItemByKey((prev) => ({...prev, [key]: full}));
            }
        });
        return () => {
            cancelled = true;
        };
    }, [current, entry, currentKey, fullItemByKey]);

    const refreshTables = useCallback(() => {
        emitDataRefresh();
    }, []);

    const runAction = useCallback((action: QueueAction) => {
        setFormState(IDLE_FORM_STATE);

        switch (action.type) {
            case "goTo":
                goTo(action.index);
                return;
            case "remove":
                if (current) {
                    remove(current.entityType, current.item.id);
                }
                return;
            case "clear":
                clear();
                refreshTables();
                return;
            case "close":
                setOpen(false);
                refreshTables();
                return;
        }
    }, [goTo, remove, current, clear, setOpen, refreshTables]);

    const requestAction = useCallback((action: QueueAction) => {
        if (formState.isDirty && !isSaving) {
            setPendingAction(action);
            return;
        }
        runAction(action);
    }, [formState.isDirty, isSaving, runAction]);

    const submitCurrent = useCallback((mode: SaveMode) => {
        if (!entry) {
            return;
        }
        const form = document.getElementById(entry.formId);
        if (!(form instanceof HTMLFormElement)) {
            return;
        }
        saveModeRef.current = mode;
        setIsSaving(true);
        form.requestSubmit();
    }, [entry]);

    const handleSaved = useCallback((updated?: { id: string }) => {
        setIsSaving(false);
        setFormState(IDLE_FORM_STATE);

        if (current && entry) {
            const type = current.entityType;
            const id = current.item.id;
            const key = currentKey;
            const fetchFull = entry.fetchFull;

            if (updated) {
                updateItem(type, id, updated);
                if (fetchFull) {
                    setFullItemByKey((prev) => ({...prev, [key]: {...prev[key], ...updated}}));
                }
            }

            void entry.getById(id).then((fresh) => {
                if (fresh) {
                    updateItem(type, id, fresh);
                    if (fetchFull) {
                        setFullItemByKey((prev) => ({...prev, [key]: fresh}));
                    }
                }
            });
        }

        refreshTables();
        setFormNonce((n) => n + 1);

        const mode = saveModeRef.current;
        saveModeRef.current = "stay";

        if (mode === "next") {
            goTo(index + 1);
            return;
        }

        if (mode === "deferred") {
            const action = deferredActionRef.current;
            deferredActionRef.current = null;
            if (action) {
                runAction(action);
            }
        }
    }, [current, entry, currentKey, updateItem, refreshTables, goTo, index, runAction]);

    const handleError = useCallback(() => {
        setIsSaving(false);
        deferredActionRef.current = null;
    }, []);

    const handleOpenChange = useCallback((open: boolean) => {
        if (open) {
            setOpen(true);
            return;
        }
        requestAction({type: "close"});
    }, [setOpen, requestAction]);

    if (!current || !entry) {
        return null;
    }

    const label = entry.labelOf(current.item) || t("EditQueue.untitled");

    return (
        <>
            <Sheet open={isOpen} onOpenChange={handleOpenChange}>
                <SheetContent className="sm:max-w-150 flex flex-col gap-0 p-0 h-full">
                    <SheetHeader className="p-6 pb-4 shrink-0 border-b">
                        <div className="flex min-w-0 flex-col gap-1 pr-8">
                            <SheetTitle className="truncate">{label}</SheetTitle>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary">{t(`EditQueue.types.${current.entityType}`)}</Badge>
                                <span className="text-xs text-muted-foreground">
                                    {t("EditQueue.position", {current: index + 1, total: count})}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8"
                                onClick={() => requestAction({type: "remove"})}
                                disabled={isSaving}
                            >
                                <X className="mr-1 h-4 w-4"/>
                                {t("EditQueue.removeFromQueue")}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8"
                                onClick={() => requestAction({type: "clear"})}
                                disabled={isSaving}
                            >
                                <Trash2 className="mr-1 h-4 w-4"/>
                                {t("EditQueue.clearQueue")}
                            </Button>
                        </div>
                    </SheetHeader>

                    <div className="flex-1 min-h-0 overflow-hidden">
                        {ready && resolvedItem ? (
                            <EditQueueFormStateProvider onFormStateChange={setFormState}>
                                <entry.Form
                                    key={`${currentKey}#${formNonce}`}
                                    item={resolvedItem}
                                    options={options}
                                    onSuccess={handleSaved}
                                    onError={handleError}
                                />
                            </EditQueueFormStateProvider>
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <Spinner className="size-8 text-muted-foreground"/>
                            </div>
                        )}
                    </div>

                    <div className="p-6 pt-4 border-t bg-muted/30 shrink-0 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => requestAction({type: "goTo", index: index - 1})}
                                disabled={isFirst || isSaving}
                            >
                                <ChevronLeft className="mr-1 h-4 w-4"/>
                                {t("EditQueue.prev")}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => requestAction({type: "goTo", index: index + 1})}
                                disabled={isLast || isSaving}
                            >
                                {t("EditQueue.next")}
                                <ChevronRight className="ml-1 h-4 w-4"/>
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => submitCurrent("stay")}
                                disabled={!canSave}
                            >
                                <Save className="mr-1 h-4 w-4"/>
                                {isSaving ? t("Common.saving") : t("Common.save")}
                            </Button>
                            <Button
                                type="button"
                                onClick={() => submitCurrent("next")}
                                disabled={!canSave || isLast}
                            >
                                {t("EditQueue.saveAndNext")}
                                <ChevronRight className="ml-1 h-4 w-4"/>
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            <AlertDialog open={!!pendingAction} onOpenChange={(open) => !open && setPendingAction(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("EditQueue.unsavedHeading")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t("EditQueue.unsavedConfirmation")}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t("Common.cancel")}</AlertDialogCancel>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                const action = pendingAction;
                                setPendingAction(null);
                                if (action) {
                                    runAction(action);
                                }
                            }}
                        >
                            {t("EditQueue.discardChanges")}
                        </Button>
                        <AlertDialogAction
                            disabled={!canSave}
                            onClick={(e) => {
                                e.preventDefault();
                                deferredActionRef.current = pendingAction;
                                setPendingAction(null);
                                submitCurrent("deferred");
                            }}
                        >
                            {t("EditQueue.saveAndContinue")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
