import { z } from "zod";
import { OrderSchema } from "../../entity/order";
import { ShippingSchema } from "../../entity/shipping";

export const CreateOrderSchema = OrderSchema.omit({
    statusHistory: true,
    updatedAt: true,
    createdAt: true,
    id: true,
})

export const UpdateOrderSchema = OrderSchema.pick({
    id: true,
    notes: true,
    giftMessage: true,
    isGift: true,
    totalDiscount: true,
    shippingId: true,
    userId: true,
})
export const UpdateOrderStatusSchema = OrderSchema.pick({
    id: true,
    userId: true,
    status: true,
})

export const CancelOrderSchema = z.object({
    id: z.string(),
    userId: z.string(),
    cancellationReason: z.string().optional(),
});

export const AddRefundToOrderItemSchema = z.object({
    orderId: z.string(),
    itemId: z.string(),
    refund: z.object({
        amount: z.number().min(0),
        reason: z.string().optional(),
        processedAt: z.string().datetime(),
        initiatedBy: z.enum(["VENDOR", "CUSTOMER", "SYSTEM"]),
    }),
});

export const UpdateOrderShippingSchema = z.object({
    id: z.string(),
    userId: z.string(),
    shipping: z.array(ShippingSchema),
});


export type CancelOrderDTO = z.infer<typeof CancelOrderSchema>;
export type AddRefundToOrderItemDTO = z.infer<typeof AddRefundToOrderItemSchema>;
export type UpdateOrderShippingDTO = z.infer<typeof UpdateOrderShippingSchema>;
export type CreateOrderDTO = z.infer<typeof CreateOrderSchema>
export type UpdateOrderDTO = z.infer<typeof UpdateOrderSchema>
export type UpdateOrderStatusDTO = z.infer<typeof UpdateOrderStatusSchema>