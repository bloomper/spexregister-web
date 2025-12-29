import {z} from "zod";

export const taskFormSchema = z.object({
    name: z
        .string()
        .min(1, "Common.fieldRequired")
        .max(255, "Common.fieldTooLong"),
    categoryId: z
        .string()
        .optional(),
});

export type TaskFormInput = z.input<typeof taskFormSchema>;
export type TaskFormOutput = z.output<typeof taskFormSchema>;
