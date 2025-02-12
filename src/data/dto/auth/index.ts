import { z } from "zod"
import { OAuthSchema, UserSchema } from "../../entity/user"

export const SignUpSchema = UserSchema.pick({
    email: true,
    firstName: true,
    lastName: true,
    profilePictureUrl: true,
    password: true,
    phoneNumber: true,
}).strict()

export const SignInSchema = UserSchema.pick({
    email: true,
}).extend({
    password: z.string()
})

export const SocialSignInSchema = UserSchema.pick({
    email: true,
    isEmailVerified: true,
    firstName: true,
    lastName: true,
    phoneNumber: true,
    profilePictureUrl: true
}).extend({
    oauth: OAuthSchema.strict(),
}).strict()

export type SignUpDTO = z.infer<typeof SignUpSchema>
export type SignInDTO = z.infer<typeof SignInSchema>
export type SocialSignInDTO = z.infer<typeof SocialSignInSchema>