import { TPaymentMethod } from "../../../data/entity/payment-method";
import { IQueryFilters, IQueryResult } from "../../../global/entity";
import { EStatusCodes } from "../../../global/enum";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/use-case";
import { isAdmin } from "../../../util/functions";
import { IPaymentMethodRepository } from "../repository";

export class QueryPaymentMethodUseCase implements BaseUseCase<IQueryFilters<TPaymentMethod>, IQueryResult<TPaymentMethod>, AuthContext> {
    constructor(private readonly paymentMethodRepository: IPaymentMethodRepository) { }

    async execute(options?: IQueryFilters<TPaymentMethod>, context?: AuthContext): Promise<UseCaseResult<IQueryResult<TPaymentMethod>>> {
        try {
            if (!isAdmin(context?.roles)) {
                return handleUseCaseError({ title: "Forbidden", status: EStatusCodes.enum.forbidden });
            }
            const result = await this.paymentMethodRepository.query(options);
            if (!result) {
                return handleUseCaseError({ error: "Error fetching payment methods", title: "Query Payment Method" });
            }
            return { data: result, success: true };
        } catch (error) {
            return handleUseCaseError({ title: "Query Payment Method", status: 500 });
        }
    }
}