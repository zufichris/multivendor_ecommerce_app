import mongoose from "mongoose";
import { TUser, UserSchema } from "../../../entities/user";
import { OAuthProviders } from "../../../enums/auth";
import { Role } from "../../../enums/user";
import { validateBeforeSave } from "../../../../utils/functions";

export type UserDocument = TUser & mongoose.Document;

const schema = new mongoose.Schema<UserDocument>(
    {
        firstName: { type: String, required: false },
        lastName: { type: String, required: false },
        email: { type: String, required: true, unique: true },
        phoneNumber: { type: String, required: false },
        password: { type: String, required: false },
        profilePictureUrl: {
            external: { type: Boolean, required: false },
            url: { type: String, required: false },
        },
        isActive: { type: Boolean, default: true },
        isEmailVerified: { type: Boolean, default: false },
        externalProvider: {
            type: String,
            enum: Object.values(OAuthProviders),
            required: false,
        },
        roles: {
            type: [String],
            enum: Object.values(Role),
            default: [Role.User],
        },
        oauth: {
            provider: {
                type: String,
                enum: Object.values(OAuthProviders),
                required: false,
            },
            oauthId: { type: String, required: false },
        },
        tokenPair: {
            accessToken: { type: String, required: false },
            refreshToken: { type: String, required: false },
        },
    },
    {
        timestamps: true,
    }
);

// validateBeforeSave(schema, UserSchema, 'User')

export const UserModel: mongoose.Model<UserDocument> =
    mongoose.models.User || mongoose.model<UserDocument>("User", schema);