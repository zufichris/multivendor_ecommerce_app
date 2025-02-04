import { TVendor } from "../../../data/entities/vendor";
import { IQueryFilters, IQueryResult } from "../../../global/entities";
import { EStatusCodes } from "../../../global/enums";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/useCase";
import { isAdmin } from "../../../utils/functions";
import { IVendorRepository } from "../repository";

export class QueryVendorsUseCase implements BaseUseCase<IQueryFilters<TVendor>, IQueryResult<TVendor>, AuthContext> {
    constructor(private readonly vendorRepository: IVendorRepository) { }

    async execute(options?: IQueryFilters<TVendor>, context?: AuthContext): Promise<UseCaseResult<IQueryResult<TVendor>>> {
        try {
            if (!isAdmin(context?.roles)) {
                return handleUseCaseError({ title: "Forbidden", status: EStatusCodes.enum.forbidden })
            }
            const result = await this.vendorRepository.query(options);
            if (!result) {
                return handleUseCaseError({ error: "Error fetching vendors", title: "Get Vendors" });
            }

            return { data: result, success: true };
        } catch (error) {
            return handleUseCaseError({ title: "Get Vendors", status: 500 });
        }
    }
}
