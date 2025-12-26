import {z} from "zod";

export const newsFormSchema = z.object({
    subject: z
        .string()
        .min(1, "Common.fieldRequired")
        .max(255, "Common.fieldTooLong"),
    text: z
        .string()
        .min(1, "Common.fieldRequired")
        .max(10000, "Common.fieldTooLong"),
    visibleFrom: z
        .string()
        .min(1, "Common.fieldRequired"),
    visibleTo: z
        .string()
        .nullable()
        .transform(val => (val === "" || val === null ? null : val))
});

export type NewsFormInput = z.input<typeof newsFormSchema>;
export type NewsFormOutput = z.output<typeof newsFormSchema>;
