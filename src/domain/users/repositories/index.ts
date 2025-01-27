import mongoose, { FilterQuery } from "mongoose";
import { IBaseRepository } from "../../../global/repository";
import { ID, IQueryFilters, IQueryResult } from "../../../global/entities";
import { TUser } from "../../../data/entities/user";
import { TAddress } from "../../../data/entities/address";

export interface IUserRepository extends IBaseRepository<TUser, IQueryResult<TUser> & {
    activeCount: number,
    suspendedCount: number
} | null> {
    findByEmail(email: string): Promise<TUser | null>;
    getPasswordHash(id: ID): Promise<string | null>;
    getAddress({ userId, custId }: { custId?: string, userId: string }): Promise<TAddress | null>
}

export abstract class UserRepository implements IUserRepository {
    abstract create(data: TUser): Promise<TUser | null>;
    abstract findById(id: ID): Promise<TUser | null>;
    abstract update(id: ID, data: Partial<TUser>): Promise<TUser | null>;
    abstract delete(id: ID): Promise<boolean>;
    abstract query(options?: IQueryFilters<TUser>): Promise<IQueryResult<TUser> & {
        activeCount: number,
        suspendedCount: number
    } | null>;
    abstract findByEmail(email: string): Promise<TUser | null>
    abstract count(filter?: FilterQuery<TUser> | undefined): Promise<number | null>
    abstract getPasswordHash(id: ID): Promise<string | null>
    abstract findOne(filter?: mongoose.RootFilterQuery<TUser>): Promise<TUser | null>
    abstract getAddress({ userId, custId }: { custId?: string, userId: string }): Promise<TAddress | null>
}