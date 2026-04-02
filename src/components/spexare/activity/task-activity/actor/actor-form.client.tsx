"use client";

import {useTranslations} from "next-intl";
import {useTransition} from "react";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {ActorFormInput, actorFormSchema} from "@/lib/spexare/activity/task-activity/actor/schema";
import {createActorAction, updateActorAction} from "@/app/(app)/spexare/actions.server";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Field, FieldContent, FieldError, FieldLabel} from "@/components/ui/field";
import {translateError} from "@/utils/utils";
import {Actor, Type} from "@/gql/graphql";
import {useRouter} from "next/navigation";
import {Plus} from "lucide-react";

interface ActorFormProps {
    spexareId: string;
    activityId: string;
    taskActivityId: string;
    item?: Actor;
    vocals: Type[];
    onSuccess?: () => void;
}

export function ActorForm({spexareId, activityId, taskActivityId, item, vocals, onSuccess}: ActorFormProps) {
    const t = useTranslations();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        control,
        formState: {errors},
    } = useForm<ActorFormInput>({
        resolver: zodResolver(actorFormSchema),
        defaultValues: {
            role: item?.role ?? "",
            vocalId: item?.vocal?.id ?? "",
        },
    });

    const onSubmit = handleSubmit((data) => {
        startTransition(async () => {
            try {
                if (item) {
                    await updateActorAction(spexareId, activityId, taskActivityId, data.vocalId, item.id, data);
                } else {
                    await createActorAction(spexareId, activityId, taskActivityId, data.vocalId, data);
                }
                toast.success(t("Common.updateSuccess"));
                onSuccess?.();
                router.refresh();
            } catch (error) {
                toast.error(t("Common.errorOccurred"));
            }
        });
    });

    return (
        <form onSubmit={onSubmit} className="space-y-4 p-4 border rounded-md bg-muted/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field data-invalid={!!errors.role}>
                    <FieldLabel>{t("Spexare.Activity.TaskActivity.Actor.role")}</FieldLabel>
                    <FieldContent>
                        <Input {...register("role")}/>
                        <FieldError errors={[translateError(t, errors.role)]}/>
                    </FieldContent>
                </Field>

                <Field data-invalid={!!errors.vocalId}>
                    <FieldLabel>{t("Spexare.Activity.TaskActivity.Actor.vocal")}</FieldLabel>
                    <FieldContent>
                        <Controller
                            control={control}
                            name="vocalId"
                            render={({field}) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t("Common.select")}/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {vocals.map((v) => (
                                            <SelectItem key={v.id} value={v.id}>
                                                {v.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <FieldError errors={[translateError(t, errors.vocalId)]}/>
                    </FieldContent>
                </Field>
            </div>
            <div className="flex gap-2">
                {item && (
                    <Button type="button" variant="ghost" size="sm" className="flex-1" onClick={onSuccess}>
                        {t("Common.cancel")}
                    </Button>
                )}
                <Button type="submit" disabled={isPending} size="sm" className="flex-1">
                    {isPending ? (
                        t("Common.saving")
                    ) : item ? (
                        t("Common.save")
                    ) : (
                        <>
                            <Plus className="mr-2 h-4 w-4"/>
                            {t("Common.add")}
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
