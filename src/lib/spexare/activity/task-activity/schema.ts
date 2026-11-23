import {z} from "zod";

/**
 * A task activity, with the actor it may be added together with when its task's category has actors. The actor is
 * optional, but a role cannot be saved without a vocal.
 */
export const taskActivityFormSchema = z.object({
    taskId: z
        .string()
        .min(1, "Common.fieldRequired"),
    vocalId: z
        .string()
        .optional(),
    role: z
        .string()
        .optional(),
    characterId: z
        .string()
        .optional()
        .nullable(),
}).refine(
    (data) => !!data.vocalId || (!data.role?.trim() && !data.characterId),
    {path: ["vocalId"], message: "Common.fieldRequired"}
);

export type TaskActivityFormInput = z.input<typeof taskActivityFormSchema>;
export type TaskActivityFormOutput = z.output<typeof taskActivityFormSchema>;
