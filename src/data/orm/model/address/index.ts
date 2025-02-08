import mongoose from "mongoose";
import { TAddress } from "../../../entity/address";

export type AddressDocument = TAddress & Document
const schema = new mongoose.Schema<AddressDocument>(
    {
        userId: { type: String, ref: "User", required: true },
        custId: { type: String, required: true },
        type: { type: String, enum: ["SHIPPING", "BILLING", "BOTH"], default: "BOTH" },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        company: { type: String },
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true, minlength: 2, maxlength: 2 },
        phone: { type: String, required: true },
        email: { type: String },
        isDefault: { type: Boolean, default: false },
        isDefaultBilling: { type: Boolean, default: false },
        isDefaultShipping: { type: Boolean, default: false },
        isVerified: { type: Boolean, default: false },
        verificationMethod: { type: String, enum: ["MANUAL", "API", "NONE"], default: "NONE" },
        verificationDetails: {
            provider: { type: String },
            status: { type: String },
            verifiedAt: { type: Date },
            score: { type: Number },
        },
        deliveryInstructions: { type: String },
        addressLabel: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const AddressModel: mongoose.Model<AddressDocument> = mongoose.models.Address || mongoose.model<AddressDocument>("Address", schema);

