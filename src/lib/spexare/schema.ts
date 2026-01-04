import {z} from "zod";

export const spexareFormSchema = z.object({
    firstName: z
        .string()
        .min(1, "Common.fieldRequired")
        .max(255, "Common.fieldTooLong"),
    lastName: z
        .string()
        .min(1, "Common.fieldRequired")
        .max(255, "Common.fieldTooLong"),
    nickName: z
        .string()
        .max(255, "Common.fieldTooLong")
        .optional(),
    deceased: z
        .boolean()
        .optional(),
    published: z
        .boolean()
        .optional(),
    birthDate: z
        .string()
        .optional(),
    birthNumber: z
        .string()
        .regex(/^\d{4}$/, "Spexare.invalidBirthNumber")
        .optional()
        .or(z.literal("")),
    socialSecurityNumber: z
        .string()
        .optional(),
    graduation: z
        .string()
        .max(255, "Common.fieldTooLong")
        .optional(),
    comment: z
        .string()
        .max(10000, "Common.fieldTooLong")
        .optional(),
})
    .superRefine((data, ctx) => {
        if (data.birthDate && data.birthNumber) {
            const birthDateStr = data.birthDate.replace(/-/g, "");
            const fullSsn = `${birthDateStr}-${data.birthNumber}`;

            const regex = /^(?:19|20|21)(\d{2})(\d{2})(\d{2})-(\d{3})(\d)$/;
            const match = fullSsn.match(regex);

            if (!match) {
                ctx.addIssue({
                    code: "custom" as const,
                    message: "Spexare.invalidBirthNumber",
                    path: ["birthNumber"],
                });
                return;
            }

            const year = match[1];
            const month = match[2];
            const day = match[3];
            const prefix = match[4];
            const checkDigit = parseInt(match[5], 10);
            const fullNumber = `${year}${month}${day}${prefix}`;

            let sum = 0;
            for (let i = 0; i < fullNumber.length; i++) {
                let temp = parseInt(fullNumber[i], 10);
                temp *= 2 - (i % 2);
                if (temp > 9) {
                    temp -= 9;
                }
                sum += temp;
            }

            const calculatedCheck = (10 - (sum % 10)) % 10;

            if (calculatedCheck !== checkDigit) {
                ctx.addIssue({
                    code: "custom" as const,
                    message: "Spexare.invalidBirthNumber",
                    path: ["birthNumber"],
                });
            }
        }
    });

export type SpexareFormInput = z.input<typeof spexareFormSchema>;
export type SpexareFormOutput = z.output<typeof spexareFormSchema>;
