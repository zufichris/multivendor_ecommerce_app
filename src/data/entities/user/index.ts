import { z } from "zod";
import { OAuthProviders } from "../../enums/auth";
import { Role } from "../../enums/user";
import { AddressSchema } from "../address";

export const OAuthSchema=z.object({
        provider: z.nativeEnum(OAuthProviders),
        oauthId: z.string(),
    })
export const UserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    password: z.string().nullable().optional(),
    isEmailVerified: z.boolean(),
    createdAt: z.date().nullable().optional(),
    updatedAt: z.date().nullable().optional(),
    oauth: OAuthSchema.nullable().optional(),
    tokenPair: z.object({
        provider: z.nativeEnum(OAuthProviders).nullable().optional(),
        accessToken: z.string().nullable().optional(),
        refreshToken: z.string().nullable().optional()
    }).nullable().optional(),
    externalProvider: z.nativeEnum(OAuthProviders).nullable().optional(),
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
    phoneNumber: z.string().nullable().optional(),
    profilePictureUrl: z.object({
        external: z.boolean(),
        url: z.string()
    }).nullable().optional(),
    address: AddressSchema.array().nullable().optional(),
    roles: z.array(z.nativeEnum(Role)).default([Role.User]),
    isActive: z.boolean(),
});


export type TUser = z.infer<typeof UserSchema>;
