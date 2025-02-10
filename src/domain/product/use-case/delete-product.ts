import { EStatusCodes } from "../../../global/enum";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/use-case";
import { IProductRepository } from "../repository";

export class DeleteProductUseCase implements BaseUseCase<{ id: string }, boolean, AuthContext> {
    constructor(private readonly productRepository: IProductRepository) { }

    async execute(input: { id: string }, context?: AuthContext): Promise<UseCaseResult<boolean>> {
        try {
            if (!context?.userId) {
                return handleUseCaseError({ error: "Unauthorized", title: "Delete Product", status: EStatusCodes.enum.forbidden });
            }

            const { id } = input;
            const success = await this.productRepository.delete(id);
            if (!success) {
                return handleUseCaseError({ error: "Product Not Found", title: "Delete Product", status: EStatusCodes.enum.notFound });
            }

            return {
                success: true,
                data: true,
            };
        } catch (error) {
            return handleUseCaseError({ title: "Delete Product" });
        }
    }
}
