import { TProduct } from "../../../data/entities/product";
import { EStatusCodes } from "../../../global/enums";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/useCase";
import { isVendor } from "../../../utils/functions";
import { IProductRepository } from "../repository";

export class CreateProductUseCase implements BaseUseCase<Partial<TProduct>, TProduct, AuthContext> {
    constructor(private readonly productRepository: IProductRepository) { }

    async execute(input: Partial<TProduct>, context?: AuthContext): Promise<UseCaseResult<TProduct>> {
        try {
            if (!isVendor(context?.roles)) {
                return handleUseCaseError({ error: "Unauthorized", title: "Create Product", status: EStatusCodes.enum.forbidden });
            }

            const newProduct = await this.productRepository.create(input);
            if (!newProduct) {
                return handleUseCaseError({ error: "Failed to create product", title: "Create Product", status: EStatusCodes.enum.internalServerError });
            }

            return {
                success: true,
                data: newProduct,
            };
        } catch (error) {
            return handleUseCaseError({ title: "Create Product" });
        }
    }
}
