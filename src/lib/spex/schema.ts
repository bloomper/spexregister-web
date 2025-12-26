import {z} from "zod";

export const spexFormSchema = z.object({
    year: z
        .string()
        .min(1, "Common.fieldRequired")
        .max(4, "Common.fieldTooLong"),
    title: z
        .string()
        .min(1, "Common.fieldRequired")
        .max(255, "Common.fieldTooLong"),
    categoryId: z
        .string()
        .min(1, "Common.fieldRequired"),
    revivalYears: z
        .array(z.string()).optional(),
});

export type SpexFormInput = z.input<typeof spexFormSchema>;
export type SpexFormOutput = z.output<typeof spexFormSchema>;
