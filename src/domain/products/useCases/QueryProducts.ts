import { TProduct } from "../../../data/entities/product";
import { IQueryFilters, IQueryResult } from "../../../global/entities";
import { EStatusCodes } from "../../../global/enums";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/useCase";
import { isVendor } from "../../../utils/functions";
import { IProductRepository } from "../repository";

export class QueryProductsUseCase implements BaseUseCase<IQueryFilters<TProduct>, IQueryResult<TProduct>, AuthContext> {
    constructor(private readonly productRepository: IProductRepository) { }

    async execute(input: IQueryFilters<TProduct>, context?: AuthContext): Promise<UseCaseResult<IQueryResult<TProduct>>> {
        try {
            const limit = input.limit ?? 10;
            const page = input.page ?? 1;
            input.limit = limit;
            input.page = page;

            if (!isVendor(context?.roles)) {
                return handleUseCaseError({ error: "Unauthorized", title: "Query Products", status: EStatusCodes.enum.forbidden });
            }

            const result = await this.productRepository.query(input);
            if (!result) {
                return handleUseCaseError({ title: "Query Products" });
            }

            return {
                success: true,
                data: result,
            };
        } catch (error) {
            return handleUseCaseError({ title: "Query Products" });
        }
    }
}
