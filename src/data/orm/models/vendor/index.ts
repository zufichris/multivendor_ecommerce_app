import { z } from "zod";

export const VendorSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2).max(100),
    slug: z.string().min(2).max(100),
    description: z.string().max(1000).optional(),
    logo: z.string().url().optional(),
    coverImage: z.string().url().optional(),
    rating: z.number().min(0).max(5).default(0),
    totalSales: z.number().default(0),
    followers: z.number().default(0),
    // status: StatusSchema,
    isVerified: z.boolean().default(false),
    level: z.enum(["STANDARD", "GOLD", "PLATINUM"]).default("STANDARD"),
    commissionRate: z.number().min(0).max(100),
    paymentDetails: z.object({
        bankName: z.string().optional(),
        accountNumber: z.string().optional(),
        swiftCode: z.string().optional(),
    }).optional(),
    contactInfo: z.object({
        email: z.string().email(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
    }),
    operatingHours: z.array(z.object({
        day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]),
        openTime: z.string(),
        closeTime: z.string(),
        isClosed: z.boolean().default(false),
    })).optional(),
    socialMedia: z.object({
        facebook: z.string().url().optional(),
        twitter: z.string().url().optional(),
        instagram: z.string().url().optional(),
    }).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    userId: z.string().uuid(),
});