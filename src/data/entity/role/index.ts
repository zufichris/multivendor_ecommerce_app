import { z } from "zod";

export const EPermissionResource = z.enum([
    "product",
    "user",
    "order",
    "role",
    "vendor",
    "payment",
    "payment-method",
    "address",
    "shipping",
]);

export const EPermissionValue = z.enum([
    "manage",
    "sensitive_data",
    "update",
    "delete",
    "view_own",
    "manage_own",
    "view",
    "create",
    "*",
]);

export const defaultPermissions: string[] = [
    "product:view",
    "user:view_own",
    "order:view_own",
    "address:view",
    "shipping:create",
    "payment:create",
    "payment-method:view",
];

export const RolePermission = z.string().regex(
    new RegExp(
        `^(${Object.values(EPermissionResource.enum).join("|")}):(${Object.values(EPermissionValue.enum).join("|")})$`
    ),
    "Invalid permission format. Expected format: resource:action"
);

export const RoleSchema = z.object({
    id: z.string().optional(),
    weight: z.number().optional().default(1),
    name: z.string().min(2, "Role name must have at least 2 characters"),
    permissions: z
        .array(RolePermission)
        .default(defaultPermissions),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});

export type TRolePermission = z.infer<typeof RolePermission>;
export type TRole = z.infer<typeof RoleSchema>;
