"use client";

import {useForm, FieldError as FormError} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {NewsFormInput, NewsFormOutput, newsFormSchema} from "@/lib/news/schema";
import {News} from "@/gql/graphql";
import {useTranslations} from "next-intl";
import {useTransition} from "react";
import {toast} from "sonner";
import {createNewsAction, updateNewsAction} from "@/app/(app)/news/actions.server";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Field, FieldContent, FieldError, FieldLabel} from "@/components/ui/field";

interface NewsFormProps {
    news?: News;
    onSuccess: () => void;
}

export function NewsForm({news, onSuccess}: NewsFormProps) {
    const t = useTranslations();
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<NewsFormInput, any, NewsFormOutput>({
        resolver: zodResolver(newsFormSchema),
        defaultValues: {
            subject: news?.subject ?? "",
            text: news?.text ?? "",
            visibleFrom: news?.visibleFrom ?? new Date().toISOString().split("T")[0],
            visibleTo: news?.visibleTo ?? "",
        },
    });

    const translateError = (error?: FormError) => {
        if (!error?.message) {
            return error;
        }
        return {
            ...error,
            message: t(error.message as any)
        };
    };

    const onSubmit = handleSubmit((data) => {
        startTransition(async () => {
            try {
                if (news) {
                    await updateNewsAction(news.id, data);
                    toast.success(t("Common.updateSuccess"));
                } else {
                    await createNewsAction(data);
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
                <SheetTitle>{news ? t("News.editTitle") : t("News.createTitle")}</SheetTitle>
            </SheetHeader>
            <form onSubmit={onSubmit} className="flex-1 overflow-y-auto">
                <div className="space-y-4 px-6 py-4">
                    <Field data-invalid={!!errors.subject}>
                        <FieldLabel>{t("News.subject")}</FieldLabel>
                        <FieldContent>
                            <Input {...register("subject")} />
                            <FieldError errors={[translateError(errors.subject)]}/>
                        </FieldContent>
                    </Field>

                    <Field data-invalid={!!errors.text}>
                        <FieldLabel>{t("News.text")}</FieldLabel>
                        <FieldContent>
                            <Textarea {...register("text")} rows={10}/>
                            <FieldError errors={[translateError(errors.text)]}/>
                        </FieldContent>
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                        <Field data-invalid={!!errors.visibleFrom}>
                            <FieldLabel>{t("News.visibleFrom")}</FieldLabel>
                            <FieldContent>
                                <Input type="date" {...register("visibleFrom")} />
                                <FieldError errors={[translateError(errors.visibleFrom)]}/>
                            </FieldContent>
                        </Field>

                        <Field data-invalid={!!errors.visibleTo}>
                            <FieldLabel>{t("News.visibleTo")}</FieldLabel>
                            <FieldContent>
                                <Input type="date" {...register("visibleTo")} />
                                <FieldError errors={[translateError(errors.visibleTo)]}/>
                            </FieldContent>
                        </Field>
                    </div>
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