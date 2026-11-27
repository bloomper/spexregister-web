"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { format, isValid, parseISO } from "date-fns";
import { enUS, sv } from "react-day-picker/locale";
import { CalendarIcon, X } from "lucide-react";
import { Button } from "@bloomper/fgv-web-ui/ui/button";
import { Calendar } from "@bloomper/fgv-web-ui/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@bloomper/fgv-web-ui/ui/popover";
import { cn } from "@/utils/utils";

/** The date-fns locale for the app's language; the browser's language is never used. */
export const dateLocale = (locale: string) => (locale.startsWith("sv") ? sv : enUS);

/**
 * Month names in a calendar's month dropdown from the calendar's `locale`. The shadcn Calendar's default uses
 * `toLocaleString("default")`, which is the browser's language; pass these to every Calendar with dropdowns.
 */
export const calendarFormatters: React.ComponentProps<typeof Calendar>["formatters"] = {
  formatMonthDropdown: (month, dateLib) => (dateLib ? dateLib.format(month, "LLL") : format(month, "LLL")),
};

const parse = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  const date = parseISO(value);

  return isValid(date) ? date : undefined;
};

const iso = (date: Date) => format(date, "yyyy-MM-dd");

/**
 * A date field in the app's language, replacing `<input type="date">`, whose format, calendar and month names follow
 * the browser's language. The value is an ISO date (`yyyy-MM-dd`), or "" when empty, as with a native date input.
 *
 * With `name`, the value is submitted with the surrounding form. With `required`, an empty value blocks submission
 * through a visually hidden input, so the usual (translated) validation message is shown.
 */
export function DatePicker({
  id,
  name,
  value: controlled,
  defaultValue,
  onChange,
  required,
  disabled,
  min,
  max,
  placeholder,
  displayFormat = "PPP",
  className,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: {
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
  placeholder?: string;
  /** The date-fns pattern of the shown date; the default is the long date in the app's language. */
  displayFormat?: string;
  className?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}) {
  const locale = useLocale();
  const t = useTranslations("Common");
  const [open, setOpen] = useState(false);
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? "");
  const trigger = useRef<HTMLButtonElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const value = controlled ?? uncontrolled;
  const selected = parse(value);
  const dateLib = dateLocale(locale);
  const earliest = parse(min);
  const latest = parse(max);

  // A form reset goes back to the default value, as it does for a native input.
  useEffect(() => {
    const form = field.current?.form;
    const reset = () => setUncontrolled(defaultValue ?? "");

    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, [defaultValue]);

  const set = (next: string) => {
    if (controlled === undefined) {
      setUncontrolled(next);
    }
    onChange?.(next);
  };

  return (
    <div className={cn("relative flex w-fit items-center gap-1", className)}>
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger
          render={
            <Button
              ref={trigger}
              id={id}
              type="button"
              variant="outline"
              disabled={disabled}
              aria-invalid={ariaInvalid}
              aria-describedby={ariaDescribedBy}
              className={cn("min-w-44 flex-1 justify-start font-normal", !selected && "text-muted-foreground")}
            />
          }
        >
          <CalendarIcon />
          {selected ? format(selected, displayFormat, { locale: dateLib }) : (placeholder ?? t("chooseDate"))}
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
        >
          <Calendar
            mode="single"
            locale={dateLib}
            formatters={calendarFormatters}
            selected={selected}
            defaultMonth={selected ?? latest ?? earliest}
            captionLayout="dropdown"
            startMonth={earliest}
            endMonth={latest}
            disabled={[...(earliest ? [{ before: earliest }] : []), ...(latest ? [{ after: latest }] : [])]}
            onSelect={(date) => {
              set(date ? iso(date) : "");
              setOpen(false);
              trigger.current?.focus();
            }}
          />
        </PopoverContent>
      </Popover>
      {selected && !required && !disabled && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t("clearDate")}
          onClick={() => set("")}
        >
          <X />
        </Button>
      )}
      {(name || required) && (
        // Carries the value in the form and, when required, takes part in constraint validation; the browser's
        // message is anchored next to the button.
        <input
          ref={field}
          name={name}
          value={value}
          required={required}
          disabled={disabled}
          tabIndex={-1}
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-4 size-px opacity-0"
          onChange={() => undefined}
        />
      )}
    </div>
  );
}
