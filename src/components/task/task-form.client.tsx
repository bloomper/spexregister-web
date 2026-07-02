"use client";

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {TaskFormInput, TaskFormOutput, taskFormSchema} from "@/lib/task/schema";
import {Task, TaskCategory} from "@/gql/schema";
import {useTranslations} from "next-intl";
import {useEffect, useTransition} from "react";
import {toast} from "sonner";
import {addCategoryAction, createAction, removeCategoryAction, updateAction} from "@/app/(app)/tasks/actions.server";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Field, FieldContent, FieldError, FieldLabel} from "@/components/ui/field";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {translateError} from "@/utils/utils";
import {ScrollArea} from "@/components/ui/scroll-area";

interface TaskFormProps {
    item?: Task;
    categories: TaskCategory[];
    onSuccess: () => void;
}

export function TaskForm({
                             item,
                             categories = [],
                             onSuccess,
                         }: TaskFormProps) {
    const t = useTranslations();
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: {errors},
    } = useForm<TaskFormInput, unknown, TaskFormOutput>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            name: item?.name ?? "",
            categoryId: item?.category?.id ?? "none",
        },
    });

    useEffect(() => {
        if (item) {
            setValue("name", item.name);
            setValue("categoryId", item.category?.id ?? "none");
        }
    }, [item, setValue]);

    const onSubmit = handleSubmit((data) => {
        startTransition(async () => {
            try {
                let id = item?.id;
                const normalizedCategoryId = data.categoryId === "none" ? "" : data.categoryId;
                const itemCategoryId = item?.category?.id ?? "none";

                if (item) {
                    await updateAction(item.id, data);
                } else {
                    const newItem = await createAction(data);
                    id = newItem?.id;
                }

                if (id) {
                    const categoryChanged = data.categoryId !== itemCategoryId;

                    if (categoryChanged) {
                        if (normalizedCategoryId) {
                            await addCategoryAction(id, normalizedCategoryId);
                        } else if (item?.category?.id) {
                            await removeCategoryAction(id);
                        }
                    }
                }

                toast.success(item ? t("Common.updateSuccess") : t("Common.createSuccess"));
                onSuccess();
            } catch (error) {
                void error;
                toast.error(t("Common.errorOccurred"));
            }
        });
    });

    return (
        <SheetContent className="sm:max-w-[600px] flex flex-col gap-0 p-0 h-full">
            <SheetHeader className="p-6 pb-4 shrink-0">
                <SheetTitle>{item ? t("Task.editHeading") : t("Task.createHeading")}</SheetTitle>
            </SheetHeader>

            <form onSubmit={onSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <ScrollArea className="flex-1 border-t min-h-0">
                    <div className="space-y-4 px-6 py-6 pb-12">
                        <Field data-invalid={!!errors.categoryId}>
                            <FieldLabel>{t("Task.category")}</FieldLabel>
                            <FieldContent>
                                <Controller
                                    control={control}
                                    name="categoryId"
                                    render={({field}) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={isPending}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={t("Task.selectCategory")}/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">{t("Common.none")}</SelectItem>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <FieldError errors={[translateError(t, errors.categoryId)]}/>
                            </FieldContent>
                        </Field>

                        <Field data-invalid={!!errors.name}>
                            <FieldLabel>{t("Task.name")}</FieldLabel>
                            <FieldContent>
                                <Input {...register("name")} disabled={isPending}/>
                                <FieldError errors={[translateError(t, errors.name)]}/>
                            </FieldContent>
                        </Field>
                    </div>
                </ScrollArea>

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
            </form>
        </SheetContent>
    );
}
