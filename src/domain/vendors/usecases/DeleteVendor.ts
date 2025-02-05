import { EStatusCodes } from "../../../global/enums";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/usecase";
import { IVendorRepository } from "../repository";

export class DeleteVendorUseCase implements BaseUseCase<string, boolean, AuthContext> {
    constructor(private readonly vendorRepository: IVendorRepository) { }

    async execute(id: string, context: AuthContext): Promise<UseCaseResult<boolean>> {
        try {
            const existingVendor = await this.vendorRepository.findById(id);
            if (!existingVendor) {
                return handleUseCaseError({ error: "Vendor not found", title: "Delete Vendor", status: EStatusCodes.enum.notFound });
            }

            const deleted = await this.vendorRepository.delete(id);
            if (!deleted) {
                return handleUseCaseError({ error: "Error deleting vendor", title: "Delete Vendor" });
            }

            return { data: true, success: true };
        } catch (error) {
            return handleUseCaseError({ title: "Delete Vendor", status: 500 });
        }
    }
}
