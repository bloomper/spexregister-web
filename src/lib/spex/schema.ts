import {z} from "zod";

export const spexFormSchema = z.object({
    year: z.string().min(1, "Common.fieldRequired"),
    title: z.string().min(1, "Common.fieldRequired"),
});

export type SpexFormInput = z.input<typeof spexFormSchema>;
export type SpexFormOutput = z.output<typeof spexFormSchema>;
