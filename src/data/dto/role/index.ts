import { z } from "zod"
import { RoleSchema } from "../../entity/role"

export const CreateRoleSchema = RoleSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true
})

export const UpdateRoleSchema = RoleSchema.pick({
    permissions: true,
    weight: true,
}).extend({
    roleId:z.string()
})

export type CreateRoleDTO = z.infer<typeof CreateRoleSchema>
export type UpdateRoleDTO = z.infer<typeof UpdateRoleSchema>