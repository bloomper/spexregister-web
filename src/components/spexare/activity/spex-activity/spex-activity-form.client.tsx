"use client";

import {useTranslations} from "next-intl";
import {useState, useTransition} from "react";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {SpexActivityFormInput, spexActivityFormSchema} from "@/lib/spexare/activity/spex-activity/schema";
import {createSpexActivityAction, updateSpexActivityAction} from "@/app/(app)/spexare/actions.server";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Field, FieldContent, FieldError, FieldLabel} from "@/components/ui/field";
import {cn, translateError} from "@/utils/utils";
import {Spex, SpexActivity, SpexCategory} from "@/gql/graphql";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Check, ChevronsUpDown, Plus} from "lucide-react";
import {useRouter} from "next/navigation";

interface SpexActivityFormProps {
    spexareId: string;
    activityId: string;
    item?: SpexActivity;
    spex: Spex[];
    spexCategories: SpexCategory[];
    onSuccess?: () => void;
}

export function SpexActivityForm({
                                     spexareId,
                                     activityId,
                                     item,
                                     spex,
                                     spexCategories,
                                     onSuccess
                                 }: SpexActivityFormProps) {
    const t = useTranslations();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
        item?.spex?.category?.id ?? ""
    );

    const {
        handleSubmit,
        control,
        setValue,
        formState: {errors},
    } = useForm<SpexActivityFormInput>({
        resolver: zodResolver(spexActivityFormSchema),
        defaultValues: {
            spexId: item?.spex?.id ?? "",
        },
    });

    const filteredSpex = spex
        .filter((s) => !selectedCategoryId || s.category?.id === selectedCategoryId)
        .sort((a, b) => parseInt(b.year) - parseInt(a.year));

    const onSubmit = handleSubmit((data) => {
        startTransition(async () => {
            try {
                if (item) {
                    await updateSpexActivityAction(spexareId, activityId, data.spexId, item.id);
                } else {
                    await createSpexActivityAction(spexareId, activityId, data.spexId);
                }
                toast.success(t("Common.updateSuccess"));
                router.refresh();
                onSuccess?.();
            } catch (error) {
                void error;
                toast.error(t("Common.errorOccurred"));
            }
        });
    });

    return (
        <form onSubmit={onSubmit} className="space-y-4 pt-2">
            <Field>
                <FieldLabel>{t("Spexare.Activity.SpexActivity.category")}</FieldLabel>
                <FieldContent>
                    <Select
                        value={selectedCategoryId}
                        onValueChange={(val) => {
                            setSelectedCategoryId(val);
                            setValue("spexId", "");
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={t("Spexare.Activity.SpexActivity.selectCategory")}/>
                        </SelectTrigger>
                        <SelectContent>
                            {spexCategories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FieldContent>
            </Field>

            <Field data-invalid={!!errors.spexId}>
                <FieldLabel>{t("Spexare.Activity.SpexActivity.spex")}</FieldLabel>
                <FieldContent>
                    <Controller
                        control={control}
                        name="spexId"
                        render={({field}) => (
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        disabled={!selectedCategoryId}
                                        aria-expanded={open}
                                        className="w-full justify-between font-normal"
                                    >
                                        {field.value
                                            ? spex.find((s) => s.id === field.value)?.year + " - " + spex.find((s) => s.id === field.value)?.title
                                            : t("Spexare.Activity.SpexActivity.selectYear")}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                    <Command className="flex flex-col">
                                        <CommandInput placeholder={t("Common.search")}/>
                                        <CommandList
                                            className="max-h-64 overflow-y-auto"
                                            onWheel={(e) => e.stopPropagation()}
                                        >
                                            <CommandEmpty>{t("Common.noDataFound")}</CommandEmpty>
                                            <CommandGroup>
                                                {filteredSpex.map((s) => (
                                                    <CommandItem
                                                        key={s.id}
                                                        value={`${s.year} ${s.title}`}
                                                        onSelect={() => {
                                                            field.onChange(s.id);
                                                            setOpen(false);
                                                        }}
                                                        className={cn(s.revival && "bg-primary/5")}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                field.value === s.id ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        <div className="flex items-center justify-between w-full gap-4">
                                                                        <span
                                                                            className={cn(s.revival && "font-medium")}>
                                                                            {s.year} - {s.title}
                                                                        </span>
                                                            {s.revival && (
                                                                <span
                                                                    className="text-[9px] uppercase tracking-tighter opacity-60">
                                                                                {t("Spexare.Activity.SpexActivity.revival")}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                    <FieldError errors={[translateError(t, errors.spexId)]}/>
                </FieldContent>
            </Field>

            <div className="flex gap-2">
                {item && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        onClick={onSuccess}
                        disabled={isPending}
                    >
                        {t("Common.cancel")}
                    </Button>
                )}
                <Button type="submit" disabled={isPending} size="sm" className="flex-1">
                    {isPending ? (
                        t("Common.saving")
                    ) : item ? (
                        t("Common.save")
                    ) : (
                        <>
                            <Plus className="mr-2 h-4 w-4"/>
                            {t("Common.add")}
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
