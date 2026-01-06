"use client";

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {SpexareFormInput, SpexareFormOutput, spexareFormSchema} from "@/lib/spexare/schema";
import {
    Address,
    Consent,
    Membership,
    Spex,
    Spexare,
    SpexCategory,
    Tag,
    Task,
    TaskCategory,
    Toggle,
    Type
} from "@/gql/graphql";
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
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ScrollArea} from "@/components/ui/scroll-area";
import {AddressManager} from "@/components/spexare/address/address-manager.client";
import {ConsentManager} from "@/components/spexare/consent/consent-manager.client";
import {MembershipManager} from "@/components/spexare/membership/membership-manager.client";
import {TaggingManager} from "@/components/spexare/tagging/tagging-manager.client";
import {ToggleManager} from "@/components/spexare/toggle/toggle-manager.client";
import {ActivityManager} from "@/components/spexare/activity/activity-manager.client";

interface SpexareFormProps {
    item?: Spexare;
    types: Type[];
    tags?: Tag[];
    tasks?: Task[],
    taskCategories?: TaskCategory[],
    spex?: Spex[],
    spexCategories?: SpexCategory[],
    onSuccess: () => void;
}

export function SpexareForm({
                                item,
                                types,
                                tags = [],
                                tasks = [],
                                taskCategories = [],
                                spex = [],
                                spexCategories = [],
                                onSuccess
                            }: SpexareFormProps) {
    const t = useTranslations();
    const currentLocale = useLocale();
    const locale = currentLocale === "sv" ? sv : enUS;
    const isMobile = useIsMobile();
    const [isPending, startTransition] = useTransition();
    const [activeTab, setActiveTab] = useState("general");
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
        <SheetContent className="sm:max-w-[600px] flex flex-col gap-0 p-0 h-full">
            <SheetHeader className="p-6 pb-2 shrink-0">
                <SheetTitle>{item ? t("Spexare.editHeading") : t("Spexare.createHeading")}</SheetTitle>
            </SheetHeader>

            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <Tabs
                    defaultValue="general"
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="flex-1 flex flex-col min-h-0"
                >
                    <div className="px-6 pb-4 shrink-0">
                        <TabsList className="grid w-full h-auto p-1 bg-muted/50 grid-cols-2 sm:grid-cols-3">
                            <TabsTrigger value="general" className="py-2 text-xs sm:text-sm">
                                {t("Common.general")}
                            </TabsTrigger>

                            <TabsTrigger
                                value="activities"
                                disabled={!item}
                                className="py-2 text-xs sm:text-sm data-disabled:opacity-50"
                            >
                                {t("Spexare.activities")}
                            </TabsTrigger>
                            <TabsTrigger
                                value="addresses"
                                disabled={!item}
                                className="py-2 text-xs sm:text-sm data-disabled:opacity-50"
                            >
                                {t("Spexare.addresses")}
                            </TabsTrigger>

                            <TabsTrigger
                                value="consents"
                                disabled={!item}
                                className="py-2 text-xs sm:text-sm data-disabled:opacity-50"
                            >
                                {t("Spexare.consents")}
                            </TabsTrigger>

                            <TabsTrigger
                                value="memberships"
                                disabled={!item}
                                className="py-2 text-xs sm:text-sm data-disabled:opacity-50"
                            >
                                {t("Spexare.memberships")}
                            </TabsTrigger>

                            <TabsTrigger
                                value="taggings"
                                disabled={!item}
                                className="py-2 text-xs sm:text-sm data-disabled:opacity-50"
                            >
                                {t("Spexare.taggings")}
                            </TabsTrigger>

                            <TabsTrigger
                                value="toggles"
                                disabled={!item}
                                className="py-2 text-xs sm:text-sm data-disabled:opacity-50"
                            >
                                {t("Spexare.toggles")}
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <ScrollArea className="flex-1 border-t min-h-0">
                        <div className="px-6 py-4">
                            <TabsContent value="general" className="mt-0 outline-none pb-8">
                                <form id="spexare-general-form" onSubmit={onSubmit} className="space-y-4">
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
                                                <Input {...register("birthNumber")}
                                                       placeholder={t("Spexare.birthNumberPlaceholder")}
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
                                </form>
                            </TabsContent>

                            {item && (
                                <>
                                    <TabsContent value="activities" className="mt-0 outline-none pb-8">
                                        <div className="py-4">
                                            <ActivityManager
                                                spexareId={item.id}
                                                types={types}
                                                tasks={tasks}
                                                taskCategories={taskCategories}
                                                spex={spex}
                                                spexCategories={spexCategories}
                                                initialActivities={item.activities || []}
                                            />
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="addresses" className="mt-0 outline-none pb-8">
                                        <div className="py-4">
                                            <AddressManager
                                                key={`address-manager-${item.id}-${JSON.stringify(item.addresses?.map(a => ({
                                                    id: a?.id,
                                                    s: a?.streetAddress,
                                                    c: a?.city,
                                                    e: a?.emailAddress
                                                })))}`}
                                                spexareId={item.id}
                                                initialAddresses={(item.addresses || []).filter((a): a is Address => !!a)}
                                                types={types}
                                            />
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="consents" className="mt-0 outline-none pb-8">
                                        <div className="py-4">
                                            <ConsentManager
                                                key={`consent-manager-${item.id}-${JSON.stringify(item.consents?.map(c => ({
                                                    id: c?.id,
                                                    v: c?.value
                                                })))}`}
                                                spexareId={item.id}
                                                initialConsents={(item.consents || []).filter((c): c is Consent => !!c)}
                                                types={types}
                                            />
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="memberships" className="mt-0 outline-none pb-8">
                                        <div className="py-4">
                                            <MembershipManager
                                                key={`membership-manager-${item.id}-${JSON.stringify(item.memberships?.map(m => ({
                                                    id: m?.id,
                                                    y: m?.year
                                                })))}`}
                                                spexareId={item.id}
                                                initialMemberships={(item.memberships || []).filter((m): m is Membership => !!m)}
                                                types={types}
                                            />
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="taggings" className="mt-0 outline-none pb-8">
                                        <div className="py-4">
                                            <TaggingManager
                                                key={`tagging-manager-${item.id}-${item.taggings?.length}`}
                                                spexareId={item.id}
                                                initialTaggings={(item.taggings || []).filter((t): t is Tag => !!t)}
                                                allTags={tags}
                                            />
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="toggles" className="mt-0 outline-none pb-8">
                                        <div className="py-4">
                                            <ToggleManager
                                                key={`toggle-manager-${item.id}-${JSON.stringify(item.toggles?.map(tg => ({
                                                    id: tg?.id,
                                                    v: tg?.value
                                                })))}`}
                                                spexareId={item.id}
                                                initialToggles={(item.toggles || []).filter((tg): tg is Toggle => !!tg)}
                                                types={types}
                                            />
                                        </div>
                                    </TabsContent>
                                </>
                            )}
                        </div>
                    </ScrollArea>
                </Tabs>

                <SheetFooter className="p-6 pt-4 border-t bg-muted/30 shrink-0 mt-auto">
                    <SheetClose asChild>
                        <Button type="button" variant="outline" disabled={isPending}>
                            {item ? t("Common.close") : t("Common.cancel")}
                        </Button>
                    </SheetClose>
                    <Button
                        type="submit"
                        form="spexare-general-form"
                        disabled={isPending || activeTab !== "general"}
                    >
                        {isPending ? t("Common.saving") : t("Common.save")}
                    </Button>
                </SheetFooter>
            </div>
        </SheetContent>
    );
}