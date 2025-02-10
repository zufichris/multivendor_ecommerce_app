import { TVendor } from "../../../data/entity/vendor";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/use-case";
import { isAdmin, isVendor, validateData } from "../../../util/functions";
import { EStatusCodes } from "../../../global/enum";
import { IVendorRepository } from "../repository";
import { UpdateVendorDTO } from "../../../data/dto/vendor";
import { UpdateUserSchema } from "../../../data/dto/user";

export class UpdateVendorUseCase implements BaseUseCase<{ id: string, data: Partial<UpdateVendorDTO> }, TVendor, AuthContext> {
    constructor(private readonly vendorRepository: IVendorRepository) { }

    async execute(input: { id: string, data: Partial<UpdateVendorDTO> }, context: AuthContext): Promise<UseCaseResult<TVendor>> {
        try {
            if (!isAdmin(context.roles) || !!isVendor(context.roles)) {
                return handleUseCaseError({ title: "Forbidden", error: "Unauthorized", status: EStatusCodes.enum.forbidden })
            }
            const { id, data } = input;
            const validate = validateData<UpdateVendorDTO>(data, UpdateUserSchema);
            if (!validate.success) {
                return handleUseCaseError({ error: validate.error, title: "Update Vendor", status: EStatusCodes.enum.badRequest });
            }

            const existingVendor = await this.vendorRepository.findById(id);
            if (!existingVendor) {
                return handleUseCaseError({ error: "Vendor not found", title: "Update Vendor", status: EStatusCodes.enum.notFound });
            }

            const updatedVendor = await this.vendorRepository.update(id, { ...validate.data, updatedAt: new Date() });

            if (!updatedVendor) {
                return handleUseCaseError({ error: "Error updating vendor", title: "Update Vendor" });
            }

            return {
                data: updatedVendor,
                success: true,
            };
        } catch (error) {
            return handleUseCaseError({ title: "Update Vendor", status: 500 });
        }
    }
}
