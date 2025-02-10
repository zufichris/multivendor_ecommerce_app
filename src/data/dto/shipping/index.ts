import { z } from "zod";
import { ShippingSchema } from "../../entity/shipping";

export const CreateShippingSchema = ShippingSchema.omit({
    id: true,
    address: true,
    shipId: true,
    status: true,
    statusHistory: true
})
export const UpdateShippingSchema = ShippingSchema.pick({
    addressId: true,
    id:true,
    shipId:true,
    estimatedDelivery: true,
    status: true,
    statusHistory: true,
    trackingNumber: true,
})

export type CreateShippingDTO = z.infer<typeof CreateShippingSchema>
export type UpdateShippingDTO = z.infer<typeof UpdateShippingSchema>