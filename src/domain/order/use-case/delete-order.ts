import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/use-case";
import { EStatusCodes } from "../../../global/enum";
import { IOrderRepository } from "../repository";

export class DeleteOrderUseCase implements BaseUseCase<string, boolean, AuthContext> {
    constructor(private readonly orderRepository: IOrderRepository) { }

    async execute(id: string, context: AuthContext): Promise<UseCaseResult<boolean>> {
        try {
            if (!context.userId) {
                return handleUseCaseError({
                    title: "Forbidden",
                    error: "Forbidden",
                    status: EStatusCodes.enum.forbidden
                });
            }

            const order = await this.orderRepository.findOne({ id, userId: context.userId });
            if (!order) {
                return handleUseCaseError({
                    title: "Delete Order",
                    error: "Order not found",
                    status: EStatusCodes.enum.notFound
                });
            }

            const deletedOrder = await this.orderRepository.delete(id);
            if (!deletedOrder) {
                return handleUseCaseError({
                    title: "Delete Order",
                    error: "Error deleting order",
                    status: EStatusCodes.enum.internalServerError
                });
            }

            return {
                success: true,
                data: deletedOrder,
            };
        } catch (error) {
            return handleUseCaseError({
                title: "Delete Order",
                status: EStatusCodes.enum.internalServerError
            });
        }
    }
}