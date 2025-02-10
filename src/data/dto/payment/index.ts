import { z } from "zod";
import { PaymentSchema } from "../../entity/payment";

export const CreatePaymentSchema = PaymentSchema.omit({
    id: true,
    payId: true,
    createdAt: true,
    updatedAt: true,
    statusHistory: true,
}).strict()

export const UpdatePaymentSchema = PaymentSchema.omit({
    id: true,
    payId: true,
    createdAt: true,
    updatedAt: true,
}).partial()

export type CreatePaymentDTO = z.infer<typeof CreatePaymentSchema>
export type UpdatePaymentDTO = z.infer<typeof UpdatePaymentSchema>