import { z } from "zod";

export const AddressTypeSchema = z.enum([
    "SHIPPING",
    "BILLING",
    "BOTH"
]);

export const AddressSchema = z.object({
    id: z.string().optional(),
    userId: z.string(),
    custId: z.string(),
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
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
        message: "Invalid Phone Number"
    }),
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
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type TAddress = z.infer<typeof AddressSchema>
