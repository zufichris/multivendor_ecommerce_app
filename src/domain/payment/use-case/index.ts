import { IPaymentRepository } from "../repository";
import { CreatePaymentUseCase } from "./create-payment";
import { GetPaymentUseCase } from "./get-payment";
import { QueryPaymentUseCase } from "./query-payment";
import { UpdatePaymentUseCase } from "./update-payment";
import { DeletePaymentUseCase } from "./delete-payment";

export default class PaymentUseCase {
    public readonly create: CreatePaymentUseCase;
    public readonly get: GetPaymentUseCase;
    public readonly query: QueryPaymentUseCase;
    public readonly update: UpdatePaymentUseCase;
    public readonly delete: DeletePaymentUseCase;

    constructor(private readonly paymentRepository: IPaymentRepository) {
        this.create = new CreatePaymentUseCase(this.paymentRepository);
        this.get = new GetPaymentUseCase(this.paymentRepository);
        this.query = new QueryPaymentUseCase(this.paymentRepository);
        this.update = new UpdatePaymentUseCase(this.paymentRepository);
        this.delete = new DeletePaymentUseCase(this.paymentRepository);
    }
}