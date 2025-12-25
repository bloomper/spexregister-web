"use client";

import {FieldError as FormError, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {SpexFormInput, SpexFormOutput, spexFormSchema} from "@/lib/spex/schema";
import {Spex} from "@/gql/graphql";
import {useTranslations} from "next-intl";
import {useTransition} from "react";
import {toast} from "sonner";
import {createAction, updateAction} from "@/app/(app)/spex/actions.server";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Field, FieldContent, FieldError, FieldLabel} from "@/components/ui/field";

interface SpexFormProps {
    spex?: Spex;
    onSuccess: () => void;
}

export function SpexForm({spex, onSuccess}: SpexFormProps) {
    const t = useTranslations();
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<SpexFormInput, any, SpexFormOutput>({
        resolver: zodResolver(spexFormSchema),
        defaultValues: {
            year: spex?.year ?? "",
            title: spex?.title ?? "",
        },
    });

    const translateError = (error?: FormError) => {
        if (!error?.message) {
            return error;
        }
        return {
            ...error,
            message: t(error.message as any)
        };
    };

    const onSubmit = handleSubmit((data) => {
        startTransition(async () => {
            try {
                if (spex) {
                    await updateAction(spex.id, data);
                    toast.success(t("Common.updateSuccess"));
                } else {
                    await createAction(data);
                    toast.success(t("Common.createSuccess"));
                }
                onSuccess();
            } catch (error) {
                toast.error(t("Common.errorOccurred"));
            }
        });
    });

    return (
        <SheetContent className="sm:max-w-[540px] flex flex-col gap-0 p-0">
            <SheetHeader className="p-6 pb-2">
                <SheetTitle>{spex ? t("Spex.editHeading") : t("Spex.createHeading")}</SheetTitle>
            </SheetHeader>
            <form onSubmit={onSubmit} className="flex-1 overflow-y-auto">
                <div className="space-y-4 px-6 py-4">
                    <Field data-invalid={!!errors.year}>
                        <FieldLabel>{t("Spex.year")}</FieldLabel>
                        <FieldContent>
                            <Input {...register("year")} />
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