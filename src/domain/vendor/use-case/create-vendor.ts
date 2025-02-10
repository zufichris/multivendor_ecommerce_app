import { TVendor } from "../../../data/entity/vendor";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/use-case";
import { validateData } from "../../../util/functions";
import { EStatusCodes } from "../../../global/enum";
import { EBusinessTypes } from "../../../data/enum/vendor";
import { CreateVendorDTO, CreateVendorSchema } from "../../../data/dto/vendor";
import { IVendorRepository } from "../repository";

export class CreateVendorUseCase implements BaseUseCase<CreateVendorDTO, TVendor, AuthContext> {
    constructor(private readonly vendorRepository: IVendorRepository) { }

    async execute(input: CreateVendorDTO, context: AuthContext): Promise<UseCaseResult<TVendor>> {
        try {
            if (!context.userId) {
                return handleUseCaseError({ title: "Forbidden", error: "Forbidden", status: EStatusCodes.enum.forbidden })
            }
            const validate = validateData<CreateVendorDTO>(input, CreateVendorSchema);
            if (!validate.success) {
                return handleUseCaseError({ error: validate.error, title: "Create Vendor", status: EStatusCodes.enum.badRequest });
            }

            const existingVendor = await this.vendorRepository.findOne({ userId: validate.data.userId });
            if (existingVendor) {
                return handleUseCaseError({ error: "Vendor with this user already exists", title: "Create Vendor" });
            }

            const data: Partial<TVendor> = {
                ...validate.data,
                isVerified: false,
                businessType: validate.data.businessType || EBusinessTypes.enum["SOLE PROPRIETOR"],
                isActive: true,
                verification: {
                    status: "PENDING",
                    documentType: validate.data.verification?.documentType || null,
                    reason: null,
                    documentUrls: [],
                },
                orders: { total: 0, monthlyComparison: { lastMonth: 0, thisMonth: 0 } },
                sales: { total: 0, trend: [], returnRate: 0 },
                followersCount: 0,
                productsCount: 0,
                payoutSchedule: "MONTHLY",
                lastActiveAt: null,
            };

            const createdVendor = await this.vendorRepository.create(data);
            if (!createdVendor) {
                return handleUseCaseError({ error: "Error creating vendor", title: "Create Vendor" });
            }

            return {
                data: createdVendor,
                success: true,
            };
        } catch (error) {
            return handleUseCaseError({ title: "Create Vendor", status: 500 });
        }
    }
}
