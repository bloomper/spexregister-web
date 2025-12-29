import {z} from "zod";


export const taskCategoryFormSchema = z.object({
    name: z
        .string()
        .min(1, "Common.fieldRequired")
        .max(255, "Common.fieldTooLong"),
    actorPresent: z
        .boolean(),
});

export type TaskCategoryFormInput = z.input<typeof taskCategoryFormSchema>;
export type TaskCategoryFormOutput = z.output<typeof taskCategoryFormSchema>;
