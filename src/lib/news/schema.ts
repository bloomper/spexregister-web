import {z} from "zod";

export const newsFormSchema = z.object({
    subject: z.string().min(1, "News.subjectRequired"),
    text: z.string().min(1, "News.textRequired"),
    visibleFrom: z.string().min(1, "News.visibleFromRequired"),
    visibleTo: z.string().nullable().optional()
});

export type NewsFormData = z.infer<typeof newsFormSchema>;
