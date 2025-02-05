import { TProduct } from "../../../data/entities/product";
import { EStatusCodes } from "../../../global/enums";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/usecase";
import { isVendor } from "../../../utils/functions";
import { IProductRepository } from "../repository";

export class UpdateProductUseCase implements BaseUseCase<{ id: string; data: Partial<TProduct> }, TProduct | null, AuthContext> {
    constructor(private readonly productRepository: IProductRepository) { }

    async execute(input: { id: string; data: Partial<TProduct> }, context?: AuthContext): Promise<UseCaseResult<TProduct>> {
        try {
            if (!isVendor(context?.roles)) {
                return handleUseCaseError({ error: "Unauthorized", title: "Update Product", status: EStatusCodes.enum.forbidden });
            }

            const { id, data } = input;
            const updatedProduct = await this.productRepository.update(id, data);
            if (!updatedProduct) {
                return handleUseCaseError({ error: "Product Not Found", title: "Update Product", status: EStatusCodes.enum.notFound });
            }

            return {
                success: true,
                data: updatedProduct,
            };
        } catch (error) {
            return handleUseCaseError({ title: "Update Product" });
        }
    }
}
