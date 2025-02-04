import { z } from "zod";
import { VendorSchema } from "../../entities/vendor";

const UpdateVendorSchema = VendorSchema.pick
    ({
        businessName: true,
        description: true,
    })
export type UpdateVendorDTO = z.infer<typeof UpdateVendorSchema>