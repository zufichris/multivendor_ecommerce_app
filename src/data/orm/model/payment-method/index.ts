import mongoose from "mongoose";
import { PaymentMethodSchema, TPaymentMethod } from "../../../entity/payment-method";
import { validateBeforeSave } from "../../../../util/functions";

export type PaymentMethodDocument = TPaymentMethod & mongoose.Document;

const schema = new mongoose.Schema<PaymentMethodDocument>({
    pmtId:String,
    name: { type: String, required: true },
    description: { type: String, required: true },
    logo: { type: String, required: true },
    supportedCurrencies: { type: [String], required: true },
    feeStructure: {
        percentage: { type: Number, required: true, min: 0 },
        fixed: { type: Number, required: true, min: 0 },
    },
    isActive: { type: Boolean, required: true },
    minAmount: { type: Number, required: true, min: 0 },
    maxAmount: { type: Number, min: 0 },
}, {
    timestamps: true,
    toJSON: {
        transform: (doc) => {
            delete doc?._id
            return doc
        },
        versionKey: false,
        virtuals: true,
    }
});

validateBeforeSave(schema, PaymentMethodSchema.refine((data) => {
    if (data.maxAmount) {
        return data.maxAmount >= data.minAmount;
    }
    return true;
}, {
    message: "maxAmount must be greater than or equal to minAmount",
    path: ["maxAmount"],
})
    , "PaymentMethod")

export const PaymentMethodModel: mongoose.Model<PaymentMethodDocument> = mongoose.models.PaymentMethod || mongoose.model("PaymentMethod", schema)