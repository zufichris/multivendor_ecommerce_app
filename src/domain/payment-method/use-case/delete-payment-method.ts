import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/use-case";
import { EStatusCodes } from "../../../global/enum";
import { IPaymentMethodRepository } from "../repository";

export class DeletePaymentMethodUseCase implements BaseUseCase<string, boolean, AuthContext> {
    constructor(private readonly paymentMethodRepository: IPaymentMethodRepository) { }

    async execute(id: string, context: AuthContext): Promise<UseCaseResult<boolean>> {
        try {
            if (!context.userId) {
                return handleUseCaseError({ title: "Forbidden", error: "Forbidden", status: EStatusCodes.enum.forbidden });
            }

            const paymentMethod = await this.paymentMethodRepository.findOne({
                id
            });
            if (!paymentMethod) {
                return handleUseCaseError({
                    error: "Payment method not found",
                    title: "Delete Payment Method",
                    status: EStatusCodes.enum.notFound,
                });
            }

            const deletedPaymentMethod = await this.paymentMethodRepository.delete(id);
            if (!deletedPaymentMethod) {
                return handleUseCaseError({
                    error: "Error deleting payment method",
                    title: "Delete Payment Method",
                });
            }

            return {
                success: true,
                data: deletedPaymentMethod,
            };
        } catch (error) {
            return handleUseCaseError({ title: "Delete Payment Method", status: 500 });
        }
    }
}