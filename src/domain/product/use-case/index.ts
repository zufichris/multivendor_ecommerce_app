import { IProductRepository } from "../repository";
import { CreateProductUseCase } from "./create-product";
import { DeleteProductUseCase } from "./delete-product";
import { GetProductUseCase } from "./get-product";
import { QueryProductsUseCase } from "./query-products";
import { UpdateProductUseCase } from "./update-product";
import { UpdateProductStatusUseCase } from "./update-product-status";

export default class ProductUseCase {
    public readonly create: CreateProductUseCase
    public readonly query: QueryProductsUseCase
    public readonly get: GetProductUseCase
    public readonly update: UpdateProductUseCase
    public readonly updateStatus: UpdateProductStatusUseCase
    public readonly delete: DeleteProductUseCase
    constructor(private readonly productRepository: IProductRepository) {
        this.create = new CreateProductUseCase(productRepository)
        this.query = new QueryProductsUseCase(productRepository)
        this.get = new GetProductUseCase(productRepository)
        this.update = new UpdateProductUseCase(productRepository)
        this.updateStatus = new UpdateProductStatusUseCase(productRepository)
        this.delete = new DeleteProductUseCase(productRepository)
    }
}