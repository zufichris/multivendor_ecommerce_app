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
                    title: "Authentication Required",
                    error: "User not authenticated.",
                    status: EStatusCodes.enum.unauthorized
                });
            }

            const validate = validateData<CreateOrderDTO>(input, CreateOrderSchema);
            if (!validate.success) {
                return handleUseCaseError({
                    title: "Invalid Input",
                    error: `Validation failed: ${validate.error}`,
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
                    title: "Order Creation Failed",
                    error: "Failed to create order in the database.",
                    status: EStatusCodes.enum.internalServerError
                });
            }

            return {
                data: createdOrder,
                success: true,
            };
        } catch (error: any) {
            return handleUseCaseError({
                title: "Unexpected Error",
                error: `An unexpected error occurred: ${error.message || error}`,
                status: EStatusCodes.enum.internalServerError
            });
        }
    }
}