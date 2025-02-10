import { IOrderRepository } from "../repository";
import { CreateOrderUseCase } from "./create-order";
import { GetOrderUseCase } from "./get-order";
import { QueryOrdersUseCase } from "./query-orders";
import { UpdateOrderUseCase } from "./update-order";
import { CancelOrderUseCase } from "./cancel-order"

export default class OrderUseCase {
    public readonly create: CreateOrderUseCase;
    public readonly get: GetOrderUseCase;
    public readonly query: QueryOrdersUseCase;
    public readonly update: UpdateOrderUseCase;
    public readonly cancel: CancelOrderUseCase;

    constructor(private readonly orderRepository: IOrderRepository) {
        this.create = new CreateOrderUseCase(this.orderRepository);
        this.get = new GetOrderUseCase(this.orderRepository);
        this.query = new QueryOrdersUseCase(this.orderRepository);
        this.update = new UpdateOrderUseCase(this.orderRepository);
        this.cancel = new CancelOrderUseCase(this.orderRepository);
    }
}
