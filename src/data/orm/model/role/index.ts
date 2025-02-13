import mongoose from "mongoose";
import { defaultPermissions, RoleSchema, TRole } from "../../../entity/role";
import { validateBeforeSave } from "../../../../util/functions";

export type RoleDocument = TRole & mongoose.Document

const schema = new mongoose.Schema<RoleDocument>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    weight: {
        type: Number,
        default: 1
    },
    permissions: [{
        type: String,
        default: defaultPermissions
    }],
}, {
    timestamps: true,
    toJSON: {
        transform: (doc) => {
            delete doc?._id
            return doc
        },
        versionKey: false
    }
})

validateBeforeSave(schema, RoleSchema, "Role")

export const RoleModel: mongoose.Model<RoleDocument> = mongoose.models.Role || mongoose.model("Role", schema)