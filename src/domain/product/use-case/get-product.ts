import { TProduct } from "../../../data/entity/product";
import { EStatusCodes } from "../../../global/enum";
import { BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/use-case";
import { IProductRepository } from "../repository";

export class GetProductUseCase implements BaseUseCase<{ id?: string, slug?: string }, TProduct> {
    constructor(private readonly productRepository: IProductRepository) { }
    async execute({ id, slug }: { id?: string; slug?: string; }): Promise<UseCaseResult<TProduct>> {
        try {
            if (!slug || !id) {
                return handleUseCaseError({ title: "invalid ID", status: EStatusCodes.enum.badRequest })
            }

            let product;
            if (id) {
                product = await this.productRepository.findById(id);
            } else if (slug) {
                product = await this.productRepository.findOne({ slug })
            }
            if (!product) {
                return handleUseCaseError({ error: "Product not found", title: "Get Product", status: EStatusCodes.enum.notFound });
            }

            return { data: product, success: true };
        } catch (error) {
            return handleUseCaseError({ title: "Get Product", status: 500 });
        }
    }
}