import { z } from "zod";
import { AddressSchema } from "../address";

export const EShippingStatus = z.enum([
    "PENDING",
    "SHIPPED",
    "IN_TRANSIT",
    "DELIVERED",
    "RETURNED"
]);

const ShippingStatusHistorySchema = z.object({
    status: EShippingStatus,
    changedAt: z.string().datetime(),
    reason: z.string().optional(),
});

export const ShippingSchema = z
    .object({
        address: AddressSchema.strict().optional(),
        addressId: z.string(),
        userId: z.string(),
        trackingNumber: z.string().optional(),
        carrier: z.string().optional(),
        status: EShippingStatus.default("PENDING"),
        estimatedDelivery: z.string().datetime().optional(),
        statusHistory: z.array(ShippingStatusHistorySchema).default([]),
    })
    .strict();

export type TShipping = z.infer<typeof ShippingSchema>