"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SpexareFormInput, SpexareFormOutput, spexareFormSchema } from "@/lib/spexare/schema";
import { Country, Spex, Spexare, SpexCategory, Tag, Task, TaskCategory, Type } from "@/gql/schema";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createAction, deleteImageAction, updateAction, uploadImageAction } from "@/app/(app)/spexare/actions.server";
import { Button } from "@bloomper/fgv-web-ui/ui/button";
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from "@bloomper/fgv-web-ui/ui/sheet";
import { cn } from "@/utils/utils";
import { useReportEditQueueFormState } from "@/components/edit-queue/edit-queue-form-state.client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@bloomper/fgv-web-ui/ui/tabs";
import { ScrollArea } from "@bloomper/fgv-web-ui/ui/scroll-area";
import { SpexareGeneralFields } from "@/components/spexare/spexare-general-fields.client";
import { SpexareRelationTabs } from "@/components/spexare/spexare-relation-tabs.client";

interface SpexareFormProps {
  item?: Spexare;
  types: Type[];
  countries: Country[];
  tags?: Tag[];
  tasks?: Task[];
  taskCategories?: TaskCategory[];
  spex?: Spex[];
  spexCategories?: SpexCategory[];
  onSuccess: (updated?: { id: string }) => void;
  onError?: () => void;
  mode?: "sheet" | "page";
  embedded?: boolean;
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
  onError,
  mode = "sheet",
  embedded = false,
}: SpexareFormProps) {
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("general");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [shouldDeleteImage, setShouldDeleteImage] = useState(false);

  const isSheet = mode === "sheet";
  const showSheetChrome = isSheet && !embedded;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<SpexareFormInput, unknown, SpexareFormOutput>({
    resolver: zodResolver(spexareFormSchema),
    defaultValues: {
      firstName: item?.firstName ?? "",
      lastName: item?.lastName ?? "",
      nickName: item?.nickName ?? "",
      deceased: item?.deceased ?? false,
      published: item?.published ?? false,
      birthDate: item?.socialSecurityNumber ? item.socialSecurityNumber.split("-")[0] : "",
      birthNumber: item?.socialSecurityNumber?.includes("-") ? item.socialSecurityNumber.split("-")[1] : "",
      graduation: item?.graduation ?? "",
      comment: item?.comment ?? "",
    },
  });

  useReportEditQueueFormState({ isDirty, canSubmit: activeTab === "general" });

  const onSubmit = handleSubmit((data) => {
    const formattedSsn = data.birthDate
      ? `${data.birthDate.replace(/-/g, "")}${data.birthNumber ? `-${data.birthNumber}` : ""}`
      : undefined;

    const payload = {
      ...data,
      socialSecurityNumber: formattedSsn,
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
        const updated = item ? { ...item, ...data, socialSecurityNumber: formattedSsn } : undefined;
        onSuccess(updated);
      } catch (error) {
        void error;
        toast.error(t("Common.errorOccurred"));
        onError?.();
      }
    });
  });

  const formContent = (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Tabs
        defaultValue="general"
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className={cn("shrink-0", isSheet ? "px-6 pb-4" : "mb-4")}>
          <TabsList
            className={cn(
              "text-muted-foreground grid h-auto! min-h-9 w-full p-1",
              isSheet
                ? "bg-muted/50 grid-cols-2 rounded-lg sm:grid-cols-3"
                : "bg-muted/40 grid-cols-2 rounded-xl border shadow-sm sm:grid-cols-4 lg:grid-cols-8"
            )}
          >
            {[
              { value: "general", label: t("Common.general"), disabled: false },
              { value: "activities", label: t("Spexare.activities"), disabled: !item },
              { value: "partner", label: t("Spexare.partner"), disabled: !item },
              { value: "addresses", label: t("Spexare.addresses"), disabled: !item },
              { value: "consents", label: t("Spexare.consents"), disabled: !item },
              { value: "memberships", label: t("Spexare.memberships"), disabled: !item },
              { value: "taggings", label: t("Spexare.taggings"), disabled: !item },
              { value: "toggles", label: t("Spexare.toggles"), disabled: !item },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                disabled={tab.disabled}
                className={cn(
                  "py-2 text-xs whitespace-nowrap transition-all sm:text-sm",
                  isSheet
                    ? "rounded-md"
                    : "data-active:bg-background data-active:text-foreground rounded-lg px-2 data-active:shadow-sm"
                )}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <ScrollArea className={cn("min-h-0 flex-1", isSheet ? "border-t" : "")}>
          <div className={cn(isSheet ? "px-6 py-4" : "px-0 pt-2 pb-4")}>
            <TabsContent
              value="general"
              className="mt-0 pb-8 outline-none"
            >
              <SpexareGeneralFields
                onSubmit={onSubmit}
                register={register}
                control={control}
                errors={errors}
                item={item}
                isSheet={isSheet}
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

      {!embedded && (
        <div
          className={cn("mt-auto flex shrink-0 justify-end gap-2 pt-4", isSheet ? "bg-muted/30 border-t p-6" : "mt-6")}
        >
          {isSheet ? (
            <SheetClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                />
              }
            >
              {item ? t("Common.close") : t("Common.cancel")}
            </SheetClose>
          ) : (
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onSuccess()}
            >
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
      )}
    </div>
  );

  if (!showSheetChrome) {
    return <div className="flex h-full flex-col">{formContent}</div>;
  }

  return (
    <SheetContent className="flex h-full w-full flex-col gap-0 p-0 sm:max-w-[600px]">
      <SheetHeader className="shrink-0 p-6 pb-2">
        <SheetTitle>{item ? t("Spexare.editHeading") : t("Spexare.createHeading")}</SheetTitle>
      </SheetHeader>
      {formContent}
    </SheetContent>
  );
}
