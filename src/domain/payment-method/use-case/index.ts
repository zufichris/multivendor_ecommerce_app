import { IPaymentMethodRepository } from "../repository";
import { CreatePaymentMethodUseCase } from "./create-payment-method";
import { GetPaymentMethodUseCase } from "./get-payment-method";
import { QueryPaymentMethodUseCase } from "./query-payment-method";
import { UpdatePaymentMethodUseCase } from "./update-payment-method";
import { DeletePaymentMethodUseCase } from "./delete-payment-method"

export default class PaymentMethodUseCase {
    public readonly create: CreatePaymentMethodUseCase;
    public readonly get: GetPaymentMethodUseCase;
    public readonly query: QueryPaymentMethodUseCase;
    public readonly update: UpdatePaymentMethodUseCase;
    public readonly delete: DeletePaymentMethodUseCase;

    constructor(private readonly paymentMethodRepository: IPaymentMethodRepository) {
        this.create = new CreatePaymentMethodUseCase(this.paymentMethodRepository);
        this.get = new GetPaymentMethodUseCase(this.paymentMethodRepository);
        this.query = new QueryPaymentMethodUseCase(this.paymentMethodRepository);
        this.update = new UpdatePaymentMethodUseCase(this.paymentMethodRepository);
        this.delete = new DeletePaymentMethodUseCase(this.paymentMethodRepository);
    }
}
