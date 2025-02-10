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
        id: z.string().optional(),
        orderId: z.string(),
        shipId: z.string().optional(),
        address: AddressSchema.optional(),
        addressId: z.string(),
        userId: z.string(),
        trackingNumber: z.string().optional(),
        carrier: z.string().optional(),
        status: EShippingStatus.default("PENDING"),
        estimatedDelivery: z.string().datetime().optional(),
        statusHistory: z.array(ShippingStatusHistorySchema).default([]),
        createdAt: z.date().optional(),
        updatedAt: z.date().optional()
    })
    .strict();

export type TShipping = z.infer<typeof ShippingSchema>