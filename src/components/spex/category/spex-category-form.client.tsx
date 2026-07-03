"use client";

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {SpexCategoryFormInput, SpexCategoryFormOutput, spexCategoryFormSchema} from "@/lib/spex/category/schema";
import {SpexCategory} from "@/gql/schema";
import {useTranslations} from "next-intl";
import {useState, useTransition} from "react";
import {toast} from "sonner";
import {
    createAction,
    deleteLogoAction,
    updateAction,
    uploadLogoAction
} from "@/app/(app)/spex/categories/actions.server";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {SheetClose, SheetFooter} from "@/components/ui/sheet";
import {Field, FieldContent, FieldError, FieldLabel} from "@/components/ui/field";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ImageUpload} from "@/components/image-upload.client";
import {translateError} from "@/utils/utils";
import {ScrollArea} from "@/components/ui/scroll-area";
import {EditFormShell} from "@/components/edit-queue/edit-form-shell.client";
import {useReportEditQueueFormState} from "@/components/edit-queue/edit-queue-form-state.client";

interface SpexCategoryFormProps {
    item?: SpexCategory;
    onSuccess: (updated?: { id: string }) => void;
    onError?: () => void;
    embedded?: boolean;
    formId?: string;
}

export function SpexCategoryForm({item, onSuccess, onError, embedded, formId}: SpexCategoryFormProps) {
    const t = useTranslations();
    const [isPending, startTransition] = useTransition();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [shouldDeleteLogo, setShouldDeleteLogo] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        formState: {errors, isDirty},
    } = useForm<SpexCategoryFormInput, unknown, SpexCategoryFormOutput>({
        resolver: zodResolver(spexCategoryFormSchema),
        defaultValues: {
            name: item?.name ?? "",
            firstYear: item?.firstYear ?? "",
        },
    });

    const startYear = 1948;
    const endYear = new Date().getFullYear() + 2;
    const years = Array.from(
        {length: endYear - startYear + 1},
        (_, i) => (endYear - i).toString()
    );

    useReportEditQueueFormState({isDirty});

    const onSubmit = handleSubmit((data) => {
        startTransition(async () => {
            try {
                let id = item?.id;
                if (item) {
                    await updateAction(item.id, data);
                } else {
                    const newItem = await createAction(data);
                    id = newItem?.id;
                }

                if (id) {
                    if (selectedFile) {
                        const formData = new FormData();
                        formData.append("file", selectedFile);
                        await uploadLogoAction(id, formData);
                    } else if (shouldDeleteLogo) {
                        await deleteLogoAction(id);
                    }
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
                       title={item ? t("Spex.Category.editHeading") : t("Spex.Category.createHeading")}>
            <form id={formId} onSubmit={onSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <ScrollArea className="flex-1 border-t min-h-0">
                    <div className="space-y-4 px-6 py-6 pb-12">
                        <Field data-invalid={!!errors.name}>
                            <FieldLabel>{t("Spex.Category.name")}</FieldLabel>
                            <FieldContent>
                                <Input {...register("name")} disabled={isPending}/>
                                <FieldError errors={[translateError(t, errors.name)]}/>
                            </FieldContent>
                        </Field>

                        <Field data-invalid={!!errors.firstYear}>
                            <FieldLabel>{t("Spex.Category.firstYear")}</FieldLabel>
                            <FieldContent>
                                <Controller
                                    control={control}
                                    name="firstYear"
                                    render={({field}) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value?.toString()}
                                            disabled={isPending}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={t("Spex.Category.firstYearPlaceholder")}/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {years.map((year) => (
                                                    <SelectItem key={year} value={year}>
                                                        {year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <FieldError errors={[translateError(t, errors.firstYear)]}/>
                            </FieldContent>
                        </Field>

                        <Field>
                            <FieldLabel>{t("Spex.Category.logoUrl")}</FieldLabel>
                            <FieldContent>
                                <ImageUpload
                                    initialImageUrl={item?.logoUrl}
                                    onFileSelect={(file) => {
                                        setSelectedFile(file);
                                        setShouldDeleteLogo(false);
                                    }}
                                    onFileDelete={() => {
                                        setSelectedFile(null);
                                        setShouldDeleteLogo(true);
                                    }}
                                />
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
