"use client";

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {SpexFormInput, SpexFormOutput, spexFormSchema} from "@/lib/spex/schema";
import {Spex, SpexCategory} from "@/gql/graphql";
import {useTranslations} from "next-intl";
import {useEffect, useState, useTransition} from "react";
import {toast} from "sonner";
import {
    addCategoryAction,
    createAction,
    createRevivalAction,
    deletePosterAction,
    deleteRevivalAction,
    getAllCategoriesAction,
    removeCategoryAction,
    updateAction,
    uploadPosterAction
} from "@/app/(app)/spex/actions.server";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Field, FieldContent, FieldError, FieldLabel} from "@/components/ui/field";
import {ImageUpload} from "@/components/image-upload.client";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Plus, X} from "lucide-react";
import {translateError} from "@/utils/utils";

interface SpexFormProps {
    item?: Spex;
    onSuccess: () => void;
}

export function SpexForm({item, onSuccess}: SpexFormProps) {
    const t = useTranslations();
    const [isPending, startTransition] = useTransition();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [shouldDeletePoster, setShouldDeletePoster] = useState(false);
    const [categories, setCategories] = useState<SpexCategory[]>([]);
    const [newRevivalYear, setNewRevivalYear] = useState<string>("");

    useEffect(() => {
        getAllCategoriesAction().then(setCategories);
    }, []);

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: {errors},
    } = useForm<SpexFormInput, any, SpexFormOutput>({
        resolver: zodResolver(spexFormSchema),
        defaultValues: {
            year: item?.year ?? "",
            title: item?.title ?? "",
            categoryId: item?.category?.id ?? "",
            revivalYears: item?.revivals?.map(r => r?.year.toString() ?? "") ?? [],
        },
    });

    const selectedCategoryId = watch("categoryId");
    const selectedCategory = categories.find(c => c.id === selectedCategoryId);
    const selectedYear = watch("year");
    const revivalYears = watch("revivalYears") ?? [];

    const availableYears = (() => {
        if (!selectedCategory?.firstYear) {
            return [];
        }
        const endYear = new Date().getFullYear() + 2;
        const startYear = selectedCategory.firstYear;
        return Array.from(
            {length: endYear - startYear + 1},
            (_, i) => (endYear - i).toString()
        );
    })();

    const availableRevivalYears = availableYears.filter(y =>
        parseInt(y) > parseInt(selectedYear) && !revivalYears.includes(y)
    );

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
                    const categoryChanged = data.categoryId !== (item?.category?.id ?? "");

                    if (categoryChanged) {
                        if (data.categoryId) {
                            await addCategoryAction(id, data.categoryId);
                        } else if (item?.category?.id) {
                            await removeCategoryAction(id);
                        }
                    }

                    const existingRevivals = (item?.revivals ?? []).filter((r) => r !== null);
                    const currentYearStrings = existingRevivals.map(r => r.year.toString());

                    const yearsToAdd = (data.revivalYears ?? []).filter(y => !currentYearStrings.includes(y));
                    const revivalsToRemove = existingRevivals.filter(r => !(data.revivalYears ?? []).includes(r.year.toString()));

                    await Promise.all([
                        ...yearsToAdd.map(year => createRevivalAction(id!, year)),
                        ...revivalsToRemove.map(r => deleteRevivalAction(id!, r.id)),
                    ]);

                    if (selectedFile) {
                        const formData = new FormData();
                        formData.append("file", selectedFile);
                        await uploadPosterAction(id, formData);
                    } else if (shouldDeletePoster) {
                        await deletePosterAction(id);
                    }
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
                <SheetTitle>{item ? t("Spex.editHeading") : t("Spex.createHeading")}</SheetTitle>
            </SheetHeader>
            <form onSubmit={onSubmit} className="flex-1 overflow-y-auto">
                <div className="space-y-4 px-6 py-4">
                    <Field data-invalid={!!errors.categoryId}>
                        <FieldLabel>{t("Spex.category")}</FieldLabel>
                        <FieldContent>
                            <Controller
                                control={control}
                                name="categoryId"
                                render={({field}) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={t("Spex.selectCategory")}/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FieldError errors={[translateError(errors.categoryId)]}/>
                        </FieldContent>
                    </Field>

                    <Field data-invalid={!!errors.year}>
                        <FieldLabel>{t("Spex.year")}</FieldLabel>
                        <FieldContent>
                            <Controller
                                control={control}
                                name="year"
                                render={({field}) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value?.toString()}
                                        disabled={!selectedCategory}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={t("Spex.selectYear")}/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableYears.map((year) => (
                                                <SelectItem key={year} value={year}>
                                                    {year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FieldError errors={[translateError(errors.year)]}/>
                        </FieldContent>
                    </Field>

                    <Field data-invalid={!!errors.title}>
                        <FieldLabel>{t("Spex.title")}</FieldLabel>
                        <FieldContent>
                            <Input {...register("title")} />
                            <FieldError errors={[translateError(errors.title)]}/>
                        </FieldContent>
                    </Field>

                    <Field>
                        <FieldLabel>{t("Spex.posterUrl")}</FieldLabel>
                        <FieldContent>
                            <ImageUpload
                                initialImageUrl={item?.posterUrl}
                                onFileSelect={(file) => {
                                    setSelectedFile(file);
                                    setShouldDeletePoster(false);
                                }}
                                onFileDelete={() => {
                                    setSelectedFile(null);
                                    setShouldDeletePoster(true);
                                }}
                            />
                        </FieldContent>
                    </Field>

                    <div className="pt-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">{t("Spex.revivals")}</h3>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {revivalYears.map(year => (
                                <div key={year}
                                     className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
                                    {year}
                                    <button
                                        type="button"
                                        onClick={() => setValue("revivalYears", revivalYears.filter(y => y !== year))}
                                        className="hover:text-destructive transition-colors"
                                    >
                                        <X className="h-3 w-3"/>
                                    </button>
                                </div>
                            ))}
                            {revivalYears.length === 0 && (
                                <p className="text-sm text-muted-foreground italic">{t("Spex.noRevivals")}</p>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Select value={newRevivalYear} onValueChange={setNewRevivalYear}
                                    disabled={!selectedYear}>
                                <SelectTrigger className="h-9 w-[120px]">
                                    <SelectValue placeholder={t("Spex.year")}/>
                                </SelectTrigger>
                                <SelectContent>
                                    {availableRevivalYears.map(year => (
                                        <SelectItem key={year} value={year}>{year}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                type="button"
                                variant="outline"
                                className="h-9"
                                onClick={() => {
                                    if (newRevivalYear) {
                                        setValue("revivalYears", [...revivalYears, newRevivalYear].sort((a, b) => a.localeCompare(b)));
                                        setNewRevivalYear("");
                                    }
                                }}
                                disabled={!newRevivalYear}
                            >
                                <Plus className="h-4 w-4 mr-1"/>
                                {t("Common.add")}
                            </Button>
                        </div>
                    </div>
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