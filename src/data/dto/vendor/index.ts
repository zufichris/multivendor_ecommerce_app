import { z } from "zod";
import { VendorSchema } from "../../entities/vendor";
export const CreateVendorSchema = VendorSchema.pick({
    businessName: true,
    businessType: true,
    categories: true,
    description: true,
    location: true,
    userId: true,
    verification: true,
})
const UpdateVendorSchema = VendorSchema.pick
    ({
        businessName: true,
        description: true,
    })

export type CreateVendorDTO = z.infer<typeof CreateVendorSchema>
export type UpdateVendorDTO = z.infer<typeof UpdateVendorSchema>