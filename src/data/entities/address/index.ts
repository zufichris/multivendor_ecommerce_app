import { z } from "zod";

export const AddressTypeSchema = z.enum([
    "SHIPPING",
    "BILLING",
    "BOTH"
]);

export const AddressSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    type: AddressTypeSchema.default("BOTH"),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    company: z.string().optional(),
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().length(2),
    phone: z.string(),
    email: z.string().email().optional(),
    isDefault: z.boolean().default(false),
    isDefaultBilling: z.boolean().default(false),
    isDefaultShipping: z.boolean().default(false),
    isVerified: z.boolean().default(false),
    verificationMethod: z.enum(["MANUAL", "API", "NONE"]).default("NONE"),
    verificationDetails: z.object({
        provider: z.string().optional(),
        status: z.string().optional(),
        verifiedAt: z.date().optional(),
        score: z.number().optional(),
    }).optional(),
    deliveryInstructions: z.string().optional(),
    addressLabel: z.string().optional(),
    coordinates: z.object({
        latitude: z.number(),
        longitude: z.number(),
    }).optional(),
    taxId: z.string().optional(),
    vatNumber: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type TAddress = z.infer<typeof AddressSchema>
