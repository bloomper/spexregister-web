"use client";

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {SpexFormInput, SpexFormOutput, spexFormSchema} from "@/lib/spex/schema";
import {Spex, SpexCategory} from "@/gql/schema";
import {useTranslations} from "next-intl";
import {useState, useTransition} from "react";
import {toast} from "sonner";
import {
    addCategoryAction,
    createAction,
    createRevivalAction,
    deletePosterAction,
    deleteRevivalAction,
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
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ScrollArea} from "@/components/ui/scroll-area";

interface SpexFormProps {
    item?: Spex;
    categories: SpexCategory[];
    onSuccess: () => void;
}

export function SpexForm({
                             item,
                             categories = [],
                             onSuccess,
                         }: SpexFormProps) {
    const t = useTranslations();
    const [isPending, startTransition] = useTransition();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [shouldDeletePoster, setShouldDeletePoster] = useState(false);
    const [newRevivalYear, setNewRevivalYear] = useState<string>("");

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: {errors},
    } = useForm<SpexFormInput, unknown, SpexFormOutput>({
        resolver: zodResolver(spexFormSchema),
        defaultValues: {
            year: item?.year ?? "",
            title: item?.title ?? "",
            categoryId: item?.category?.id ?? "",
            revivalYears: item?.revivals?.map(r => r?.year.toString() ?? "") ?? [],
        },
    });

    // eslint-disable-next-line react-hooks/incompatible-library
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
                void error;
                toast.error(t("Common.errorOccurred"));
            }
        });
    });

    return (
        <SheetContent className="sm:max-w-150 flex flex-col gap-0 p-0 h-full">
            <SheetHeader className="p-6 pb-2 shrink-0">
                <SheetTitle>{item ? t("Spex.editHeading") : t("Spex.createHeading")}</SheetTitle>
            </SheetHeader>
            <form onSubmit={onSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <Tabs defaultValue="general" className="flex-1 flex flex-col min-h-0">
                    <div className="px-6 pb-4 shrink-0">
                        <TabsList className="grid w-full h-auto! min-h-9 p-1 bg-muted/50 grid-cols-2">
                            <TabsTrigger value="general" className="py-2 text-xs sm:text-sm">
                                {t("Common.general")}
                            </TabsTrigger>
                            <TabsTrigger value="revivals" className="py-2 text-xs sm:text-sm">
                                {t("Spex.revivals")}
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <ScrollArea className="flex-1 border-t min-h-0">
                        <div className="px-6 py-4">
                            <TabsContent value="general" className="mt-0 space-y-4 outline-none pb-8">
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
                                        <FieldError errors={[translateError(t, errors.categoryId)]}/>
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
                                        <FieldError errors={[translateError(t, errors.year)]}/>
                                    </FieldContent>
                                </Field>

                                <Field data-invalid={!!errors.title}>
                                    <FieldLabel>{t("Spex.title")}</FieldLabel>
                                    <FieldContent>
                                        <Input {...register("title")} />
                                        <FieldError errors={[translateError(t, errors.title)]}/>
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
                            </TabsContent>

                            <TabsContent value="revivals" className="mt-0 space-y-6 outline-none pb-8">
                                <div className="space-y-4">
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
                                        {selectedYear && revivalYears.length === 0 && (
                                            <p className="text-sm text-muted-foreground italic">{t("Spex.noRevivals")}</p>
                                        )}
                                    </div>

                                    {availableRevivalYears.length > 0 && selectedYear ? (
                                        <div className="flex gap-2 p-4 border rounded-lg bg-muted/20">
                                            <div className="flex-1 space-y-1">
                                                <span
                                                    className="text-xs font-medium text-muted-foreground uppercase">{t("Spex.year")}</span>
                                                <Select value={newRevivalYear} onValueChange={setNewRevivalYear}>
                                                    <SelectTrigger className="h-10 w-full bg-background">
                                                        <SelectValue placeholder={t("Spex.year")}/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {availableRevivalYears.map(year => (
                                                            <SelectItem key={year} value={year}>{year}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex items-end">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    className="h-10"
                                                    onClick={() => {
                                                        if (newRevivalYear) {
                                                            setValue("revivalYears", [...revivalYears, newRevivalYear].sort((a, b) => a.localeCompare(b)));
                                                            setNewRevivalYear("");
                                                        }
                                                    }}
                                                    disabled={!newRevivalYear}
                                                >
                                                    <Plus className="h-4 w-4 mr-2"/>
                                                    {t("Common.add")}
                                                </Button>
                                            </div>
                                        </div>
                                    ) : !selectedYear && (
                                        <p className="text-sm text-muted-foreground italic text-center py-4">
                                            {t("Spex.selectYearFirst")}
                                        </p>
                                    )}
                                </div>
                            </TabsContent>
                        </div>
                    </ScrollArea>
                </Tabs>

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
