"use client";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {TagFormInput, TagFormOutput, tagFormSchema} from "@/lib/tag/schema";
import {Tag} from "@/gql/schema";
import {useTranslations} from "next-intl";
import {useTransition} from "react";
import {toast} from "sonner";
import {createAction, updateAction} from "@/app/(app)/tags/actions.server";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {SheetClose, SheetFooter} from "@/components/ui/sheet";
import {Field, FieldContent, FieldError, FieldLabel} from "@/components/ui/field";
import {translateError} from "@/utils/utils";
import {ScrollArea} from "@/components/ui/scroll-area";
import {EditFormShell} from "@/components/edit-queue/edit-form-shell.client";
import {useReportEditQueueFormState} from "@/components/edit-queue/edit-queue-form-state.client";

interface TagFormProps {
    item?: Tag;
    onSuccess: (updated?: { id: string }) => void;
    onError?: () => void;
    embedded?: boolean;
    formId?: string;
}

export function TagForm({item, onSuccess, onError, embedded, formId}: TagFormProps) {
    const t = useTranslations();
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: {errors, isDirty},
    } = useForm<TagFormInput, unknown, TagFormOutput>({
        resolver: zodResolver(tagFormSchema),
        defaultValues: {
            name: item?.name ?? "",
        },
    });

    useReportEditQueueFormState({isDirty});

    const onSubmit = handleSubmit((data) => {
        startTransition(async () => {
            try {
                if (item) {
                    await updateAction(item.id, data);
                    toast.success(t("Common.updateSuccess"));
                } else {
                    await createAction(data);
                    toast.success(t("Common.createSuccess"));
                }
                const updated = item ? {...item, ...data} : undefined;
                onSuccess(updated);
            } catch (error) {
                void error;
                toast.error(t("Common.errorOccurred"));
                onError?.();
            }
        });
    });

    return (
        <EditFormShell embedded={embedded} title={item ? t("Tag.editHeading") : t("Tag.createHeading")}>
            <form id={formId} onSubmit={onSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <ScrollArea className="flex-1 border-t min-h-0">
                    <div className="space-y-4 px-6 py-6 pb-12">
                        <Field data-invalid={!!errors.name}>
                            <FieldLabel>{t("Tag.name")}</FieldLabel>
                            <FieldContent>
                                <Input {...register("name")} disabled={isPending}/>
                                <FieldError errors={[translateError(t, errors.name)]}/>
                            </FieldContent>
                        </Field>
                    </div>
                </ScrollArea>

                {!embedded && (
                    <SheetFooter className="p-6 pt-4 border-t bg-muted/30 shrink-0 mt-auto">
                        <SheetClose asChild>
                            <Button type="button" variant="outline" disabled={isPending}>
                                {item ? t("Common.close") : t("Common.cancel")}
                            </Button>
                        </SheetClose>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? t("Common.saving") : t("Common.save")}
                        </Button>
                    </SheetFooter>
                )}
            </form>
        </EditFormShell>
    );
}
