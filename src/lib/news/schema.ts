import { z } from "zod";

export const newsSchema = z.object({
    id: z.string(),
    subject: z.string(),
    text: z.string(),
    published: z.boolean(),
    visibleFrom: z.string(),
    visibleTo: z.string().nullable(),
    createdAt: z.string(),
    createdBy: z.string(),
    updatedAt: z.string().nullable(),
    updatedBy: z.string().nullable(),
});

export type NewsForm = z.infer<typeof newsSchema>;
