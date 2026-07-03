"use client";

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {TaskCategoryFormInput, TaskCategoryFormOutput, taskCategoryFormSchema} from "@/lib/task/category/schema";
import {TaskCategory} from "@/gql/schema";
import {useTranslations} from "next-intl";
import {useTransition} from "react";
import {toast} from "sonner";
import {createAction, updateAction,} from "@/app/(app)/tasks/categories/actions.server";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {SheetClose, SheetFooter} from "@/components/ui/sheet";
import {Field, FieldContent, FieldError, FieldLabel} from "@/components/ui/field";
import {translateError} from "@/utils/utils";
import {Checkbox} from "@/components/ui/checkbox";
import {ScrollArea} from "@/components/ui/scroll-area";
import {EditFormShell} from "@/components/edit-queue/edit-form-shell.client";
import {useReportEditQueueFormState} from "@/components/edit-queue/edit-queue-form-state.client";

interface TaskCategoryFormProps {
    item?: TaskCategory;
    onSuccess: (updated?: { id: string }) => void;
    onError?: () => void;
    embedded?: boolean;
    formId?: string;
}

export function TaskCategoryForm({item, onSuccess, onError, embedded, formId}: TaskCategoryFormProps) {
    const t = useTranslations();
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        control,
        formState: {errors, isDirty},
    } = useForm<TaskCategoryFormInput, unknown, TaskCategoryFormOutput>({
        resolver: zodResolver(taskCategoryFormSchema),
        defaultValues: {
            name: item?.name ?? "",
            actorPresent: item?.actorPresent ?? false,
        },
    });

    useReportEditQueueFormState({isDirty});

    const onSubmit = handleSubmit((data) => {
        startTransition(async () => {
            try {
                if (item) {
                    await updateAction(item.id, data);
                } else {
                    await createAction(data);
                }

                toast.success(item ? t("Common.updateSuccess") : t("Common.createSuccess"));
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
        <EditFormShell embedded={embedded}
                       title={item ? t("Task.Category.editHeading") : t("Task.Category.createHeading")}>
            <form id={formId} onSubmit={onSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <ScrollArea className="flex-1 border-t min-h-0">
                    <div className="space-y-4 px-6 py-6 pb-12">
                        <Field data-invalid={!!errors.name}>
                            <FieldLabel>{t("Task.Category.name")}</FieldLabel>
                            <FieldContent>
                                <Input {...register("name")} disabled={isPending}/>
                                <FieldError errors={[translateError(t, errors.name)]}/>
                            </FieldContent>
                        </Field>

                        <Field data-invalid={!!errors.actorPresent}>
                            <FieldContent>
                                <div className="flex items-center space-x-2">
                                    <Controller
                                        control={control}
                                        name="actorPresent"
                                        render={({field}) => (
                                            <Checkbox
                                                id="actorPresent"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={isPending}
                                            />
                                        )}
                                    />
                                    <label
                                        htmlFor="actorPresent"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {t("Task.Category.actorPresent")}
                                    </label>
                                </div>
                                <FieldError errors={[translateError(t, errors.actorPresent)]}/>
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
