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
                return handleUseCaseError({
                    title: "Forbidden",
                    error: "Insufficient permissions to query orders.",
                    status: EStatusCodes.enum.forbidden
                });
            }

            const result = await this.orderRepository.query(options);

            if (!result) {
                return handleUseCaseError({
                    title: "Get Orders",
                    error: "Failed to retrieve orders from the database.",
                    status: EStatusCodes.enum.notFound
                });
            }

            return { data: result, success: true };
        } catch (error) {
            console.error("Error querying orders:", error);
            return handleUseCaseError({
                title: "Get Orders",
                error: "An unexpected error occurred while querying orders.",
                status: EStatusCodes.enum.internalServerError
            });
        }
    }
}