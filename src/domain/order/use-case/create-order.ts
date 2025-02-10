import { TOrder } from "../../../data/entity/order";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/use-case";
import { validateData } from "../../../util/functions";
import { EStatusCodes } from "../../../global/enum";
import { CreateOrderDTO, CreateOrderSchema } from "../../../data/dto/order";
import { IOrderRepository } from "../repository";

export class CreateOrderUseCase implements BaseUseCase<CreateOrderDTO, TOrder, AuthContext> {
    constructor(private readonly orderRepository: IOrderRepository) { }

    async execute(input: CreateOrderDTO, context: AuthContext): Promise<UseCaseResult<TOrder>> {
        try {
            if (!context.userId) {
                return handleUseCaseError({
                    title: "Forbidden",
                    error: "Forbidden",
                    status: EStatusCodes.enum.forbidden
                });
            }

            const validate = validateData<CreateOrderDTO>(input, CreateOrderSchema);
            if (!validate.success) {
                return handleUseCaseError({
                    title: "Create Order",
                    error: validate.error,
                    status: EStatusCodes.enum.badRequest
                });
            }

            const data: Partial<TOrder> = {
                ...validate.data,
                status: "PENDING",
                userId: validate.data.userId || context.userId.toString(),
            };

            const createdOrder = await this.orderRepository.create(data);
            if (!createdOrder) {
                return handleUseCaseError({
                    title: "Create Order",
                    error: "Error creating order"
                });
            }

            return {
                data: createdOrder,
                success: true,
            };
        } catch (error) {
            return handleUseCaseError({
                title: "Create Order",
                status: EStatusCodes.enum.internalServerError
            });
        }
    }
}