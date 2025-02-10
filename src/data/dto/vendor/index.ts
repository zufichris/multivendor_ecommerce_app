import { z } from "zod";
import { VendorSchema } from "../../entity/vendor";
export const CreateVendorSchema = VendorSchema.pick({
    businessName: true,
    businessType: true,
    categories: true,
    description: true,
    location: true,
    userId: true,
    verification: true,
})
export const UpdateVendorSchema = VendorSchema.pick
    ({
        description: true,
        storefront: true
    })

export type CreateVendorDTO = z.infer<typeof CreateVendorSchema>
export type UpdateVendorDTO = z.infer<typeof UpdateVendorSchema>