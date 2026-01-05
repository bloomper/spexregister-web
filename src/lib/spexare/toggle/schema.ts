import {z} from "zod";

export const toggleFormSchema = z.object({
    value: z
        .boolean(),
});

export type ToggleFormInput = z.input<typeof toggleFormSchema>;
export type ToggleFormOutput = z.output<typeof toggleFormSchema>;
