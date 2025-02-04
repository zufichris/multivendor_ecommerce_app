import { TVendor } from "../../../data/entities/vendor";
import { EStatusCodes } from "../../../global/enums";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/useCase";
import { isAdmin } from "../../../utils/functions";
import { IVendorRepository } from "../repository";

export class VerifyVendorUseCase implements BaseUseCase<{ id: string, status: "APPROVED" | "REJECTED", reason?: string }, TVendor, AuthContext> {
    constructor(private readonly vendorRepository: IVendorRepository) { }

    async execute(input: { id: string, status: "APPROVED" | "REJECTED", reason?: string }, context?: AuthContext): Promise<UseCaseResult<TVendor>> {
        try {
            if (!isAdmin(context?.roles)) {
                return handleUseCaseError({ title: "Forbidden", status: EStatusCodes.enum.forbidden })
            }
            const { id, status, reason } = input;
            const existingVendor = await this.vendorRepository.findById(id);
            if (!existingVendor) {
                return handleUseCaseError({ error: "Vendor not found", title: "Verify Vendor", status: EStatusCodes.enum.notFound });
            }

            const updatedVendor = await this.vendorRepository.update(id, {
                isVerified: status === "APPROVED",
                verification: { status, reason: status === "REJECTED" ? reason : null, documentUrls: [] },
            });

            if (!updatedVendor) {
                return handleUseCaseError({ error: "Error updating verification status", title: "Verify Vendor" });
            }

            return { data: updatedVendor, success: true };
        } catch (error) {
            return handleUseCaseError({ title: "Verify Vendor", status: 500 });
        }
    }
}
