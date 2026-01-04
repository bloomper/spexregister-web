import {z} from "zod";

export const tagFormSchema = z.object({
    name: z
        .string()
        .min(1, "Common.fieldRequired")
        .max(255, "Common.fieldTooLong"),
});

export type TagFormInput = z.input<typeof tagFormSchema>;
export type TagFormOutput = z.output<typeof tagFormSchema>;
