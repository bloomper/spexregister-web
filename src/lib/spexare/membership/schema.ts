import {z} from "zod";

export const membershipFormSchema = z.object({
    year: z
        .string()
        .min(1, "Common.fieldRequired")
        .max(4, "Common.fieldTooLong"),
});

export type MembershipFormInput = z.input<typeof membershipFormSchema>;
export type MembershipFormOutput = z.output<typeof membershipFormSchema>;
