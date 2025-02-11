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
            if (!isAdmin(context.roles) && !isVendor(context.roles)) {
                return handleUseCaseError({ title: "Forbidden", error: "Unauthorized access", status: EStatusCodes.enum.forbidden })
            }
            const { id, data } = input;
            const validate = validateData<UpdateVendorDTO>(data, UpdateUserSchema);
            if (!validate.success) {
                return handleUseCaseError({ error: validate.error, title: "Invalid Input", status: EStatusCodes.enum.badRequest });
            }

            const existingVendor = await this.vendorRepository.findById(id);
            if (!existingVendor) {
                return handleUseCaseError({ error: "Vendor not found", title: "Vendor Not Found", status: EStatusCodes.enum.notFound });
            }

            const updatedVendor = await this.vendorRepository.update(id, { ...validate.data, updatedAt: new Date() });

            if (!updatedVendor) {
                return handleUseCaseError({ error: "Failed to update vendor profile", title: "Update Failed", status: EStatusCodes.enum.internalServerError });
            }

            return {
                data: updatedVendor,
                success: true,
            };
        } catch (error) {
            console.error("Error updating vendor:", error);
            return handleUseCaseError({ title: "Internal Server Error", error: "An unexpected error occurred while updating the vendor.", status: EStatusCodes.enum.internalServerError });
        }
    }
}