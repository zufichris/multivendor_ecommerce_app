import { EProductStatus, TProduct } from "../../../data/entity/product";
import { EStatusCodes } from "../../../global/enum";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/use-case";
import { isVendor } from "../../../util/functions";
import { IProductRepository } from "../repository";

export class UpdateProductStatusUseCase implements BaseUseCase<{ id: string; status: string }, TProduct | null, AuthContext> {
    constructor(private readonly productRepository: IProductRepository) { }
    async execute(input: { id: string; status: typeof EProductStatus._type }, context?: AuthContext): Promise<UseCaseResult<TProduct>> {
        try {
            if (!isVendor(context?.roles)) {
                return handleUseCaseError({ error: "Unauthorized to update product status.", title: "Update Product Status", status: EStatusCodes.enum.forbidden });
            }

            const { id, status } = input;
            const updatedProduct = await this.productRepository.update(id, { status });
            if (!updatedProduct) {
                return handleUseCaseError({ error: `Product with id ${id} not found.`, title: "Update Product Status", status: EStatusCodes.enum.notFound });
            }

            return {
                success: true,
                data: updatedProduct,
            };
        } catch (error) {
            console.error("Error updating product status:", error);
            return handleUseCaseError({ title: "Update Product Status", error: "Failed to update product status.", status: EStatusCodes.enum.internalServerError });
        }
    }
}