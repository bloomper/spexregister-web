"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { Button } from "@bloomper/fgv-web-ui/ui/button";
import { TaskActivityFormInput, taskActivityFormSchema } from "@/lib/spexare/activity/task-activity/schema";
import { createTaskActivityAction, updateTaskActivityAction } from "@/app/(app)/spexare/actions.server";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@bloomper/fgv-web-ui/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@bloomper/fgv-web-ui/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@bloomper/fgv-web-ui/ui/command";
import { cn, translateError } from "@/utils/utils";
import { Field, FieldContent, FieldError, FieldLabel } from "@bloomper/fgv-web-ui/ui/field";
import { useRefresh } from "@/hooks/use-refresh.client";
import { SpexCharacter, Task, TaskActivity, TaskCategory, Type } from "@/gql/schema";
import { ActorFields } from "@/components/spexare/activity/task-activity/actor/actor-fields.client";

interface TaskFormProps {
  spexareId: string;
  activityId: string;
  item?: TaskActivity;
  tasks: Task[];
  taskCategories: TaskCategory[];
  existingTaskIds?: string[];
  /**
   * For adding the actor together with a new task whose category has actors.
   */
  vocals?: Type[];
  /**
   * The characters of the activity's spex, from Spexipedia; undefined while they load.
   */
  characters?: SpexCharacter[];
  onSuccess?: () => void;
}

export function TaskActivityForm({
  spexareId,
  activityId,
  item,
  tasks,
  taskCategories,
  existingTaskIds = [],
  vocals = [],
  characters,
  onSuccess,
}: TaskFormProps) {
  const t = useTranslations();
  const refresh = useRefresh();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(item?.task?.category?.id ?? "");

  const form = useForm<TaskActivityFormInput>({
    resolver: zodResolver(taskActivityFormSchema),
    // The actor fields leave the values when they hide, so a role typed for an earlier task isn't kept.
    shouldUnregister: true,
    defaultValues: {
      taskId: item?.task?.id ?? "",
      vocalId: "",
      role: "",
      characterId: null,
    },
  });
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = form;
  const taskId = useWatch({ control, name: "taskId" });
  // An existing task activity's actors are managed beside it, so only a new one takes its actor here.
  const withActor = !item && !!tasks.find((task) => task.id === taskId)?.category?.actorPresent;

  const filteredTasks = tasks
    .filter((t) => !selectedCategoryId || t.category?.id === selectedCategoryId)
    .filter((t) => t.id === item?.task?.id || !existingTaskIds.includes(t.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      try {
        if (item) {
          await updateTaskActivityAction(spexareId, activityId, data.taskId, item.id);
        } else {
          const { vocalId, role, characterId } = data;
          await createTaskActivityAction(
            spexareId,
            activityId,
            data.taskId,
            withActor && vocalId ? { vocalId, role, characterId } : undefined
          );
        }
        toast.success(t("Common.updateSuccess"));
        onSuccess?.();
        refresh();
      } catch (error) {
        void error;
        toast.error(t("Common.errorOccurred"));
      }
    });
  });

  return (
    <FormProvider {...form}>
      <form
        onSubmit={onSubmit}
        className="space-y-4 pt-2"
      >
        <Field>
          <FieldLabel>{t("Spexare.Activity.TaskActivity.category")}</FieldLabel>
          <FieldContent>
            <Select
              value={selectedCategoryId}
              onValueChange={(val) => {
                setSelectedCategoryId(val ?? "");
                setValue("taskId", "");
              }}
              items={taskCategories.map((cat) => ({ value: cat.id, label: cat.name }))}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder={t("Spexare.Activity.TaskActivity.selectCategory")} />
              </SelectTrigger>
              <SelectContent>
                {taskCategories.map((cat) => (
                  <SelectItem
                    key={cat.id}
                    value={cat.id}
                  >
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
              render={({ field }) => (
                <Popover
                  open={open}
                  onOpenChange={setOpen}
                >
                  <PopoverTrigger
                    render={
                      <Button
                        variant="outline"
                        role="combobox"
                        disabled={!selectedCategoryId}
                        className="h-9 justify-between font-normal"
                      />
                    }
                  >
                    {field.value
                      ? tasks.find((t) => t.id === field.value)?.name
                      : t("Spexare.Activity.TaskActivity.selectTask")}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-(--anchor-width) p-0"
                    align="start"
                  >
                    <Command>
                      <CommandInput placeholder={t("Common.search")} />
                      <CommandList
                        className="max-h-64 overflow-y-auto"
                        onWheel={(e) => e.stopPropagation()}
                      >
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
                                className={cn("mr-2 h-4 w-4", field.value === task.id ? "opacity-100" : "opacity-0")}
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
            <FieldError errors={[translateError(t, errors.taskId)]} />
          </FieldContent>
        </Field>

        {withActor && (
          <ActorFields
            vocals={vocals}
            characters={characters}
          />
        )}

        <div className="flex gap-2">
          {item && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex-1"
              onClick={onSuccess}
            >
              {t("Common.cancel")}
            </Button>
          )}
          <Button
            type="submit"
            disabled={isPending}
            size="sm"
            className="flex-1"
          >
            {isPending ? (
              t("Common.saving")
            ) : item ? (
              t("Common.save")
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                {t("Common.add")}
              </>
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
