import { UserRepository } from "../../../../domain/users/repositories";
import { ID, IQueryFilters, IQueryResult } from "../../../../global/entities";
import { getQueryMetaData, toArray } from "../../../../utils/functions";
import { UserDocument, UserModel } from "../../models/user";
import { logger } from "../../../../utils/logger";
import { TUser } from "../../../entities/user";
import mongoose from "mongoose";
import { AddressDocument, AddressModel } from "../../models/address";
import { TAddress } from "../../../entities/address";

export class UserRepositoryImpl implements UserRepository {
    constructor(private readonly userModel: typeof UserModel, private readonly addressModel: typeof AddressModel) {
        this.count = this.count.bind(this)
    }

    async create(data: Partial<TUser>): Promise<TUser | null> {
        try {

            if (!data.email) {
                throw new Error("Email and password are required");
            }
            const newUser: UserDocument = await this.userModel.create(data);
            return newUser.toJSON() as TUser | null
        } catch (error) {
            logger.error("Error creating user", { error, data });
            return null;
        }
    }
    async getPasswordHash(id: ID): Promise<string | null> {
        try {
            const user = await this.userModel.findById(id).select("password");
            return user?.password ?? null;
        } catch (error) {
            logger.error("Error Getting User Password", { error, id });
            return null;
        }
    }
    async findById(id: ID): Promise<TUser | null> {
        try {
            const user: UserDocument = await this.userModel.findById(id).select("-password");
            return user.toJSON() as TUser | null;
        } catch (error: unknown) {
            logger.error("Error Getting User by ID", { error, id });
            return null;
        }
    }
    async findOne(filter?: mongoose.RootFilterQuery<TUser>): Promise<TUser | null> {
        try {
            const user = await this.userModel.findOne(filter)
            return user?.toJSON() as TUser
        } catch (error) {
            logger.error("Error Getting User by Email", { error });
            return null
        }
    }

    async findByEmail(email: string): Promise<TUser | null> {
        try {
            const user: UserDocument = await this.userModel.findOne({ email }).select("-password");
            return user.toJSON() as TUser | null;
        } catch (error: unknown) {
            logger.error("Error Getting User by Email", { error, email });
            return null;
        }
    }

    async count(filter?: mongoose.FilterQuery<TUser>): Promise<number> {
        try {
            const count = await this.userModel.countDocuments(filter);
            return count;
        } catch (error) {
            logger.error("Error Counting Users", { error, filter });
            return 0;
        }
    }

    async update(id: ID, data: Partial<TUser>): Promise<TUser | null> {
        try {
            if (Object.keys(data).length === 0) {
                throw new Error("No data provided to update");
            }
            const updatedUser: UserDocument | null = await this.userModel.findByIdAndUpdate(id, data, { new: true });
            return updatedUser?.toJSON() as TUser | null;
        } catch (error) {
            logger.error("Error Updating User", { error, id, data });
            return null;
        }
    }

    async delete(id: ID): Promise<boolean> {
        try {
            const result = await this.userModel.findByIdAndDelete(id);
            return result !== null;
        } catch (error) {
            logger.error("Error Deleting User", { error, id });
            return false;
        }
    }

    async query(options?: IQueryFilters<TUser>): Promise<IQueryResult<TUser> & {
        activeCount: number,
        suspendedCount: number
    } | null> {
        try {
            const limit = options?.limit ?? 10;
            const page = options?.page ?? 1;
            const skip = (page - 1) * limit;

            const [data = [], totalCount = 0, filterCount = 0, activeCount = 0] =

                await Promise.all([
                    this.userModel.find(options?.filter ?? {}, options!.projection, {
                        ...options?.queryOptions,
                        limit,
                        skip
                    }),
                    this.count(),
                    this.count(options?.filter),
                    this.count({ isActive: true })
                ]);

            const users = toArray<UserDocument>(data).map(user => user.toJSON() as TUser) ?? []
            const suspendedCount = totalCount - activeCount;
            const metadata = getQueryMetaData({
                totalCount,
                page,
                limit,
                filterCount
            })

            return {
                data: users,
                suspendedCount,
                activeCount,
                ...metadata,
            };
        } catch (error) {
            logger.error("Error Querying Users", { error, options });
            throw error
        }
    }
    async getAddress({ userId, custId }: { custId?: string, userId: string }): Promise<TAddress | null> {
        try {
            if (!userId && !custId)
                throw new Error("Invalid User Id")
            let address: AddressDocument | null
            if (userId) {
                address = await this.addressModel.findOne({ userId })
            } else {
                address = await this.addressModel.findOne({ custId })
            }
            return address as TAddress
        } catch (error) {
            logger.error("Error Getting Address", { error });
            throw error
        }
    }
}
