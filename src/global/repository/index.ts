import mongoose from "mongoose";
import { ID, IQueryFilters, IQueryResult } from "../entities";

export interface IBaseRepository<TData> {
  create(data: Partial<TData>): Promise<TData | null>;
  update(id: ID, data: Partial<TData>): Promise<TData | null>;
  delete(id: ID): Promise<boolean>;
  findById(id: ID): Promise<TData | null>;
  query(options?: IQueryFilters<TData>): Promise<IQueryResult<TData> | null>;
  count(filter?: mongoose.FilterQuery<TData>): Promise<number | null>;
}
