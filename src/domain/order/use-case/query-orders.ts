import { TOrder } from "../../../data/entity/order";
import { IQueryFilters, IQueryResult } from "../../../global/entity";
import { EStatusCodes } from "../../../global/enum";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/use-case";
import { isAdmin } from "../../../util/functions";
import { IOrderRepository } from "../repository";

export class QueryOrdersUseCase implements BaseUseCase<IQueryFilters<TOrder>, IQueryResult<TOrder>, AuthContext> {
    constructor(private readonly orderRepository: IOrderRepository) { }

    async execute(options?: IQueryFilters<TOrder>, context?: AuthContext): Promise<UseCaseResult<IQueryResult<TOrder>>> {
        try {
            if (!isAdmin(context?.roles)) {
                return handleUseCaseError({ title: "Forbidden", status: EStatusCodes.enum.forbidden });
            }
            const result = await this.orderRepository.query(options);
            if (!result) {
                return handleUseCaseError({ error: "Error fetching orders", title: "Get Orders" });
            }

            return { data: result, success: true };
        } catch (error) {
            return handleUseCaseError({ title: "Get Orders", status: 500 });
        }
    }
}