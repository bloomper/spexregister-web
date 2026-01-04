"use client";

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {SpexareFormInput, SpexareFormOutput, spexareFormSchema} from "@/lib/spexare/schema";
import {Spexare} from "@/gql/graphql";
import {useLocale, useTranslations} from "next-intl";
import {useState, useTransition} from "react";
import {toast} from "sonner";
import {createAction, deleteImageAction, updateAction, uploadImageAction} from "@/app/(app)/spexare/actions.server";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Field, FieldContent, FieldError, FieldLabel} from "@/components/ui/field";
import {cn, translateError} from "@/utils/utils";
import {Checkbox} from "@/components/ui/checkbox";
import {ImageUpload} from "@/components/image-upload.client";
import {Textarea} from "@/components/ui/textarea";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {format, parse} from "date-fns";
import {enUS, sv} from "react-day-picker/locale";
import {useIsMobile} from "@/hooks/use-mobile";

interface SpexareFormProps {
    item?: Spexare;
    onSuccess: () => void;
}

export function SpexareForm({item, onSuccess}: SpexareFormProps) {
    const t = useTranslations();
    const currentLocale = useLocale();
    const locale = currentLocale === "sv" ? sv : enUS;
    const isMobile = useIsMobile();
    const [isPending, startTransition] = useTransition();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [shouldDeleteImage, setShouldDeleteImage] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        formState: {errors},
    } = useForm<SpexareFormInput, any, SpexareFormOutput>({
        resolver: zodResolver(spexareFormSchema),
        defaultValues: {
            firstName: item?.firstName ?? "",
            lastName: item?.lastName ?? "",
            nickName: item?.nickName ?? "",
            deceased: item?.deceased ?? false,
            published: item?.published ?? false,
            birthDate: item?.socialSecurityNumber
                ? item.socialSecurityNumber.split("-")[0]
                : "",
            birthNumber: item?.socialSecurityNumber?.includes("-")
                ? item.socialSecurityNumber.split("-")[1]
                : "",
            graduation: item?.graduation ?? "",
            comment: item?.comment ?? "",
        },
    });

    const onSubmit = handleSubmit((data) => {
        const formattedSsn = data.birthDate
            ? `${data.birthDate.replace(/-/g, "")}${data.birthNumber ? `-${data.birthNumber}` : ""}`
            : undefined;

        const payload = {
            ...data,
            socialSecurityNumber: formattedSsn
        };

        startTransition(async () => {
            try {
                let id = item?.id;
                if (item) {
                    await updateAction(item.id, payload);
                } else {
                    const newItem = await createAction(payload);
                    id = newItem?.id;
                }

                if (id && !item) {
                    await updateAction(id, payload);
                }

                if (id) {
                    if (selectedFile) {
                        const formData = new FormData();
                        formData.append("file", selectedFile);
                        await uploadImageAction(id, formData);
                    } else if (shouldDeleteImage) {
                        await deleteImageAction(id);
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
                <SheetTitle>{item ? t("Spexare.editHeading") : t("Spexare.createHeading")}</SheetTitle>
            </SheetHeader>
            <form onSubmit={onSubmit} className="flex-1 overflow-y-auto">
                <div className="space-y-4 px-6 py-4">
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

                    <Field>
                        <FieldLabel>{t("Spexare.imageUrl")}</FieldLabel>
                        <FieldContent>
                            <ImageUpload
                                initialImageUrl={item?.imageUrl}
                                onFileSelect={(file) => {
                                    setSelectedFile(file);
                                    setShouldDeleteImage(false);
                                }}
                                onFileDelete={() => {
                                    setSelectedFile(null);
                                    setShouldDeleteImage(true);
                                }}
                            />
                        </FieldContent>
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                <Input {...register("birthNumber")} placeholder={t("Spexare.birthNumberPlaceholder")}
                                       maxLength={4}/>
                                <FieldError errors={[translateError(t, errors.birthNumber)]}/>
                            </FieldContent>
                        </Field>
                    </div>

                    <Field data-invalid={!!errors.graduation}>
                        <FieldLabel>{t("Spexare.graduation")}</FieldLabel>
                        <FieldContent>
                            <Input {...register("graduation")} />
                            <FieldError errors={[translateError(t, errors.graduation)]}/>
                        </FieldContent>
                    </Field>

                    <Field data-invalid={!!errors.comment}>
                        <FieldLabel>{t("Spexare.comment")}</FieldLabel>
                        <FieldContent>
                            <Textarea {...register("comment")} rows={6}/>
                            <FieldError errors={[translateError(t, errors.comment)]}/>
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