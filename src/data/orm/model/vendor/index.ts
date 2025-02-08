import mongoose from "mongoose";
import { EBusinessTypes, EVerificationTypes } from "../../../enum/vendor"
import { TVendor, VendorSchema } from "../../../entity/vendor"
import { validateBeforeSave } from "../../../../util/functions";

export type VendorDocument = TVendor & mongoose.Document

const schema = new mongoose.Schema<VendorDocument>(
    {
        vendId: { type: String, unique: true, required: true },
        userId: { type: String, ref: "User", required: true },
        businessName: { type: String, required: true, trim: true },
        businessType: { type: String, enum: EBusinessTypes.Enum, default: EBusinessTypes.enum["SOLE PROPRIETOR"] },
        slug: {
            type: String,
            required: true
        },
        description: {
            type: String,
            minlength: 10
        },
        isVerified: { type: Boolean, default: false },
        verification: {
            type: {
                documentType: { type: String, enum: EVerificationTypes.Enum },
                status: { type: String, enum: ["APPROVED", "PENDING", "REJECTED"], default: "PENDING" },
                reason: { type: String },
                documentUrls: [{ type: String, required: false }],
            },
            required: false,
        },
        payoutMethod: { type: String, ref: "PaymentMethod" },
        payoutSchedule: { type: String, enum: ["WEEKLY", "MONTHLY"], default: "MONTHLY" },

        orders: {
            total: { type: Number, default: 0 },
            monthlyComparison: { lastMonth: Number, thisMonth: Number },
        },

        sales: {
            total: { type: Number, default: 0 },
            trend: { type: [Number], default: [] },
            returnRate: { type: Number, default: 0 },
        },

        followersCount: { type: Number, default: 0 },
        productsCount: { type: Number, default: 0 },
        categories: [{ type: String }],
        isActive: { type: Boolean, default: true },
        openHours: { type: Map, of: String },
        location: {
            country: { type: String, required: true },
            city: { type: String, required: true },
            address: { type: String, required: true },
            lat: { type: Number, required: false },
            lng: { type: Number, required: false },
        },
        storefront: {
            bannerImage: { type: String, required: false },
            profileImage: { type: String, required: false },
            description: { type: String, required: false, trim: true },
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        lastActiveAt: { type: Date, default: null },
    },
    {
        timestamps: true,
        toJSON: {
            versionKey: false,
            virtuals: true,
            transform: (c) => {
                delete c._id
                return c
            }
        }
    }
);
validateBeforeSave(schema, VendorSchema, "Vendor")

export const VendorModel: mongoose.Model<VendorDocument> = mongoose.models.Vendor || mongoose.model<VendorDocument>("Vendor", schema);
