import { z } from "zod";
import { ECurrency } from "../../../global/enums";

export const PaymentMethodSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    description: z.string(),
    logo: z.string(),
    supportedCurrencies: z.array(z.nativeEnum(ECurrency.Enum)).default(Object.values(ECurrency.enum)),
    feeStructure: z
        .object({
            percentage: z.number().min(0),
            fixed: z.number().min(0),
        })
        .optional(),
    isActive: z.boolean(),
    minAmount: z.number().min(0),
    maxAmount: z.number().min(0).optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
})
    .strict()
    .refine((data) => {
        if (data.maxAmount) {
            return data.maxAmount >= data.minAmount;
        }
        return true;
    }, {
        message: "maxAmount must be greater than or equal to minAmount",
        path: ["maxAmount"],
    })

export type TPaymentMethod = z.infer<typeof PaymentMethodSchema>

let t:TPaymentMethod
