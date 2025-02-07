import mongoose from "mongoose";
import { TPayment } from "../../../entities/payment";

const PaymentStatusHistorySchema = new mongoose.Schema(
    {
        status: {
            type: String,
            enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED'],
            required: true,
        },
        changedAt: { type: Date, required: true },
        reason: { type: String },
    },
    { _id: false }
);

const PaymentAttemptSchema = new mongoose.Schema(
    {
        amount: { type: Number, required: true, min: 0 },
        attemptedAt: { type: Date, required: true },
        error: { type: String },
    },
    { _id: false }
);

const PaymentFeeSchema = new mongoose.Schema(
    {
        processing: { type: Number, required: true, min: 0 },
        tax: { type: Number, required: true, min: 0 },
    },
    { _id: false }
);


export type PaymentDocument = TPayment & mongoose.Document
const schema = new mongoose.Schema({
    orderId: { type: String, required: true },
    userId: { type: String, required: true },
    paymentMethodId: { type: String, required: true },
    transactionId: { type: String },
    status: {
        type: String,
        enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED'],
        default: 'PENDING',
    },
    amountRequested: { type: Number, required: true, min: 0 },
    amountPaid: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true },
    fee: { type: PaymentFeeSchema },
    statusHistory: { type: [PaymentStatusHistorySchema], default: [] },
    attempts: { type: [PaymentAttemptSchema], required: true },
}, {
    timestamps: true,
    toJSON: {
        transform: (doc: any) => {
            delete doc?._id
            return doc
        },
        versionKey: false,
        virtuals: true,
    }
});

export const PaymentModel: mongoose.Model<PaymentDocument> = mongoose.models.Payment || mongoose.model("Payment", schema)