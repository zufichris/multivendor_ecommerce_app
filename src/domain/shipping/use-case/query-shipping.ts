import { TShipping } from "../../../data/entity/shipping";
import { IQueryFilters, IQueryResult } from "../../../global/entity";
import { EStatusCodes } from "../../../global/enum";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/use-case";
import { isAdmin } from "../../../util/functions";
import { IShippingRepository } from "../repository";

export class QueryShippingsUseCase implements BaseUseCase<IQueryFilters<TShipping>, IQueryResult<TShipping>, AuthContext> {
    constructor(private readonly shippingRepository: IShippingRepository) { }

    async execute(options?: IQueryFilters<TShipping>, context?: AuthContext): Promise<UseCaseResult<IQueryResult<TShipping>>> {
        try {
            if (!isAdmin(context?.roles)) {
                return handleUseCaseError({ title: "Forbidden", status: EStatusCodes.enum.forbidden });
            }

            const result = await this.shippingRepository.query(options);
            if (!result) {
                return handleUseCaseError({ error: "Error fetching shippings", title: "Query Shippings" });
            }

            return { data: result, success: true };
        } catch (error) {
            return handleUseCaseError({ title: "Query Shippings", status: 500 });
        }
    }
}