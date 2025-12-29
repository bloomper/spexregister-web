"use client";

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {TaskCategoryFormInput, TaskCategoryFormOutput, taskCategoryFormSchema} from "@/lib/task/category/schema";
import {TaskCategory} from "@/gql/graphql";
import {useTranslations} from "next-intl";
import {useTransition} from "react";
import {toast} from "sonner";
import {createAction, updateAction,} from "@/app/(app)/tasks/categories/actions.server";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Field, FieldContent, FieldError, FieldLabel} from "@/components/ui/field";
import {translateError} from "@/utils/utils";
import {Checkbox} from "@/components/ui/checkbox";

interface TaskCategoryFormProps {
    item?: TaskCategory;
    onSuccess: () => void;
}

export function TaskCategoryForm({item, onSuccess}: TaskCategoryFormProps) {
    const t = useTranslations();
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        control,
        formState: {errors},
    } = useForm<TaskCategoryFormInput, any, TaskCategoryFormOutput>({
        resolver: zodResolver(taskCategoryFormSchema),
        defaultValues: {
            name: item?.name ?? "",
            actorPresent: item?.actorPresent ?? false,
        },
    });

    const onSubmit = handleSubmit((data) => {
        startTransition(async () => {
            try {
                if (item) {
                    await updateAction(item.id, data);
                } else {
                    await createAction(data);
                }

                toast.success(item ? t("Common.updateSuccess") : t("Common.createSuccess"));
                onSuccess();
            } catch (error) {
                toast.error(t("Common.errorOccurred"));
            }
        });
    });

    return (
        <SheetContent className="sm:max-w-[540px] flex flex-col gap-0 p-0">
            <SheetHeader className="p-6 pb-2">
                <SheetTitle>{item ? t("Task.Category.editHeading") : t("Task.Category.createHeading")}</SheetTitle>
            </SheetHeader>
            <form onSubmit={onSubmit} className="flex-1 overflow-y-auto">
                <div className="space-y-4 px-6 py-4">
                    <Field data-invalid={!!errors.name}>
                        <FieldLabel>{t("Task.Category.name")}</FieldLabel>
                        <FieldContent>
                            <Input {...register("name")} />
                            <FieldError errors={[translateError(errors.name)]}/>
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
                            <FieldError errors={[translateError(errors.actorPresent)]}/>
                        </FieldContent>
                    </Field>
                </div>

                <SheetFooter className="p-6 pt-2">
                    <SheetClose asChild>
                        <Button type="button" variant="outline" disabled={isPending}>
                            {t("Common.cancel")}
                        </Button>
                    </SheetClose>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? t("Common.saving") : t("Common.save")}
                    </Button>
                </SheetFooter>
            </form>
        </SheetContent>
    );
}