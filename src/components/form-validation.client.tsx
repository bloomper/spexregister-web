"use client";

import {useEffect} from "react";
import {useTranslations} from "next-intl";

type Control = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

const isControl = (target: EventTarget | null): target is Control =>
    target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;

/**
 * Replaces the browser's own constraint-validation messages ("Please fill out this field"), which come in the browser's
 * language, with the app's translations. Mounted once inside the intl provider; listens for `invalid` on the whole
 * document, so forms keep using plain `required`, `pattern`, `min` and so on.
 *
 * Only messages this component set are replaced or cleared, so a control's own `setCustomValidity` is left alone.
 */
export function FormValidation() {
    const t = useTranslations("Common.validation");

    useEffect(() => {
        const ours = new WeakSet<Control>();

        const message = (control: Control): string | null => {
            const validity = control.validity;

            if (validity.valueMissing) {
                if (control instanceof HTMLInputElement && control.type === "file") {
                    return t("fileMissing");
                }
                if (control instanceof HTMLSelectElement || (control instanceof HTMLInputElement && control.type === "radio")) {
                    return t("selectMissing");
                }
                if (control instanceof HTMLInputElement && control.type === "checkbox") {
                    return t("checkboxMissing");
                }
                return t("valueMissing");
            }
            if (validity.typeMismatch) {
                return control.type === "email" ? t("email") : control.type === "url" ? t("url") : t("format");
            }
            if (validity.patternMismatch) {
                return control.title ? t("patternWithHint", {hint: control.title}) : t("format");
            }
            if (validity.tooShort) {
                return t("tooShort", {min: (control as HTMLInputElement).minLength});
            }
            if (validity.tooLong) {
                return t("tooLong", {max: (control as HTMLInputElement).maxLength});
            }
            if (validity.rangeUnderflow) {
                return t("rangeUnderflow", {min: (control as HTMLInputElement).min});
            }
            if (validity.rangeOverflow) {
                return t("rangeOverflow", {max: (control as HTMLInputElement).max});
            }
            if (validity.stepMismatch) {
                return t("step");
            }
            if (validity.badInput) {
                return control.type === "number" ? t("number") : t("format");
            }
            return null;
        };

        const onInvalid = (event: Event) => {
            const control = event.target;

            if (!isControl(control)) {
                return;
            }
            if (control.validity.customError && !ours.has(control)) {
                return; // the control's own message
            }
            control.setCustomValidity("");

            const text = message(control);

            if (text) {
                control.setCustomValidity(text);
                ours.add(control);
            } else {
                ours.delete(control);
            }
        };

        const onEdit = (event: Event) => {
            const control = event.target;

            if (isControl(control) && ours.has(control)) {
                control.setCustomValidity("");
                ours.delete(control);
            }
        };

        const onReset = (event: Event) => {
            if (event.target instanceof HTMLFormElement) {
                for (const element of Array.from(event.target.elements)) {
                    onEdit({target: element} as unknown as Event);
                }
            }
        };

        document.addEventListener("invalid", onInvalid, true);
        document.addEventListener("input", onEdit, true);
        document.addEventListener("change", onEdit, true);
        document.addEventListener("reset", onReset, true);
        return () => {
            document.removeEventListener("invalid", onInvalid, true);
            document.removeEventListener("input", onEdit, true);
            document.removeEventListener("change", onEdit, true);
            document.removeEventListener("reset", onReset, true);
        };
    }, [t]);

    return null;
}
