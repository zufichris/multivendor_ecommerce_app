import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/use-case";
import { EStatusCodes } from "../../../global/enum";
import { IOrderRepository } from "../repository";

export class DeleteOrderUseCase implements BaseUseCase<string, boolean, AuthContext> {
    constructor(private readonly orderRepository: IOrderRepository) { }

    async execute(id: string, context: AuthContext): Promise<UseCaseResult<boolean>> {
        try {
            if (!context.userId) {
                return handleUseCaseError({
                    title: "Authentication Required",
                    error: "User not authenticated",
                    status: EStatusCodes.enum.unauthorized
                });
            }

            const order = await this.orderRepository.findOne({ id, userId: context.userId });
            if (!order) {
                return handleUseCaseError({
                    title: "Order Not Found",
                    error: `Order with id ${id} not found for user`,
                    status: EStatusCodes.enum.notFound
                });
            }

            const deletedOrder = await this.orderRepository.delete(id);
            if (!deletedOrder) {
                return handleUseCaseError({
                    title: "Order Deletion Failed",
                    error: `Failed to delete order with id ${id}`,
                    status: EStatusCodes.enum.internalServerError
                });
            }

            return {
                success: true,
                data: deletedOrder,
            };
        } catch (error: any) {
            return handleUseCaseError({
                title: "Unexpected Error",
                error: "An unexpected error occurred during order deletion",
                status: EStatusCodes.enum.internalServerError
            });
        }
    }
}