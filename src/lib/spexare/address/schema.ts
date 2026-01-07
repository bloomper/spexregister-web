import {z} from "zod";

export const addressFormSchema = z.object({
    typeId: z
        .string()
        .min(1, "Common.fieldRequired"),
    streetAddress: z
        .string()
        .max(255, "Common.fieldTooLong")
        .optional(),
    postalCode: z
        .string()
        .max(255, "Common.fieldTooLong")
        .optional(),
    city: z
        .string()
        .max(255, "Common.fieldTooLong")
        .optional(),
    country: z
        .string()
        .max(255, "Common.fieldTooLong")
        .optional(),
    phone: z
        .string()
        .max(255, "Common.fieldTooLong")
        .optional(),
    phoneMobile: z
        .string()
        .max(255, "Common.fieldTooLong")
        .optional(),
    emailAddress: z
        .email("Spexare.Address.invalidEmailAddress")
        .max(255, "Common.fieldTooLong")
        .or(z.literal(""))
        .transform((val) => (val === "" ? undefined : val))
        .optional(),
});

export type AddressFormInput = z.input<typeof addressFormSchema>;
export type AddressFormOutput = z.output<typeof addressFormSchema>;
