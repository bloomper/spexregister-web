import {z} from "zod";

export const consentFormSchema = z.object({
    value: z
        .boolean(),
});

export type ConsentFormInput = z.input<typeof consentFormSchema>;
export type ConsentFormOutput = z.output<typeof consentFormSchema>;
