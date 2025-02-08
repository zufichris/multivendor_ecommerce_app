import { z } from "zod";
import { UserSchema } from "../../entity/user";

export const CreateUserSchema = UserSchema.pick({
    email: true,
    custId: true,
    firstName: true,
    lastName: true,
    profilePictureUrl: true,
    oauth: true,
    password: true,
    phoneNumber: true,
    externalProvider: true,
    preferences: true,
    stats: true,
    isEmailVerified: true,
    isActive: true,
}).extend({
    email: UserSchema.shape.email.email("Invalid Email"),
})

export const SignInSchema = UserSchema.pick({
    email: true,
    password: true
})
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

export const SocialSignInSchema = CreateUserSchema
export type CreateUserDTO = z.infer<typeof CreateUserSchema>
export type SignInDTO = z.infer<typeof SignInSchema>
export type SocialSignInDTO = z.infer<typeof SocialSignInSchema>
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>