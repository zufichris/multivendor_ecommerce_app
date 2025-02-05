import { Request, Response, NextFunction } from "express";
import { ProductRepositoryImpl } from "../../../data/orm/repositoryImpl/product";
import { ProductModel } from "../../../data/orm/models/product";
import { CreateProductUseCase } from "../../../domain/products/usecases/CreateProduct";
import { QueryProductsUseCase } from "../../../domain/products/usecases/QueryProducts";
import { GetProductUseCase } from "../../../domain/products/usecases/GetProduct";
import { UpdateProductUseCase } from "../../../domain/products/usecases/UpdateProduct";
import { UpdateProductStatusUseCase } from "../../../domain/products/usecases/UpdateProductStatus";
import { DeleteProductUseCase } from "../../../domain/products/usecases/DeleteProduct";
import { validateData } from "../../../utils/functions";
import { EStatusCodes } from "../../../global/enums";
import { TProduct } from "../../../data/entities/product";
import { IQueryFilters, IResponseData, IResponseDataPaginated } from "../../../global/entities";
import { CreateProductDTO, UpdateProductDTO, CreateProductSchema, UpdateProductSchema } from "../../../data/dto/product";

export class ProductControllers {
    constructor(
        private readonly createUseCase: CreateProductUseCase,
        private readonly queryUseCase: QueryProductsUseCase,
        private readonly getUseCase: GetProductUseCase,
        private readonly updateUseCase: UpdateProductUseCase,
        private readonly updateStatusUseCase: UpdateProductStatusUseCase,
        private readonly deleteUseCase: DeleteProductUseCase
    ) {
        this.createProduct = this.createProduct.bind(this);
        this.getProduct = this.getProduct.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.queryProducts = this.queryProducts.bind(this);
        this.updateProductStatus = this.updateProductStatus.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
    }

    async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const validate = validateData<CreateProductDTO>(req.body, CreateProductSchema);
            if (!validate.success) {
                const data = {
                    ...this.generateMetadata(req, "Validation Failed"),
                    status: EStatusCodes.enum.badRequest,
                    success: false,
                    description: validate.error
                };
                res.status(data.status).json(data);
                return;
            }

            const result = await this.createUseCase.execute(validate.data, {
                userId: req.user?.id!,
                roles: req.user?.roles!
            });

            if (!result.success) {
                const data = {
                    ...this.generateMetadata(req, result.error),
                    status: EStatusCodes.enum.conflict,
                    success: false
                };
                res.status(data.status).json(data);
                return;
            }

            const data: IResponseData<TProduct> = {
                ...this.generateMetadata(req, "Product created successfully"),
                status: EStatusCodes.enum.created,
                success: true,
                data: result.data
            };
            res.status(data.status).json(data);
        } catch (error) {
            next(error);
        }
    }

    async getProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const productId = req.params.productId;
            if (!productId) {
                const data = {
                    ...this.generateMetadata(req, "Product ID is required"),
                    status: EStatusCodes.enum.badRequest,
                    success: false
                };
                res.status(data.status).json(data);
                return;
            }

            const result = await this.getUseCase.execute({ id: productId });

            if (!result.success) {
                const data = {
                    ...this.generateMetadata(req, result.error ?? "Product Not Found"),
                    status: EStatusCodes.enum.notFound,
                    success: false
                };
                res.status(data.status).json(data);
                return;
            }

            const data: IResponseData<TProduct> = {
                ...this.generateMetadata(req, "Product retrieved successfully"),
                status: EStatusCodes.enum.ok,
                success: true,
                data: result.data
            };
            res.status(data.status).json(data);
        } catch (error) {
            next(error);
        }
    }

    async queryProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const query = this.generateProductQuery(req.query);
            const result = await this.queryUseCase.execute(query);

            if (!result.success) {
                const data = {
                    ...this.generateMetadata(req, result.error ?? "Failed to retrieve products"),
                    status: EStatusCodes.enum.badGateway,
                    success: false
                };
                res.status(data.status).json(data);
                return;
            }

            const data: IResponseDataPaginated<TProduct> = {
                ...this.generateMetadata(req, "Products retrieved successfully"),
                ...result.data,
                status: EStatusCodes.enum.ok,
                success: true
            };
            res.status(data.status).json(data);
        } catch (error) {
            next(error);
        }
    }

    async updateProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const validate = validateData<UpdateProductDTO>(req.body, UpdateProductSchema);
            if (!validate.success) {
                const data = {
                    ...this.generateMetadata(req, "Validation Failed"),
                    status: EStatusCodes.enum.badRequest,
                    success: false,
                    details: validate.error
                };
                res.status(data.status).json(data);
                return;
            }

            const result = await this.updateUseCase.execute({
                data: req.body,
                id: req.body.id
            }, {
                userId: req.user?.id!,
                roles: req.user?.roles!
            });

            if (!result.success) {
                const data = {
                    ...this.generateMetadata(req, result.error ?? "Failed to update product"),
                    status: EStatusCodes.enum.conflict,
                    success: false
                };
                res.status(data.status).json(data);
                return;
            }

            const data: IResponseData<TProduct> = {
                ...this.generateMetadata(req, "Product updated successfully"),
                status: EStatusCodes.enum.ok,
                success: true,
                data: result.data
            };
            res.status(data.status).json(data);
        } catch (error) {
            next(error);
        }
    }

    async updateProductStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const productId = req.params.productId;
            const status = req.body.status;

            const result = await this.updateStatusUseCase.execute({ id: productId, status });

            if (!result.success) {
                const data = {
                    ...this.generateMetadata(req, result.error ?? "Failed to change product status"),
                    status: result.status ?? EStatusCodes.enum.badGateway,
                    success: false
                };
                res.status(data.status).json(data);
                return;
            }

            const data: IResponseData<TProduct> = {
                ...this.generateMetadata(req, "Product status updated successfully"),
                status: EStatusCodes.enum.ok,
                success: true,
                data: result.data
            };
            res.status(data.status).json(data);
        } catch (error) {
            next(error);
        }
    }

    async deleteProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const productId = req.params.productId;
            const result = await this.deleteUseCase.execute({ id: productId }, { userId: req?.user?.id!, roles: req?.user?.roles! });

            if (!result.success) {
                const data = {
                    ...this.generateMetadata(req, result.error ?? "Failed to delete product"),
                    status: EStatusCodes.enum.conflict,
                    success: false
                };
                res.status(data.status).json(data);
                return;
            }

            const data = {
                ...this.generateMetadata(req, "Product deleted successfully"),
                status: EStatusCodes.enum.ok,
                success: true
            };
            res.status(data.status).json(data);
        } catch (error) {
            next(error);
        }
    }

    private generateMetadata(req: Request, message: string, type?: string) {
        return {
            url: req.url,
            path: req.path,
            type: type ?? "Product",
            message,
            error: { message }
        };
    }
    private generateProductQuery(query: qs.ParsedQs) {
        let {
            page = 1,
            limit = 10,
            sort_order = "asc",
            sort_by = "createdAt"
        } =
            query;

        const sortByStr = String(sort_by);
        const sortOrderStr = String(sort_order);
        const sort = { [sortByStr]: sortOrderStr === 'desc' ? -1 : 1 }
        const searchTerm = typeof query.search === 'string' ? query.search : '';
        const search = searchTerm ? {
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
            ]
        } : undefined;
        const filter = search ?? {
        }

        const queryOptions = {
            sort
        }
        const projection = {
            id: true,
            defaultCurrency: true,
            inventory: true,
            isBestSeller: true,
            isFeatured: true,
            defaultPrice: true,
            isLimitedEdition: true,
            reviewCount: true,
            mainImage: true,
            name: true,
            isPromoted: true,
            isNewProduct: true,
            slug: true,
            sku: true,
            updatedAt: true,
            createdAt: true,
        }

        const options: IQueryFilters<TProduct> = {
            filter,
            limit: Number(limit ?? 20),
            page: Number(page ?? 1),
            projection,
            queryOptions
        }
        return options
    }
}

const productRepository = new ProductRepositoryImpl(ProductModel);
export const productControllers = new ProductControllers(
    new CreateProductUseCase(productRepository),
    new QueryProductsUseCase(productRepository),
    new GetProductUseCase(productRepository),
    new UpdateProductUseCase(productRepository),
    new UpdateProductStatusUseCase(productRepository),
    new DeleteProductUseCase(productRepository)
);
