import { TOrder } from "../../../data/entity/order";
import { EStatusCodes } from "../../../global/enum";
import { CancelOrderDTO, CancelOrderSchema } from "../../../data/dto/order";
import { IOrderRepository } from "../repository";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/use-case";
import { validateData } from "../../../util/functions";


export class CancelOrderUseCase implements BaseUseCase<CancelOrderDTO, TOrder, AuthContext> {
    constructor(private readonly orderRepository: IOrderRepository) { }

    async execute(input: CancelOrderDTO, context: AuthContext): Promise<UseCaseResult<TOrder>> {
        try {
            if (!context.userId) {
                return handleUseCaseError({
                    title: "Access Denied",
                    error: "User authentication is missing. Please log in to cancel the order.",
                    status: EStatusCodes.enum.forbidden,
                });
            }

            const validation = validateData<CancelOrderDTO>(input, CancelOrderSchema);
            if (!validation.success) {
                return handleUseCaseError({
                    title: "Validation Error",
                    error: `Invalid order cancellation data: ${validation.error}`,
                    status: EStatusCodes.enum.badRequest,
                });
            }

            const orderId = validation.data.id;
            const order = await this.orderRepository.findById(orderId);

            if (!order) {
                return handleUseCaseError({
                    title: "Order Not Found",
                    error: `No order found with id: ${orderId}`,
                    status: EStatusCodes.enum.notFound,
                });
            }

            if (order.userId !== context.userId.toString()) {
                return handleUseCaseError({
                    title: "Unauthorized Access",
                    error: "The provided user does not have permission to cancel this order.",
                    status: EStatusCodes.enum.forbidden,
                });
            }

            if (order.status !== "PENDING") {
                return handleUseCaseError({
                    title: "Invalid Order Status",
                    error: "Only orders with a pending status can be cancelled.",
                    status: EStatusCodes.enum.badRequest,
                });
            }

            const updatedOrder = await this.orderRepository.update(orderId, { status: "CANCELLED" });
            if (!updatedOrder) {
                return handleUseCaseError({
                    title: "Cancellation Failed",
                    error: "An unexpected error occurred while cancelling the order. Please try again later.",
                    status: EStatusCodes.enum.internalServerError,
                });
            }

            return {
                success: true,
                data: updatedOrder,
            };
        } catch (error) {
            return handleUseCaseError({
                title: "Internal Error",
                error: "An error occurred during the cancellation process. Please contact support if the issue persists.",
                status: EStatusCodes.enum.internalServerError,
            });
        }
    }
}