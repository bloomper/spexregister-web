import { z } from "zod";

export const actorFormSchema = z.object({
  vocalId: z.string().min(1, "Common.fieldRequired"),
  role: z.string().optional(),
  characterId: z.string().optional().nullable(),
});

export type ActorFormInput = z.input<typeof actorFormSchema>;
export type ActorFormOutput = z.output<typeof actorFormSchema>;
