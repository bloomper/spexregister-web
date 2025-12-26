import {z} from "zod";

const currentYear = new Date().getFullYear();

export const spexCategoryFormSchema = z.object({
    name: z
        .string()
        .min(1, "Common.fieldRequired")
        .max(255, "Common.fieldTooLong"),
    firstYear: z
        .string()
        .min(1, "Common.fieldRequired")
        .max(4, "Common.fieldTooLong")
        .refine((val) => {
            const year = parseInt(val, 10);
            return year >= 1948 && year <= currentYear + 2;
        }, {
            message: "Common.fieldInvalidRange"
        }),
});

export type SpexCategoryFormInput = z.input<typeof spexCategoryFormSchema>;
export type SpexCategoryFormOutput = z.output<typeof spexCategoryFormSchema>;
