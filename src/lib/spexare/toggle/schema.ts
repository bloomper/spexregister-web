import {z} from "zod";

export const toggleFormSchema = z.object({
    typeId: z
        .string()
        .min(1, "Common.fieldRequired"),
    value: z
        .boolean(),
});

export type ToggleFormInput = z.input<typeof toggleFormSchema>;
export type ToggleFormOutput = z.output<typeof toggleFormSchema>;
