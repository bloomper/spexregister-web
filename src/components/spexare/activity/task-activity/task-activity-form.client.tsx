"use client";

import {useTranslations} from "next-intl";
import {useState, useTransition} from "react";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {Check, ChevronsUpDown, Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import {TaskActivityFormInput, taskActivityFormSchema} from "@/lib/spexare/activity/task-activity/schema";
import {createTaskActivityAction, updateTaskActivityAction} from "@/app/(app)/spexare/actions.server";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {cn, translateError} from "@/utils/utils";
import {Field, FieldContent, FieldError, FieldLabel} from "@/components/ui/field";
import {useRouter} from "next/navigation";
import {Task, TaskActivity, TaskCategory} from "@/gql/schema";

interface TaskFormProps {
    spexareId: string;
    activityId: string;
    item?: TaskActivity;
    tasks: Task[];
    taskCategories: TaskCategory[];
    existingTaskIds?: string[];
    onSuccess?: () => void;
}

export function TaskActivityForm({
                                     spexareId,
                                     activityId,
                                     item,
                                     tasks,
                                     taskCategories,
                                     existingTaskIds = [],
                                     onSuccess
                                 }: TaskFormProps) {
    const t = useTranslations();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
        item?.task?.category?.id ?? ""
    );

    const {
        handleSubmit,
        control,
        setValue,
        formState: {errors},
    } = useForm<TaskActivityFormInput>({
        resolver: zodResolver(taskActivityFormSchema),
        defaultValues: {
            taskId: item?.task?.id ?? "",
        },
    });

    const filteredTasks = tasks
        .filter(t => !selectedCategoryId || t.category?.id === selectedCategoryId)
        .filter(t => t.id === item?.task?.id || !existingTaskIds.includes(t.id))
        .sort((a, b) => a.name.localeCompare(b.name));

    const onSubmit = handleSubmit((data) => {
        startTransition(async () => {
            try {
                if (item) {
                    await updateTaskActivityAction(spexareId, activityId, data.taskId, item.id);
                } else {
                    await createTaskActivityAction(spexareId, activityId, data.taskId);
                }
                toast.success(t("Common.updateSuccess"));
                onSuccess?.();
                router.refresh();
            } catch (error) {
                void error;
                toast.error(t("Common.errorOccurred"));
            }
        });
    });

    return (
        <form onSubmit={onSubmit} className="space-y-4 pt-2">
            <Field>
                <FieldLabel>{t("Spexare.Activity.TaskActivity.category")}</FieldLabel>
                <FieldContent>
                    <Select
                        value={selectedCategoryId}
                        onValueChange={(val) => {
                            setSelectedCategoryId(val);
                            setValue("taskId", "");
                        }}
                    >
                        <SelectTrigger className="h-9">
                            <SelectValue placeholder={t("Spexare.Activity.TaskActivity.selectCategory")}/>
                        </SelectTrigger>
                        <SelectContent>
                            {taskCategories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FieldContent>
            </Field>

            <Field data-invalid={!!errors.taskId}>
                <FieldLabel>{t("Spexare.Activity.TaskActivity.task")}</FieldLabel>
                <FieldContent>
                    <Controller
                        control={control}
                        name="taskId"
                        render={({field}) => (
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        disabled={!selectedCategoryId}
                                        className="h-9 justify-between font-normal"
                                    >
                                        {field.value
                                            ? tasks.find((t) => t.id === field.value)?.name
                                            : t("Spexare.Activity.TaskActivity.selectTask")}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder={t("Common.search")}/>
                                        <CommandList className="max-h-64 overflow-y-auto"
                                                     onWheel={(e) => e.stopPropagation()}>
                                            <CommandEmpty>{t("Common.noDataFound")}</CommandEmpty>
                                            <CommandGroup>
                                                {filteredTasks.map((task) => (
                                                    <CommandItem
                                                        key={task.id}
                                                        value={task.name}
                                                        onSelect={() => {
                                                            field.onChange(task.id);
                                                            setOpen(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                field.value === task.id ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {task.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                    <FieldError errors={[translateError(t, errors.taskId)]}/>
                </FieldContent>
            </Field>

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
