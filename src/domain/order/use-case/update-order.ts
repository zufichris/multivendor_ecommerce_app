import { TOrder } from "../../../data/entity/order";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/use-case";
import { validateData } from "../../../util/functions";
import { EStatusCodes } from "../../../global/enum";
import { UpdateOrderDTO, UpdateOrderSchema } from "../../../data/dto/order";
import { IOrderRepository } from "../repository";

export class UpdateOrderUseCase implements BaseUseCase<UpdateOrderDTO, TOrder, AuthContext> {
    constructor(private readonly orderRepository: IOrderRepository) { }

    async execute(input: UpdateOrderDTO, context: AuthContext): Promise<UseCaseResult<TOrder>> {

        try {
            if (!context.userId) {
                return handleUseCaseError({
                    title: "Forbidden",
                    error: "Forbidden",
                    status: EStatusCodes.enum.forbidden
                });
            }

            const validation = validateData<UpdateOrderDTO>(input, UpdateOrderSchema);
            if (!validation.success) {
                return handleUseCaseError({
                    error: validation.error,
                    title: "Update Order",
                    status: EStatusCodes.enum.badRequest
                });
            }

            const existingOrder = await this.orderRepository.findOne({ id: validation.data.id });
            if (!existingOrder) {
                return handleUseCaseError({
                    error: "The requested order could not be found. Please verify the order ID and try again.",
                    title: "Order Not Found",
                    status: EStatusCodes.enum.notFound
                });
            }

            const updatedOrder = await this.orderRepository.update(validation.data.id!, validation.data);
            if (!updatedOrder) {
                return handleUseCaseError({
                    error: "Error updating order",
                    title: "Update Order"
                });
            }

            return {
                data: updatedOrder,
                success: true,
            };
        } catch (error) {
            return handleUseCaseError({
                title: "Update Order",
                status: 500
            });
        }
    }
}

