import {z} from "zod";

export const taskActivityFormSchema = z.object({
    taskId: z
        .string()
        .min(1, "Common.fieldRequired"),
});

export type TaskActivityFormInput = z.input<typeof taskActivityFormSchema>;
export type TaskActivityFormOutput = z.output<typeof taskActivityFormSchema>;
