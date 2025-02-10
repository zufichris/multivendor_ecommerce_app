import { TPaymentMethod } from "../../../data/entity/payment-method";
import { BaseUseCase, UseCaseResult, handleUseCaseError, AuthContext } from "../../../global/use-case";
import { IPaymentMethodRepository } from "../repository";
import { EStatusCodes } from "../../../global/enum";

export interface GetPaymentMethodInput {
    paymentMethodId: string;
}

export class GetPaymentMethodUseCase implements BaseUseCase<GetPaymentMethodInput, TPaymentMethod, AuthContext> {
    constructor(private readonly paymentMethodRepository: IPaymentMethodRepository) { }

    async execute(input: GetPaymentMethodInput, context?: AuthContext): Promise<UseCaseResult<TPaymentMethod>> {
        try {
            if (!context?.userId) {
                return handleUseCaseError({
                    error: "Unauthorized access: User authentication is required to retrieve payment method details.",
                    title: "Get Payment Method",
                    status: EStatusCodes.enum.forbidden,
                });
            }

            if (!input.paymentMethodId) {
                return handleUseCaseError({
                    error: "Invalid request: A paymentMethodId must be provided.",
                    title: "Get Payment Method",
                    status: EStatusCodes.enum.badRequest,
                });
            }

            const paymentMethod = await this.paymentMethodRepository.findById(input.paymentMethodId);

            if (!paymentMethod) {
                return handleUseCaseError({
                    error: "Payment method record not found for the provided identifier.",
                    title: "Get Payment Method",
                    status: EStatusCodes.enum.notFound,
                });
            }

            return {
                success: true,
                data: paymentMethod,
            };
        } catch (error) {
            return handleUseCaseError({
                error: "An unexpected error occurred while retrieving the payment method record.",
                title: "Get Payment Method",
                status: EStatusCodes.enum.internalServerError,
            });
        }
    }
}