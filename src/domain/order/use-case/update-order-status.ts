import { TOrder } from "../../../data/entity/order";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/use-case";
import { validateData } from "../../../util/functions";
import { EStatusCodes } from "../../../global/enum";
import { UpdateOrderStatusDTO, UpdateOrderStatusSchema } from "../../../data/dto/order";
import { IOrderRepository } from "../repository";

export class UpdateOrderStatusUseCase implements BaseUseCase<UpdateOrderStatusDTO, TOrder, AuthContext> {
    constructor(private readonly orderRepository: IOrderRepository) { }

    async execute(input: UpdateOrderStatusDTO, context: AuthContext): Promise<UseCaseResult<TOrder>> {
        try {
            if (!context?.userId) {
                return handleUseCaseError({
                    title: "Forbidden",
                    error: "User authentication required.",
                    status: EStatusCodes.enum.forbidden
                });
            }

            const validationResult = validateData<UpdateOrderStatusDTO>(input, UpdateOrderStatusSchema);
            if (!validationResult.success) {
                return handleUseCaseError({
                    title: "Invalid Input Data",
                    error: validationResult.error,
                    status: EStatusCodes.enum.badRequest
                });
            }

            const updatedOrder = await this.orderRepository.update(
                validationResult.data.id!,
                { status: validationResult.data.status, }
            );
            if (!updatedOrder) {
                return handleUseCaseError({
                    title: "Order Update Failed",
                    error: "Order not found or update operation was unsuccessful.",
                    status: EStatusCodes.enum.notFound
                });
            }

            return {
                data: updatedOrder,
                success: true,
            };
        } catch (error) {
            return handleUseCaseError({
                title: "Update Order Status Error",
                error: error instanceof Error ? error.message : "An unknown error occurred.",
                status: 500
            });
        }
    }
}