import { Document, FilterQuery, Model, ProjectionType, QueryOptions, Types } from "mongoose";
import { IBaseRepository } from "../../../global/repository";
import { ID, IQueryFilters, IQueryResult } from "../../../global/entities";
import { TUser } from "../../../data/entities/user";

export interface IUserRepository extends IBaseRepository<TUser> {
    findByEmail(email: string): Promise<TUser | null>;
}

export abstract class UserRepository implements IUserRepository {
    abstract create(data: TUser): Promise<TUser | null>;
    abstract findById(id: ID): Promise<TUser | null>;
    abstract update(id: ID, data: Partial<TUser>): Promise<TUser | null>;
    abstract delete(id: ID): Promise<boolean>;
    abstract query(options?: IQueryFilters<TUser>): Promise<IQueryResult<TUser> | null>;
    abstract findByEmail(email: string): Promise<TUser | null>
    abstract count(filter?: FilterQuery<TUser> | undefined): Promise<number | null>
}