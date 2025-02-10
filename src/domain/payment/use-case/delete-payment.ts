import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/use-case";
import { EStatusCodes } from "../../../global/enum";
import { IPaymentRepository } from "../repository";

export class DeletePaymentUseCase implements BaseUseCase<string, boolean, AuthContext> {
    constructor(private readonly paymentRepository: IPaymentRepository) { }

    async execute(id: string, context: AuthContext): Promise<UseCaseResult<boolean>> {
        try {
            if (!context.userId) {
                return handleUseCaseError({ title: "Forbidden", error: "User not authenticated", status: EStatusCodes.enum.forbidden });
            }

            const payment = await this.paymentRepository.findOne({ id });
            if (!payment) {
                return handleUseCaseError({ title: "Delete Payment", error: "Payment not found", status: EStatusCodes.enum.notFound });
            }

            const deletedPayment = await this.paymentRepository.delete(id);
            if (!deletedPayment) {
                return handleUseCaseError({ title: "Delete Payment", error: "Error deleting payment", status: EStatusCodes.enum.internalServerError });
            }

            return {
                data: deletedPayment,
                success: true,
            };

        } catch (error) {
            return handleUseCaseError({ title: "Delete Payment", error: "Unexpected error occurred", status: EStatusCodes.enum.internalServerError });
        }
    }
}