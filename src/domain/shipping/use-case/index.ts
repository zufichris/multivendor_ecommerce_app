import { IShippingRepository } from "../repository";
import { CreateShippingUseCase } from "./create-shipping";
import { GetShippingUseCase } from "./get-shipping";
import { QueryShippingsUseCase } from "./query-shipping";
import { UpdateShippingUseCase } from "./update-shipping";
import { DeleteShippingUseCase } from "./delete-shipping";

export default class ShippingUseCase {
    public readonly create: CreateShippingUseCase;
    public readonly get: GetShippingUseCase;
    public readonly query: QueryShippingsUseCase;
    public readonly update: UpdateShippingUseCase;
    public readonly delete: DeleteShippingUseCase;

    constructor(private readonly shippingRepository: IShippingRepository) {
        this.create = new CreateShippingUseCase(this.shippingRepository);
        this.get = new GetShippingUseCase(this.shippingRepository);
        this.query = new QueryShippingsUseCase(this.shippingRepository);
        this.update = new UpdateShippingUseCase(this.shippingRepository);
        this.delete = new DeleteShippingUseCase(this.shippingRepository);
    }
}