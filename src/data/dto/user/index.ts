import { z } from "zod";
import { UserSchema } from "../../entity/user";

export const CreateUserSchema = UserSchema.pick({
    email: true,
    firstName: true,
    lastName: true,
    profilePictureUrl: true,
    password: true,
    phoneNumber: true,
    oauth: true,
    isEmailVerified: true,
    externalProvider: true,
}).strict()

export const UpdateUserSchema = UserSchema.pick({
    firstName: true,
    lastName: true,
    phoneNumber: true,
    profilePictureUrl: true,
}).extend({
    userId: z.string({
        message: "Invalid user_id"
    })
})

export type CreateUserDTO = z.infer<typeof CreateUserSchema>
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>