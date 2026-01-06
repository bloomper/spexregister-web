import {z} from "zod";

export const spexActivityFormSchema = z.object({
    spexId: z
        .string()
        .min(1, "Common.fieldRequired"),
});

export type SpexActivityFormInput = z.input<typeof spexActivityFormSchema>;
export type SpexActivityFormOutput = z.output<typeof spexActivityFormSchema>;
