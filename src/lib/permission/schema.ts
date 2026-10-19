import {z} from "zod";

export const PERMISSIONS = ["READ", "WRITE", "DELETE", "ADMINISTRATION"] as const;
export const SCOPES = ["SPEXARE", "SPEX_PARTICIPANTS", "SPEX"] as const;
export const GRANTABLE_ROLES = ["USER", "EDITOR", "ADMIN"] as const;

export const permissionGrantFormSchema = z
    .object({
        granteeType: z.enum(["USER", "ROLE"]),
        userId: z.string().optional(),
        role: z.enum(GRANTABLE_ROLES).optional(),
        permission: z.enum(PERMISSIONS),
        scope: z.enum(SCOPES),
        spexareId: z.string().optional(),
        spexId: z.string().optional(),
        validUntil: z.string().optional(),
    })
    .superRefine((value, ctx) => {
        if (value.granteeType === "USER" && !value.userId) {
            ctx.addIssue({code: "custom", path: ["userId"], message: "PermissionGrant.validation.userRequired"});
        }
        if (value.granteeType === "ROLE" && !value.role) {
            ctx.addIssue({code: "custom", path: ["role"], message: "PermissionGrant.validation.roleRequired"});
        }
        if (value.scope === "SPEXARE" && !value.spexareId) {
            ctx.addIssue({code: "custom", path: ["spexareId"], message: "PermissionGrant.validation.spexareRequired"});
        }
        if (value.scope !== "SPEXARE" && !value.spexId) {
            ctx.addIssue({code: "custom", path: ["spexId"], message: "PermissionGrant.validation.spexRequired"});
        }
        if (value.validUntil && value.validUntil < new Date().toISOString().slice(0, 10)) {
            ctx.addIssue({code: "custom", path: ["validUntil"], message: "PermissionGrant.validation.validUntilPast"});
        }
    });

export type PermissionGrantFormInput = z.infer<typeof permissionGrantFormSchema>;

/** Grantee and scope are fixed once a grant exists; only these can change */
export const permissionGrantUpdateFormSchema = z
    .object({
        permission: z.enum(PERMISSIONS),
        validUntil: z.string().optional(),
    })
    .superRefine((value, ctx) => {
        if (value.validUntil && value.validUntil < new Date().toISOString().slice(0, 10)) {
            ctx.addIssue({code: "custom", path: ["validUntil"], message: "PermissionGrant.validation.validUntilPast"});
        }
    });

export type PermissionGrantUpdateFormInput = z.infer<typeof permissionGrantUpdateFormSchema>;

export function toCreateInput(value: PermissionGrantFormInput) {
    return {
        userId: value.granteeType === "USER" ? value.userId : null,
        role: value.granteeType === "ROLE" ? value.role : null,
        permission: value.permission,
        scope: value.scope,
        spexareId: value.scope === "SPEXARE" ? value.spexareId : null,
        spexId: value.scope === "SPEXARE" ? null : value.spexId,
        validUntil: value.validUntil || null,
    };
}

export function toUpdateInput(id: string, value: PermissionGrantUpdateFormInput) {
    return {
        id,
        permission: value.permission,
        validUntil: value.validUntil || null,
    };
}
