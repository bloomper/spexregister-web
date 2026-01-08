import {z} from "zod";

export const userFormSchema = z.object({
    email: z
        .email("User.invalidEmail")
        .min(1, "Common.fieldRequired")
        .max(255, "Common.fieldTooLong"),
    stateId: z
        .string()
        .min(1, "Common.fieldRequired"),
    authorityIds: z
        .array(z.string())
        .min(1, "Common.fieldRequired"),
    spexareId: z
        .string()
        .optional()
        .nullable(),
});

export type UserFormInput = z.input<typeof userFormSchema>;
export type UserFormOutput = z.output<typeof userFormSchema>;
