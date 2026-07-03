"use client";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {NewsFormInput, NewsFormOutput, newsFormSchema} from "@/lib/news/schema";
import {News} from "@/gql/schema";
import {useTranslations} from "next-intl";
import {useTransition} from "react";
import {toast} from "sonner";
import {createAction, updateAction} from "@/app/(app)/news/actions.server";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {SheetClose, SheetFooter} from "@/components/ui/sheet";
import {Field, FieldContent, FieldError, FieldLabel} from "@/components/ui/field";
import {translateError} from "@/utils/utils";
import {ScrollArea} from "@/components/ui/scroll-area";
import {EditFormShell} from "@/components/edit-queue/edit-form-shell.client";
import {useReportEditQueueFormState} from "@/components/edit-queue/edit-queue-form-state.client";

interface NewsFormProps {
    item?: News;
    onSuccess: (updated?: { id: string }) => void;
    onError?: () => void;
    embedded?: boolean;
    formId?: string;
}

export function NewsForm({item, onSuccess, onError, embedded, formId}: NewsFormProps) {
    const t = useTranslations();
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: {errors, isDirty},
    } = useForm<NewsFormInput, unknown, NewsFormOutput>({
        resolver: zodResolver(newsFormSchema),
        defaultValues: {
            subject: item?.subject ?? "",
            text: item?.text ?? "",
            visibleFrom: item?.visibleFrom ?? new Date().toISOString().split("T")[0],
            visibleTo: item?.visibleTo ?? "",
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
        <EditFormShell embedded={embedded} title={item ? t("News.editHeading") : t("News.createHeading")}>
            <form id={formId} onSubmit={onSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <ScrollArea className="flex-1 border-t min-h-0">
                    <div className="space-y-4 px-6 py-6 pb-12">
                        <Field data-invalid={!!errors.subject}>
                            <FieldLabel>{t("News.subject")}</FieldLabel>
                            <FieldContent>
                                <Input {...register("subject")} />
                                <FieldError errors={[translateError(t, errors.subject)]}/>
                            </FieldContent>
                        </Field>

                        <Field data-invalid={!!errors.text}>
                            <FieldLabel>{t("News.text")}</FieldLabel>
                            <FieldContent>
                                <Textarea {...register("text")} rows={15}/>
                                <FieldError errors={[translateError(t, errors.text)]}/>
                            </FieldContent>
                        </Field>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field data-invalid={!!errors.visibleFrom}>
                                <FieldLabel>{t("News.visibleFrom")}</FieldLabel>
                                <FieldContent>
                                    <Input type="date" {...register("visibleFrom")} />
                                    <FieldError errors={[translateError(t, errors.visibleFrom)]}/>
                                </FieldContent>
                            </Field>

                            <Field data-invalid={!!errors.visibleTo}>
                                <FieldLabel>{t("News.visibleTo")}</FieldLabel>
                                <FieldContent>
                                    <Input type="date" {...register("visibleTo")} />
                                    <FieldError errors={[translateError(t, errors.visibleTo)]}/>
                                </FieldContent>
                            </Field>
                        </div>
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
