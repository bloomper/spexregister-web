"use client";

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {MembershipFormInput, MembershipFormOutput, membershipFormSchema} from "@/lib/spexare/membership/schema";
import {Button} from "@/components/ui/button";
import {useTranslations} from "next-intl";
import {Field, FieldContent, FieldError, FieldLabel} from "@/components/ui/field";
import {translateError} from "@/utils/utils";
import {Type, TypeType} from "@/gql/graphql";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useMemo} from "react";

interface MembershipFormProps {
    defaultValues?: Partial<MembershipFormInput>;
    types: Type[];
    existingMemberships?: { typeId: string, year: string, id?: string }[];
    onSubmit: (data: MembershipFormOutput) => void;
    onCancel: () => void;
    isPending?: boolean;
}

export function MembershipForm({
                                   defaultValues,
                                   types,
                                   existingMemberships = [],
                                   onSubmit,
                                   onCancel,
                                   isPending
                               }: MembershipFormProps) {
    const t = useTranslations();
    const membershipTypes = types.filter(t => t.type === TypeType.Membership);

    const {
        handleSubmit,
        control,
        watch,
        formState: {errors},
    } = useForm<MembershipFormInput, unknown, MembershipFormOutput>({
        resolver: zodResolver(membershipFormSchema),
        defaultValues: {
            typeId: defaultValues?.typeId ?? (membershipTypes[0]?.id || ""),
            year: defaultValues?.year ?? "",
        },
    });

    const selectedTypeId = watch("typeId");

    const availableYears = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const years = Array.from({length: currentYear - 1900 + 1}, (_, i) => (currentYear - i).toString());

        const usedYears = new Set(
            existingMemberships
                .filter(m => m.typeId === selectedTypeId && m.year !== defaultValues?.year)
                .map(m => m.year)
        );

        return years.filter(year => !usedYears.has(year));
    }, [selectedTypeId, existingMemberships, defaultValues?.year]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg bg-muted/20">
            <Field data-invalid={!!errors.typeId}>
                <FieldLabel>{t("Spexare.Membership.type")}</FieldLabel>
                <FieldContent>
                    <Controller
                        control={control}
                        name="typeId"
                        render={({field}) => (
                            <Select onValueChange={field.onChange} value={field.value} disabled={isPending}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t("Common.selectType")}/>
                                </SelectTrigger>
                                <SelectContent>
                                    {membershipTypes.map((type) => (
                                        <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <FieldError errors={[translateError(t, errors.typeId)]}/>
                </FieldContent>
            </Field>

            <Field data-invalid={!!errors.year}>
                <FieldLabel>{t("Spexare.Membership.year")}</FieldLabel>
                <FieldContent>
                    <Controller
                        control={control}
                        name="year"
                        render={({field}) => (
                            <Select onValueChange={field.onChange} value={field.value} disabled={isPending}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t("Spexare.Membership.selectYear")}/>
                                </SelectTrigger>
                                <SelectContent>
                                    {availableYears.map((year) => (
                                        <SelectItem key={year} value={year}>{year}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <FieldError errors={[translateError(t, errors.year)]}/>
                </FieldContent>
            </Field>

            <div className="flex justify-end gap-2 pt-2 border-t">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending}>
                    {t("Common.cancel")}
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending ? t("Common.saving") : t("Common.save")}
                </Button>
            </div>
        </form>
    );
}
