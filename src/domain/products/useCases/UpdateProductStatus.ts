import { EProductStatus, TProduct } from "../../../data/entities/product";
import { EStatusCodes } from "../../../global/enums";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/useCase";
import { isVendor } from "../../../utils/functions";
import { IProductRepository } from "../repository";

export class UpdateProductStatusUseCase implements BaseUseCase<{ id: string; status: string }, TProduct | null, AuthContext> {
    constructor(private readonly productRepository: IProductRepository) { }
    async execute(input: { id: string; status: typeof EProductStatus._type }, context?: AuthContext): Promise<UseCaseResult<TProduct | null>> {
        try {
            if (!isVendor(context?.roles)) {
                return handleUseCaseError({ error: "Unauthorized", title: "Update Product Status", status: EStatusCodes.enum.forbidden });
            }

            const { id, status } = input;
            const updatedProduct = await this.productRepository.update(id, { status });
            if (!updatedProduct) {
                return handleUseCaseError({ error: "Product Not Found", title: "Update Product Status", status: EStatusCodes.enum.notFound });
            }

            return {
                success: true,
                data: updatedProduct,
            };
        } catch (error) {
            return handleUseCaseError({ title: "Update Product Status" });
        }
    }
}
