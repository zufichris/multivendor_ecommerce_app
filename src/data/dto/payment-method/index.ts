import { z } from "zod";
import { PaymentMethodSchema } from "../../entity/payment-method";

export const CreatePaymentMethodSchema = PaymentMethodSchema.omit({
    id: true,
    pmtId: true,
    createdAt: true,
    updatedAt: true
})
export const UpdatePaymentMethodSchema = PaymentMethodSchema.partial().omit({
    id: true,
    createdAt: true,
    updatedAt: true
}).partial()

export type UpdatePaymentMethodDTO = z.infer<typeof UpdatePaymentMethodSchema>
export type CreatePaymentMethodDTO = z.infer<typeof CreatePaymentMethodSchema>