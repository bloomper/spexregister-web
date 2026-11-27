"use client";

import { useTranslations } from "next-intl";
import { Controller, useFormContext } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@bloomper/fgv-web-ui/ui/select";
import { Input } from "@bloomper/fgv-web-ui/ui/input";
import { Field, FieldContent, FieldError, FieldLabel } from "@bloomper/fgv-web-ui/ui/field";
import { translateError } from "@/utils/utils";
import { SpexCharacter, Type } from "@/gql/schema";
import { ActorFormInput } from "@/lib/spexare/activity/task-activity/actor/schema";

interface ActorFieldsProps {
  vocals: Type[];
  /**
   * The characters of the activity's spex, from Spexipedia; undefined while they load.
   */
  characters?: SpexCharacter[];
}

const NO_CHARACTER = "none";

/**
 * An actor's role and vocal, inside a form that carries the {@link ActorFormInput} fields. The role is picked among
 * the spex's characters in Spexipedia, or typed in when the spex has none.
 */
export function ActorFields({ vocals, characters }: ActorFieldsProps) {
  const t = useTranslations();
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ActorFormInput>();

  const selectable = (current?: string | null) => (characters ?? []).filter((c) => !c.retired || c.id === current);
  const hasCharacters = selectable().length > 0;
  const showRoleInput = characters !== undefined && !hasCharacters;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {hasCharacters && (
        <Field>
          <FieldLabel>{t("Spexare.Activity.TaskActivity.Actor.character")}</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="characterId"
              render={({ field }) => {
                const options = [
                  { value: NO_CHARACTER, label: t("Spexare.Activity.TaskActivity.Actor.noCharacter") },
                  ...selectable(field.value).map((c) => ({ value: c.id, label: c.name })),
                ];

                return (
                  <Select
                    onValueChange={(value) => field.onChange(value === NO_CHARACTER ? null : value)}
                    value={field.value ?? NO_CHARACTER}
                    items={options}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((o) => (
                        <SelectItem
                          key={o.value}
                          value={o.value}
                        >
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              }}
            />
          </FieldContent>
        </Field>
      )}
      {showRoleInput && (
        <Field data-invalid={!!errors.role}>
          <FieldLabel>{t("Spexare.Activity.TaskActivity.Actor.role")}</FieldLabel>
          <FieldContent>
            <Input {...register("role")} />
            <FieldError errors={[translateError(t, errors.role)]} />
          </FieldContent>
        </Field>
      )}

      <Field data-invalid={!!errors.vocalId}>
        <FieldLabel>{t("Spexare.Activity.TaskActivity.Actor.vocal")}</FieldLabel>
        <FieldContent>
          <Controller
            control={control}
            name="vocalId"
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                items={vocals.map((v) => ({ value: v.id, label: v.label }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("Common.select")} />
                </SelectTrigger>
                <SelectContent>
                  {vocals.map((v) => (
                    <SelectItem
                      key={v.id}
                      value={v.id}
                    >
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[translateError(t, errors.vocalId)]} />
        </FieldContent>
      </Field>
    </div>
  );
}
