import { z } from "zod";
import { EBusinessTypes, EVerificationTypes } from "../../enums/vendor";

export const VendorSchema = z.object({
    id: z.string().optional(),
    vendId: z.string().uuid(),
    userId: z.string().min(1, "User ID is required"),
    businessName: z.string().min(2, "Business name is too short"),
    businessType: z.nativeEnum(EBusinessTypes.enum).default(EBusinessTypes.enum["SOLE PROPRIETOR"]),
    description: z.string().min(10, {
        message: "Description cannot be less than 10 characters"
    }),
    isVerified: z.boolean().default(false),
    verification: z
        .object({
            documentType: z.nativeEnum(EVerificationTypes.enum),
            status: z.enum(["APPROVED", "PENDING", "REJECTED"]).default("PENDING"),
            reason: z.string().optional(),
            documentUrls: z.array(z.string().url()).optional(),
        })
        .optional(),

    payoutMethod: z.string().min(1, "Payout method is required"),
    payoutSchedule: z.enum(["WEEKLY", "MONTHLY"]).default("MONTHLY"),

    orders: z
        .object({
            total: z.number().default(0),
            monthlyComparison: z.object({
                lastMonth: z.number().default(0),
                thisMonth: z.number().default(0),
            }).default({ lastMonth: 0, thisMonth: 0 }),
        })
        .default({ total: 0, monthlyComparison: { lastMonth: 0, thisMonth: 0 } }),

    sales: z
        .object({
            total: z.number().default(0),
            trend: z.array(z.number()).default([]),
            returnRate: z.number().default(0),
        })
        .default({ total: 0, trend: [], returnRate: 0 }),

    followersCount: z.number().default(0),
    productsCount: z.number().default(0),
    categories: z.array(z.string()).default([]),

    isActive: z.boolean().default(true),
    openHours: z.record(z.string()).optional(),

    location: z.object({
        country: z.string().min(1, "Country is required"),
        city: z.string().min(1, "City is required"),
        address: z.string().min(1, "Address is required"),
        lat: z.number().optional(),
        lng: z.number().optional(),
    }),

    storefront: z
        .object({
            bannerImage: z.string().url().optional(),
            profileImage: z.string().url().optional(),
            description: z.string().optional(),
        })
        .optional(),

    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
    lastActiveAt: z.date().nullable().optional(),
});

export type TVendor = z.infer<typeof VendorSchema>