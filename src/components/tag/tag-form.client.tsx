"use client";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {TagFormInput, TagFormOutput, tagFormSchema} from "@/lib/tag/schema";
import {Tag} from "@/gql/graphql";
import {useTranslations} from "next-intl";
import {useTransition} from "react";
import {toast} from "sonner";
import {createAction, updateAction} from "@/app/(app)/tags/actions.server";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Field, FieldContent, FieldError, FieldLabel} from "@/components/ui/field";
import {translateError} from "@/utils/utils";

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
    } = useForm<TagFormInput, any, TagFormOutput>({
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
                toast.error(t("Common.errorOccurred"));
            }
        });
    });

    return (
        <SheetContent className="sm:max-w-[540px] flex flex-col gap-0 p-0">
            <SheetHeader className="p-6 pb-2">
                <SheetTitle>{item ? t("Tag.editHeading") : t("Tag.createHeading")}</SheetTitle>
            </SheetHeader>
            <form onSubmit={onSubmit} className="flex-1 overflow-y-auto">
                <div className="space-y-4 px-6 py-4">
                    <Field data-invalid={!!errors.name}>
                        <FieldLabel>{t("Tag.name")}</FieldLabel>
                        <FieldContent>
                            <Input {...register("name")} />
                            <FieldError errors={[translateError(t, errors.name)]}/>
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