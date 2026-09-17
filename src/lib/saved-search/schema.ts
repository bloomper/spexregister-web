import {z} from "zod";

export const savedSearchFormSchema = z.object({
    name: z
        .string()
        .min(1, "Common.fieldRequired")
        .max(255, "Common.fieldTooLong"),
    query: z
        .string()
        .max(2000, "Common.fieldTooLong"),
});

export type SavedSearchFormInput = z.input<typeof savedSearchFormSchema>;
export type SavedSearchFormOutput = z.output<typeof savedSearchFormSchema>;
