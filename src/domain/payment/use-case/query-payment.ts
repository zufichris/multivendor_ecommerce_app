import { TPayment } from "../../../data/entity/payment";
import { IQueryFilters, IQueryResult } from "../../../global/entity";
import { EStatusCodes } from "../../../global/enum";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/use-case";
import { isAdmin } from "../../../util/functions";
import { IPaymentRepository } from "../repository";

export class QueryPaymentUseCase implements BaseUseCase<IQueryFilters<TPayment>, IQueryResult<TPayment>, AuthContext> {
    constructor(private readonly paymentRepository: IPaymentRepository) {}

    async execute(options?: IQueryFilters<TPayment>, context?: AuthContext): Promise<UseCaseResult<IQueryResult<TPayment>>> {
        try {
            if (!isAdmin(context?.roles)) {
                return handleUseCaseError({ title: "Forbidden", status: EStatusCodes.enum.forbidden });
            }
            const result = await this.paymentRepository.query(options);
            if (!result) {
                return handleUseCaseError({ error: "Error fetching payments", title: "Query Payment" });
            }
            return { data: result, success: true };
        } catch (error) {
            return handleUseCaseError({ title: "Query Payment", status: 500 });
        }
    }
}