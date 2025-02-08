import mongoose from "mongoose";
import { EShippingStatus, ShippingSchema, TShipping } from "../../../entity/shipping";
import { validateBeforeSave } from "../../../../util/functions";

export type ShippingDocument = TShipping & mongoose.Document

const ShippingStatusHistorySchema = new mongoose.Schema(
    {
        status: {
            type: String,
            enum: Object.values(EShippingStatus.enum),
            required: true,
        },
        changedAt: { type: Date, required: true },
        reason: { type: String },
    },
    { _id: false }
);

const schema = new mongoose.Schema<ShippingDocument>({
    addressId: { type: String, ref: "Address" },
    userId: { type: String, required: true },
    trackingNumber: { type: String },
    carrier: { type: String },
    status: {
        type: String,
        enum: Object.values(EShippingStatus.enum),
        default: 'PENDING',
    },
    estimatedDelivery: { type: Date },
    statusHistory: { type: [ShippingStatusHistorySchema], default: [] },
}, {
    timestamps: true,
    toJSON: {
        transform: (doc) => {
            delete doc?._id
        },
        versionKey: false,
        virtuals: true
    }
});

validateBeforeSave(schema, ShippingSchema, "Shipping")

export const ShippingModel: mongoose.Model<ShippingDocument> = mongoose.models.Shipping || mongoose.model("Shipping", schema)