import { FilterQuery, RootFilterQuery } from "mongoose";
import { TProduct } from "../../../data/entities/product";
import { ID, IQueryFilters, IQueryResult } from "../../../global/entities";
import { IBaseRepository } from "../../../global/repository";

export interface IProductRepository extends IBaseRepository<TProduct, IQueryResult<TProduct>> {

}
export abstract class ProductRepository implements IProductRepository {
    abstract create(data: Partial<TProduct>): Promise<TProduct | null>;
    abstract update(id: ID, data: Partial<TProduct>): Promise<TProduct | null>;
    abstract findById(id: ID): Promise<TProduct | null>;
    abstract findOne(filter?: RootFilterQuery<TProduct>): Promise<TProduct | null>;
    abstract delete(id: ID): Promise<boolean>;
    abstract count(filter?: FilterQuery<TProduct> | null): Promise<number | null>;
    abstract query(options?: IQueryFilters<TProduct>): Promise<IQueryResult<TProduct>>;
}
