"use client";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {TagFormInput, TagFormOutput, tagFormSchema} from "@/lib/tag/schema";
import {Tag} from "@/gql/schema";
import {useTranslations} from "next-intl";
import {useTransition} from "react";
import {toast} from "sonner";
import {createAction, updateAction} from "@/app/(app)/tags/actions.server";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Field, FieldContent, FieldError, FieldLabel} from "@/components/ui/field";
import {translateError} from "@/utils/utils";
import {ScrollArea} from "@/components/ui/scroll-area";

interface TagFormProps {
    item?: Tag;
    onSuccess: () => void;
}

export function TagForm({item, onSuccess}: TagFormProps) {
    const t = useTranslations();
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<TagFormInput, unknown, TagFormOutput>({
        resolver: zodResolver(tagFormSchema),
        defaultValues: {
            name: item?.name ?? "",
        },
    });

    const onSubmit = handleSubmit((data) => {
        startTransition(async () => {
            try {
                if (item) {
                    await updateAction(item.id, data);
                    toast.success(t("Common.updateSuccess"));
                } else {
                    await createAction(data);
                    toast.success(t("Common.createSuccess"));
                }
                onSuccess();
            } catch (error) {
                void error;
                toast.error(t("Common.errorOccurred"));
            }
        });
    });

    return (
        <SheetContent className="sm:max-w-[600px] flex flex-col gap-0 p-0 h-full">
            <SheetHeader className="p-6 pb-4 shrink-0">
                <SheetTitle>{item ? t("Tag.editHeading") : t("Tag.createHeading")}</SheetTitle>
            </SheetHeader>

            <form onSubmit={onSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <ScrollArea className="flex-1 border-t min-h-0">
                    <div className="space-y-4 px-6 py-6 pb-12">
                        <Field data-invalid={!!errors.name}>
                            <FieldLabel>{t("Tag.name")}</FieldLabel>
                            <FieldContent>
                                <Input {...register("name")} disabled={isPending}/>
                                <FieldError errors={[translateError(t, errors.name)]}/>
                            </FieldContent>
                        </Field>
                    </div>
                </ScrollArea>

                <SheetFooter className="p-6 pt-4 border-t bg-muted/30 shrink-0 mt-auto">
                    <SheetClose asChild>
                        <Button type="button" variant="outline" disabled={isPending}>
                            {item ? t("Common.close") : t("Common.cancel")}
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
