import {z} from "zod";
import {SpexareBulkOperation} from "@/gql/schema";

const ids = z.array(z.string().min(1)).min(1, "Common.fieldRequired");

export const bulkTargetSchema = z
    .object({
        ids: z.array(z.string().min(1)).optional(),
        filter: z.string().optional(),
    })
    .refine(
        (t) => ((t.ids?.length ?? 0) > 0) !== Boolean(t.filter),
        "Spexare.bulk.targetRequired",
    );

export const bulkInputSchema = z
    .object({
        target: bulkTargetSchema,
        operation: z.enum(SpexareBulkOperation),
        tags: ids.optional(),
        spex: ids.optional(),
        tasks: ids.optional(),
        spexId: z.string().min(1).optional(),
        values: z
            .array(z.object({typeId: z.string().min(1), value: z.boolean()}))
            .min(1)
            .optional(),
        fields: z
            .object({
                published: z.boolean().optional(),
                deceased: z.boolean().optional(),
            })
            .optional(),
    })
    .superRefine((data, ctx) => {
        const require = (ok: boolean, path: string) => {
            if (!ok) {
                ctx.addIssue({code: "custom", path: [path], message: "Common.fieldRequired"});
            }
        };

        switch (data.operation) {
            case SpexareBulkOperation.TagAdd:
            case SpexareBulkOperation.TagRemove:
                require(Boolean(data.tags?.length), "tags");
                break;
            case SpexareBulkOperation.SpexAdd:
            case SpexareBulkOperation.SpexRemove:
                require(Boolean(data.spex?.length), "spex");
                break;
            case SpexareBulkOperation.TaskAdd:
            case SpexareBulkOperation.TaskRemove:
                require(Boolean(data.tasks?.length), "tasks");
                require(Boolean(data.spexId), "spexId");
                break;
            case SpexareBulkOperation.ConsentSet:
            case SpexareBulkOperation.ToggleSet:
                require(Boolean(data.values?.length), "values");
                break;
            case SpexareBulkOperation.FieldsSet:
                require(
                    data.fields?.published !== undefined || data.fields?.deceased !== undefined,
                    "fields",
                );
                break;
        }
    });

export type BulkInput = z.output<typeof bulkInputSchema>;
