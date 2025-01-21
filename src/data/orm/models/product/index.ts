import mongoose from "mongoose";
import { ProductSchema, TProduct, TVariant } from "../../../entities/product";
import { ECurrency } from "../../../../global/enums";
import { validateBeforeSave } from "../../../../utils/functions";

export type ProductDocument = TProduct & mongoose.Document

const PriceSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    compareAtPrice: { type: Number },
    costPrice: { type: Number },
    wholesalePrice: { type: Number },
}, { _id: false });

const VariantSchema = new mongoose.Schema<TVariant>({
    id: { type: String, required: true },
    sku: { type: String },
    barcode: { type: String },
    prices: { type: Map, of: PriceSchema, required: true },
    inventory: { type: Number, required: true },
    attributes: { type: Map, of: String, required: true },
}, { _id: false });


const schema = new mongoose.Schema<ProductDocument>({
    id: { type: String, required: true },
    vendorId: { type: String, required: true },
    name: { type: String, required: true, minlength: 2, maxlength: 200 },
    slug: { type: String, required: true, minlength: 2, maxlength: 200 },
    description: { type: String, required: true },
    shortDescription: { type: String, maxlength: 300 },
    sku: { type: String },
    barcode: { type: String },
    defaultPrice: {
        type: Number,
        required: true,
        min: 0
    },
    defaultCurrency: {
        type: String,
        enum: ECurrency.Values,
        required: true
    },

    prices: {
        type: Map,
        of: PriceSchema,
        required: true
    },

    categories: [{ type: String, required: true }],
    tags: [{ type: String }],
    brand: { type: String },
    images: [{
        id: { type: String, required: true },
        url: { type: String, required: true },
        alt: { type: String },
        sortOrder: { type: Number, default: 0 }
    }],
    variants: [VariantSchema],
    attributes: { type: Map, of: mongoose.Schema.Types.Mixed },
    status: { type: String, enum: ["DRAFT", "ACTIVE", "INACTIVE", "ARCHIVED"], required: true },
    inventory: {
        quantity: { type: Number, required: true },
        lowStockThreshold: { type: Number },
        trackInventory: { type: Boolean, default: true },
        allowBackOrder: { type: Boolean, default: false }
    },
    seo: {
        title: { type: String, maxlength: 60 },
        description: { type: String, maxlength: 160 },
        keywords: [{ type: String }],
    },
    translations: { type: Map, of: mongoose.Schema.Types.Mixed },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0 },
    isPromoted: { type: Boolean, default: false },
    promotions: [{ type: String }],
    weight: { type: Number },
    dimensions: {
        length: { type: Number },
        width: { type: Number },
        height: { type: Number },
        unit: { type: String, enum: ["CM", "INCH"] }
    },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
}, { timestamps: true });


validateBeforeSave(schema, ProductSchema, 'Product')

export const ProductModel = mongoose.models.Product || mongoose.model<ProductDocument>('Product', schema);
