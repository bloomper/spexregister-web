"use client";

import type {FormEventHandler} from "react";
import type {Locale} from "date-fns";
import {format, parse} from "date-fns";
import type {Control, FieldErrors, UseFormRegister} from "react-hook-form";
import {Controller} from "react-hook-form";
import {useTranslations} from "next-intl";
import {CalendarIcon} from "lucide-react";
import {SpexareFormInput, SpexareFormOutput} from "@/lib/spexare/schema";
import {Spexare} from "@/gql/schema";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Field, FieldContent, FieldError, FieldLabel} from "@/components/ui/field";
import {cn, translateError} from "@/utils/utils";
import {Checkbox} from "@/components/ui/checkbox";
import {ImageUpload} from "@/components/image-upload.client";
import {Textarea} from "@/components/ui/textarea";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";

type SpexareGeneralFieldsProps = {
    onSubmit: FormEventHandler<HTMLFormElement>;
    register: UseFormRegister<SpexareFormInput>;
    control: Control<SpexareFormInput, unknown, SpexareFormOutput>;
    errors: FieldErrors<SpexareFormInput>;
    item?: Spexare;
    isSheet: boolean;
    isMobile: boolean;
    locale: Locale;
    onFileSelect: (file: File | null) => void;
    onFileDelete: () => void;
};

export function SpexareGeneralFields({
                                         onSubmit,
                                         register,
                                         control,
                                         errors,
                                         item,
                                         isSheet,
                                         isMobile,
                                         locale,
                                         onFileSelect,
                                         onFileDelete,
                                     }: SpexareGeneralFieldsProps) {
    const t = useTranslations();

    return (
        <form
            id="spexare-general-form"
            onSubmit={onSubmit}
            className={cn(
                "space-y-4",
                !isSheet && "grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6"
            )}
        >
            <div className="space-y-4">
                <Field data-invalid={!!errors.firstName}>
                    <FieldLabel>{t("Spexare.firstName")}</FieldLabel>
                    <FieldContent>
                        <Input {...register("firstName")} />
                        <FieldError errors={[translateError(t, errors.firstName)]}/>
                    </FieldContent>
                </Field>

                <Field data-invalid={!!errors.lastName}>
                    <FieldLabel>{t("Spexare.lastName")}</FieldLabel>
                    <FieldContent>
                        <Input {...register("lastName")} />
                        <FieldError errors={[translateError(t, errors.lastName)]}/>
                    </FieldContent>
                </Field>

                <Field data-invalid={!!errors.nickName}>
                    <FieldLabel>{t("Spexare.nickName")}</FieldLabel>
                    <FieldContent>
                        <Input {...register("nickName")} />
                        <FieldError errors={[translateError(t, errors.nickName)]}/>
                    </FieldContent>
                </Field>

                <div className="flex flex-wrap gap-6 pt-2">
                    <Field data-invalid={!!errors.deceased}>
                        <FieldContent>
                            <div className="flex items-center space-x-2">
                                <Controller
                                    control={control}
                                    name="deceased"
                                    render={({field}) => (
                                        <Checkbox
                                            id="deceased"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    )}
                                />
                                <label
                                    htmlFor="deceased"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {t("Spexare.deceased")}
                                </label>
                            </div>
                            <FieldError errors={[translateError(t, errors.deceased)]}/>
                        </FieldContent>
                    </Field>

                    <Field data-invalid={!!errors.published}>
                        <FieldContent>
                            <div className="flex items-center space-x-2">
                                <Controller
                                    control={control}
                                    name="published"
                                    render={({field}) => (
                                        <Checkbox
                                            id="published"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    )}
                                />
                                <label
                                    htmlFor="published"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {t("Spexare.published")}
                                </label>
                            </div>
                            <FieldError errors={[translateError(t, errors.published)]}/>
                        </FieldContent>
                    </Field>
                </div>
            </div>

            <div className="space-y-4">
                <Field>
                    <FieldLabel>{t("Spexare.imageUrl")}</FieldLabel>
                    <FieldContent>
                        <div className={cn(!isSheet && "md:max-w-sm")}>
                            <ImageUpload
                                initialImageUrl={item?.imageUrl}
                                onFileSelect={(file) => {
                                    onFileSelect(file);
                                }}
                                onFileDelete={onFileDelete}
                            />
                        </div>
                    </FieldContent>
                </Field>
            </div>

            <div
                className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4", !isSheet && "md:col-span-2 md:grid-cols-4")}>
                <Field data-invalid={!!errors.birthDate}>
                    <FieldLabel>{t("Spexare.birthDate")}</FieldLabel>
                    <FieldContent>
                        <Controller
                            control={control}
                            name="birthDate"
                            render={({field}) => isMobile ? (
                                <Input
                                    type="date"
                                    className="w-full"
                                    value={field.value ? `${field.value.slice(0, 4)}-${field.value.slice(4, 6)}-${field.value.slice(6, 8)}` : ""}
                                    onChange={(e) => field.onChange(e.target.value.replace(/-/g, ""))}
                                />
                            ) : (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4"/>
                                            {field.value ? (
                                                format(parse(field.value, "yyyyMMdd", new Date()), "yyyy-MM-dd")
                                            ) : (
                                                <span>{t("Common.selectDate")}</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            locale={locale}
                                            captionLayout="dropdown"
                                            startMonth={new Date(1900, 0)}
                                            endMonth={new Date()}
                                            defaultMonth={field.value ? parse(field.value, "yyyyMMdd", new Date()) : undefined}
                                            formatters={{
                                                formatMonthDropdown: (date) =>
                                                    format(date, "MMM", {locale}),
                                            }}
                                            selected={field.value ? parse(field.value, "yyyyMMdd", new Date()) : undefined}
                                            onSelect={(date) => field.onChange(date ? format(date, "yyyyMMdd") : "")}
                                            disabled={(date) => date > new Date()}
                                        />
                                    </PopoverContent>
                                </Popover>
                            )}
                        />
                        <FieldError errors={[translateError(t, errors.birthDate)]}/>
                    </FieldContent>
                </Field>

                <Field data-invalid={!!errors.birthNumber}>
                    <FieldLabel>{t("Spexare.birthNumber")}</FieldLabel>
                    <FieldContent>
                        <Input {...register("birthNumber")}
                               placeholder={t("Spexare.birthNumberPlaceholder")}
                               maxLength={4}/>
                        <FieldError errors={[translateError(t, errors.birthNumber)]}/>
                    </FieldContent>
                </Field>

                <Field data-invalid={!!errors.graduation}
                       className={cn(!isSheet && "md:col-span-2")}>
                    <FieldLabel>{t("Spexare.graduation")}</FieldLabel>
                    <FieldContent>
                        <Input {...register("graduation")} />
                        <FieldError errors={[translateError(t, errors.graduation)]}/>
                    </FieldContent>
                </Field>
            </div>

            <Field data-invalid={!!errors.comment} className={cn(!isSheet && "md:col-span-2")}>
                <FieldLabel>{t("Spexare.comment")}</FieldLabel>
                <FieldContent>
                    <Textarea {...register("comment")} rows={6}/>
                    <FieldError errors={[translateError(t, errors.comment)]}/>
                </FieldContent>
            </Field>
        </form>
    );
}
