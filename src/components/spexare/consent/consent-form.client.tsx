"use client";

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ConsentFormInput, ConsentFormOutput, consentFormSchema} from "@/lib/spexare/consent/schema";
import {Button} from "@/components/ui/button";
import {useTranslations} from "next-intl";
import {Field, FieldContent, FieldError, FieldLabel} from "@/components/ui/field";
import {translateError} from "@/utils/utils";
import {Type, TypeType} from "@/gql/schema";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Switch} from "@/components/ui/switch";

interface ConsentFormProps {
    defaultValues?: Partial<ConsentFormInput>;
    types: Type[];
    onSubmit: (data: ConsentFormOutput) => void;
    onCancel: () => void;
    isPending?: boolean;
}

export function ConsentForm({defaultValues, types, onSubmit, onCancel, isPending}: ConsentFormProps) {
    const t = useTranslations();
    const consentTypes = types.filter(t => t.type === TypeType.Consent);

    const {
        handleSubmit,
        control,
        formState: {errors},
    } = useForm<ConsentFormInput, unknown, ConsentFormOutput>({
        resolver: zodResolver(consentFormSchema),
        defaultValues: {
            typeId: defaultValues?.typeId ?? (consentTypes[0]?.id || ""),
            value: defaultValues?.value ?? false,
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg bg-muted/20">
            <Field data-invalid={!!errors.typeId}>
                <FieldLabel>{t("Spexare.Consent.type")}</FieldLabel>
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
                                    {consentTypes.map((type) => (
                                        <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <FieldError errors={[translateError(t, errors.typeId)]}/>
                </FieldContent>
            </Field>

            <Field data-invalid={!!errors.value}>
                <FieldContent>
                    <div className="flex items-center justify-between rounded-md border p-3 bg-background">
                        <span
                            className="text-sm font-medium">{t("Spexare.Consent.granted")}/{t("Spexare.Consent.withdrawn")}</span>
                        <Controller
                            control={control}
                            name="value"
                            render={({field}) => (
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={isPending}
                                />
                            )}
                        />
                    </div>
                    <FieldError errors={[translateError(t, errors.value)]}/>
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
