import {z} from "zod";

export const consentFormSchema = z.object({
    typeId: z
        .string()
        .min(1, "Common.fieldRequired"),
    value: z
        .boolean()
        .default(false),
});

export type ConsentFormInput = z.input<typeof consentFormSchema>;
export type ConsentFormOutput = z.output<typeof consentFormSchema>;
