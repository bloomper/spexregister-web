"use client";

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {AddressFormInput, AddressFormOutput, addressFormSchema} from "@/lib/spexare/address/schema";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useTranslations} from "next-intl";
import {Field, FieldContent, FieldError, FieldLabel} from "@/components/ui/field";
import {cn, translateError} from "@/utils/utils";
import {Country, Type, TypeType} from "@/gql/graphql";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";

interface AddressFormProps {
    defaultValues?: Partial<AddressFormInput>;
    types: Type[];
    countries: Country[];
    onSubmit: (data: AddressFormOutput) => void;
    onCancel: () => void;
    isPending?: boolean;
}

export function AddressForm({
                                defaultValues,
                                types,
                                countries,
                                onSubmit,
                                onCancel,
                                isPending
                            }: AddressFormProps) {
    const t = useTranslations();
    const addressTypes = types.filter(t => t.type === TypeType.Address);

    const {
        register,
        handleSubmit,
        control,
        formState: {errors},
    } = useForm<AddressFormInput, unknown, AddressFormOutput>({
        resolver: zodResolver(addressFormSchema),
        defaultValues: {
            typeId: defaultValues?.typeId ?? (addressTypes[0]?.id || ""),
            streetAddress: defaultValues?.streetAddress ?? "",
            postalCode: defaultValues?.postalCode ?? "",
            city: defaultValues?.city ?? "",
            country: defaultValues?.country ?? "",
            phone: defaultValues?.phone ?? "",
            phoneMobile: defaultValues?.phoneMobile ?? "",
            emailAddress: defaultValues?.emailAddress ?? "",
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg bg-muted/20">
            <Field data-invalid={!!errors.typeId}>
                <FieldLabel>{t("Spexare.Address.type")}</FieldLabel>
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
                                    {addressTypes.map((type) => (
                                        <SelectItem key={type.id} value={type.id}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <FieldError errors={[translateError(t, errors.typeId)]}/>
                </FieldContent>
            </Field>

            <Field data-invalid={!!errors.streetAddress}>
                <FieldLabel>{t("Spexare.Address.streetAddress")}</FieldLabel>
                <FieldContent>
                    <Input {...register("streetAddress")} disabled={isPending}/>
                    <FieldError errors={[translateError(t, errors.streetAddress)]}/>
                </FieldContent>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field data-invalid={!!errors.postalCode}>
                    <FieldLabel>{t("Spexare.Address.postalCode")}</FieldLabel>
                    <FieldContent>
                        <Input {...register("postalCode")} disabled={isPending}/>
                        <FieldError errors={[translateError(t, errors.postalCode)]}/>
                    </FieldContent>
                </Field>

                <Field data-invalid={!!errors.city}>
                    <FieldLabel>{t("Spexare.Address.city")}</FieldLabel>
                    <FieldContent>
                        <Input {...register("city")} disabled={isPending}/>
                        <FieldError errors={[translateError(t, errors.city)]}/>
                    </FieldContent>
                </Field>
            </div>

            <Field data-invalid={!!errors.country}>
                <FieldLabel>{t("Spexare.Address.country")}</FieldLabel>
                <FieldContent>
                    <Controller
                        control={control}
                        name="country"
                        render={({field}) => (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                            "w-full justify-between font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        disabled={isPending}
                                    >
                                        {field.value
                                            ? countries.find((c) => c.isoCode === field.value)?.label
                                            : t("Spexare.Address.selectCountry")}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                    <Command>
                                        <CommandInput placeholder={t("Common.search")}/>
                                        <CommandList>
                                            <CommandEmpty>{t("Common.noDataFound")}</CommandEmpty>
                                            <CommandGroup>
                                                {countries.map((country) => (
                                                    <CommandItem
                                                        key={country.isoCode}
                                                        value={country.label ?? ""}
                                                        onSelect={() => {
                                                            field.onChange(country.isoCode);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                country.isoCode === field.value ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {country.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                    <FieldError errors={[translateError(t, errors.country)]}/>
                </FieldContent>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field data-invalid={!!errors.phone}>
                    <FieldLabel>{t("Spexare.Address.phone")}</FieldLabel>
                    <FieldContent>
                        <Input {...register("phone")} disabled={isPending}/>
                        <FieldError errors={[translateError(t, errors.phone)]}/>
                    </FieldContent>
                </Field>

                <Field data-invalid={!!errors.phoneMobile}>
                    <FieldLabel>{t("Spexare.Address.phoneMobile")}</FieldLabel>
                    <FieldContent>
                        <Input {...register("phoneMobile")} disabled={isPending}/>
                        <FieldError errors={[translateError(t, errors.phoneMobile)]}/>
                    </FieldContent>
                </Field>
            </div>

            <Field data-invalid={!!errors.emailAddress}>
                <FieldLabel>{t("Spexare.Address.emailAddress")}</FieldLabel>
                <FieldContent>
                    <Input {...register("emailAddress")} disabled={isPending}/>
                    <FieldError errors={[translateError(t, errors.emailAddress)]}/>
                </FieldContent>
            </Field>

            <div className="flex justify-end gap-2 pt-2 border-t mt-4">
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