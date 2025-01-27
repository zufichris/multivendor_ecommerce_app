import mongoose from "mongoose";
import { TUser, TUserPreferences, TUserStats, UserSchema } from "../../../entities/user";
import { OAuthProviders } from "../../../enums/auth";
import { Role } from "../../../enums/user";
import { validateBeforeSave } from "../../../../utils/functions";
import { TABLES } from "../../../../global/enums";

export type UserDocument = TUser & mongoose.Document;
const preferenceMongooseSchema = new mongoose.Schema<TUserPreferences>({
    currency: String,
    language: String,
    notificationPreferences: {
        email: String,
        sms: String,
        push: String
    }
}, {
    _id: false,
    versionKey: false,
})
const statsMongooseSchema = new mongoose.Schema<TUserStats>({
    totalOrders: {
        type: Number,
        default: 0,
    },
    totalSpent: {
        type: Number,
        default: 0,
    },
    averageOrderValue: {
        type: Number,
        default: 0,
    },
    favoriteVendors: [
        {
            vendorName: {
                type: String,
                required: true,
            },
            vendorId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: TABLES.Vendor.toString(),
            },
        },
    ],
    recentlyViewedProducts: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: TABLES.Product.toString(),
            },
            viewedAt: {
                type: Date,
                default: new Date(Date.now()),
            },
        },
    ],
    ordersHistory: [
        {
            orderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: TABLES.Order.toString(),
            },
            totalAmount: Number,
            orderDate: Date,
        },
    ],
}, {
    _id: false,
    versionKey: false,
    timestamps: false
});

const userMongoose = new mongoose.Schema<UserDocument>(
    {
        firstName: { type: String, required: false },
        lastName: { type: String, required: false },
        custId: {
            type: String,
            unique: true,
            required: true
        },
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
        stats: statsMongooseSchema,
        preferences: preferenceMongooseSchema
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_, ret) => {
                delete ret.password;
                delete ret._id;
                delete ret.__v;
            },
            virtuals: true,
        }
    }
);



validateBeforeSave(userMongoose, UserSchema, TABLES.User.toString())

export const UserModel: mongoose.Model<UserDocument> =
    mongoose.models[TABLES.User.toString()] || mongoose.model<UserDocument>(TABLES.User.toString(), userMongoose);