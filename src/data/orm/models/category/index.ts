import mongoose, { Schema, Document, Model } from "mongoose";
import { z } from "zod";
import { CategorySchema, TCategory } from "../../../entities/category";
import { validateBeforeSave } from "../../../../utils/functions";

export type CategoryDocument = TCategory & Document;
const schema = new Schema<CategoryDocument>(
    {
        name: { type: String, required: true, minlength: 2, maxlength: 50 },
        slug: { type: String, required: true, minlength: 2, maxlength: 50 },
        description: { type: String, maxlength: 500 },
        image: { type: String },
        icon: { type: String },
        parentId: { type: String, default: null },
        level: { type: Number, required: true, min: 1, max: 3 },
        isActive: { type: Boolean, default: true },
        sortOrder: { type: Number, default: 0 },
        translations: {
            type: Map,
            of: new Schema({
                name: { type: String, required: true },
                description: { type: String },
            }),
        },
    },
    {
        timestamps: true,
    }
);
validateBeforeSave(schema, CategorySchema, "Category")
export const CategoryModel: Model<CategoryDocument> =
    mongoose.models.Category || mongoose.model<CategoryDocument>("Category", schema);
