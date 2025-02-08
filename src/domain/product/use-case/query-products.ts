import { TProduct } from "../../../data/entity/product";
import { IQueryFilters, IQueryResult } from "../../../global/entity";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/use-case";
import { IProductRepository } from "../repository";

export class QueryProductsUseCase implements BaseUseCase<IQueryFilters<TProduct>, IQueryResult<TProduct>, AuthContext> {
    constructor(private readonly productRepository: IProductRepository) { }

    async execute(input: IQueryFilters<TProduct>): Promise<UseCaseResult<IQueryResult<TProduct>>> {
        try {
            const limit = input.limit ?? 10;
            const page = input.page ?? 1;
            input.limit = limit;
            input.page = page;

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
