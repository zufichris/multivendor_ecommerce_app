import { TPaymentMethod } from "../../../data/entity/payment-method";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/use-case";
import { validateData } from "../../../util/functions";
import { EStatusCodes } from "../../../global/enum";
import { UpdatePaymentMethodDTO, UpdatePaymentMethodSchema } from "../../../data/dto/payment-method";
import { IPaymentMethodRepository } from "../repository";

export class UpdatePaymentMethodUseCase implements BaseUseCase<UpdatePaymentMethodDTO, TPaymentMethod, AuthContext> {
    constructor(private readonly paymentMethodRepository: IPaymentMethodRepository) { }

    async execute(input: UpdatePaymentMethodDTO, context: AuthContext): Promise<UseCaseResult<TPaymentMethod>> {
        try {
            if (!context.userId) {
                return handleUseCaseError({
                    title: "Forbidden",
                    error: "Forbidden",
                    status: EStatusCodes.enum.forbidden,
                });
            }

            const validate = validateData<UpdatePaymentMethodDTO>(input, UpdatePaymentMethodSchema);
            if (!validate.success) {
                return handleUseCaseError({
                    error: validate.error,
                    title: "Update Payment Method",
                    status: EStatusCodes.enum.badRequest
                });
            }

            const existingPaymentMethod = await this.paymentMethodRepository.findOne({ id: validate.data.pmtId! });
            if (!existingPaymentMethod) {
                return handleUseCaseError({
                    error: "Payment method not found",
                    title: "Update Payment Method",
                    status: EStatusCodes.enum.notFound
                });
            }

            const updatedPaymentMethod = await this.paymentMethodRepository.update(existingPaymentMethod.id!, validate.data);
            if (!updatedPaymentMethod) {
                return handleUseCaseError({
                    error: "Error updating payment method",
                    title: "Update Payment Method"
                });
            }

            return {
                data: updatedPaymentMethod,
                success: true,
            };
        } catch (error) {
            return handleUseCaseError({ title: "Update Payment Method", status: 500 });
        }
    }
}