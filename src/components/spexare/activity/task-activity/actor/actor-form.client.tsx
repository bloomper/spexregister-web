"use client";

import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ActorFormInput, actorFormSchema } from "@/lib/spexare/activity/task-activity/actor/schema";
import { createActorAction, updateActorAction } from "@/app/(app)/spexare/actions.server";
import { Button } from "@bloomper/fgv-web-ui/ui/button";
import { Actor, SpexCharacter, Type } from "@/gql/schema";
import { useRefresh } from "@/hooks/use-refresh.client";
import { Plus } from "lucide-react";
import { ActorFields } from "@/components/spexare/activity/task-activity/actor/actor-fields.client";

interface ActorFormProps {
  spexareId: string;
  activityId: string;
  taskActivityId: string;
  item?: Actor;
  vocals: Type[];
  /**
   * The characters of the activity's spex, from Spexipedia; undefined while they load.
   */
  characters?: SpexCharacter[];
  onSuccess?: () => void;
}

export function ActorForm({
  spexareId,
  activityId,
  taskActivityId,
  item,
  vocals,
  characters,
  onSuccess,
}: ActorFormProps) {
  const t = useTranslations();
  const refresh = useRefresh();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ActorFormInput>({
    resolver: zodResolver(actorFormSchema),
    defaultValues: {
      role: item?.role ?? "",
      vocalId: item?.vocal?.id ?? "",
      characterId: item?.character?.id ?? null,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      try {
        if (item) {
          await updateActorAction(spexareId, activityId, taskActivityId, data.vocalId, item.id, data);
        } else {
          await createActorAction(spexareId, activityId, taskActivityId, data.vocalId, data);
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
        className="bg-muted/20 space-y-4 rounded-md border p-4"
      >
        <ActorFields
          vocals={vocals}
          characters={characters}
        />
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
