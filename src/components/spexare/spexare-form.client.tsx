"use client";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {SpexareFormInput, SpexareFormOutput, spexareFormSchema} from "@/lib/spexare/schema";
import {Country, Spex, Spexare, SpexCategory, Tag, Task, TaskCategory, Type} from "@/gql/schema";
import {useLocale, useTranslations} from "next-intl";
import {useState, useTransition} from "react";
import {toast} from "sonner";
import {createAction, deleteImageAction, updateAction, uploadImageAction} from "@/app/(app)/spexare/actions.server";
import {Button} from "@/components/ui/button";
import {SheetClose, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {cn} from "@/utils/utils";
import {enUS, sv} from "react-day-picker/locale";
import {useIsMobile} from "@/hooks/use-mobile";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ScrollArea} from "@/components/ui/scroll-area";
import {SpexareGeneralFields} from "@/components/spexare/spexare-general-fields.client";
import {SpexareRelationTabs} from "@/components/spexare/spexare-relation-tabs.client";

interface SpexareFormProps {
    item?: Spexare;
    types: Type[];
    countries: Country[];
    tags?: Tag[];
    tasks?: Task[],
    taskCategories?: TaskCategory[],
    spex?: Spex[],
    spexCategories?: SpexCategory[],
    onSuccess: () => void;
    mode?: "sheet" | "page";
}

export function SpexareForm({
                                item,
                                types,
                                countries,
                                tags = [],
                                tasks = [],
                                taskCategories = [],
                                spex = [],
                                spexCategories = [],
                                onSuccess,
                                mode = "sheet"
                            }: SpexareFormProps) {
    const t = useTranslations();
    const currentLocale = useLocale();
    const locale = currentLocale === "sv" ? sv : enUS;
    const isMobile = useIsMobile();
    const [isPending, startTransition] = useTransition();
    const [activeTab, setActiveTab] = useState("general");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [shouldDeleteImage, setShouldDeleteImage] = useState(false);

    const isSheet = mode === "sheet";

    const {
        register,
        handleSubmit,
        control,
        formState: {errors},
    } = useForm<SpexareFormInput, unknown, SpexareFormOutput>({
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
                void error;
                toast.error(t("Common.errorOccurred"));
            }
        });
    });

    const formContent = (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <Tabs
                defaultValue="general"
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex-1 flex flex-col min-h-0"
            >
                <div className={cn("shrink-0", isSheet ? "px-6 pb-4" : "mb-4")}>
                    <TabsList className={cn(
                        "grid w-full h-auto! min-h-9 p-1 text-muted-foreground",
                        isSheet
                            ? "grid-cols-2 sm:grid-cols-3 bg-muted/50 rounded-lg"
                            : "grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 bg-muted/40 rounded-xl border shadow-sm"
                    )}>
                        {[
                            {value: "general", label: t("Common.general"), disabled: false},
                            {value: "activities", label: t("Spexare.activities"), disabled: !item},
                            {value: "partner", label: t("Spexare.partner"), disabled: !item},
                            {value: "addresses", label: t("Spexare.addresses"), disabled: !item},
                            {value: "consents", label: t("Spexare.consents"), disabled: !item},
                            {value: "memberships", label: t("Spexare.memberships"), disabled: !item},
                            {value: "taggings", label: t("Spexare.taggings"), disabled: !item},
                            {value: "toggles", label: t("Spexare.toggles"), disabled: !item},
                        ].map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                disabled={tab.disabled}
                                className={cn(
                                    "py-2 text-xs sm:text-sm transition-all whitespace-nowrap",
                                    isSheet
                                        ? "rounded-md"
                                        : "px-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                                )}
                            >
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <ScrollArea className={cn("flex-1 min-h-0", isSheet ? "border-t" : "")}>
                    <div className={cn(isSheet ? "py-4 px-6" : "px-0 pt-2 pb-4")}>
                        <TabsContent value="general" className="mt-0 outline-none pb-8">
                            <SpexareGeneralFields
                                onSubmit={onSubmit}
                                register={register}
                                control={control}
                                errors={errors}
                                item={item}
                                isSheet={isSheet}
                                isMobile={isMobile}
                                locale={locale}
                                onFileSelect={(file) => {
                                    setSelectedFile(file);
                                    setShouldDeleteImage(false);
                                }}
                                onFileDelete={() => {
                                    setSelectedFile(null);
                                    setShouldDeleteImage(true);
                                }}
                            />
                        </TabsContent>

                        {item && (
                            <SpexareRelationTabs
                                item={item}
                                types={types}
                                countries={countries}
                                tags={tags}
                                tasks={tasks}
                                taskCategories={taskCategories}
                                spex={spex}
                                spexCategories={spexCategories}
                            />
                        )}
                    </div>
                </ScrollArea>
            </Tabs>

            <div className={cn(
                "pt-4 shrink-0 mt-auto flex justify-end gap-2",
                isSheet ? "p-6 border-t bg-muted/30" : "mt-6"
            )}>
                {isSheet ? (
                    <SheetClose asChild>
                        <Button type="button" variant="outline" disabled={isPending}>
                            {item ? t("Common.close") : t("Common.cancel")}
                        </Button>
                    </SheetClose>
                ) : (
                    <Button type="button" variant="outline" disabled={isPending} onClick={() => onSuccess()}>
                        {t("Common.close")}
                    </Button>
                )}
                <Button
                    type="submit"
                    form="spexare-general-form"
                    disabled={isPending || activeTab !== "general"}
                >
                    {isPending ? t("Common.saving") : t("Common.save")}
                </Button>
            </div>
        </div>
    );

    if (!isSheet) {
        return (
            <div className="flex flex-col h-full">
                {formContent}
            </div>
        );
    }

    return (
        <SheetContent className="sm:max-w-[600px] flex flex-col gap-0 p-0 h-full">
            <SheetHeader className="p-6 pb-2 shrink-0">
                <SheetTitle>{item ? t("Spexare.editHeading") : t("Spexare.createHeading")}</SheetTitle>
            </SheetHeader>
            {formContent}
        </SheetContent>
    );
}
