import { FilterQuery, ProjectionType } from "mongoose";
import { UserRepository } from "../../../../domain/users/repositories";
import { ID, IQueryFilters, IQueryResult } from "../../../../global/entities";
import { toArray } from "../../../../utils/functions";
import { UserModel } from "../../models/user";
import { logger } from "../../../../utils/logger";
import { TUser } from "../../../entities/user";

export class UserRepositoryImpl implements UserRepository {
    constructor(private readonly model: typeof UserModel) { }

    async create(data: TUser): Promise<TUser | null> {
        try {
            if (!data.email) {
                throw new Error("Email and password are required");
            }
            const newUser = await this.model.create(data);
            return newUser;
        } catch (error: unknown) {
            logger.error("Error creating user", { error, data });
            return null;
        }
    }

    async findById(id: ID): Promise<TUser | null> {
        try {
            const user = await this.model.findById(id).select("-password");
            return user;
        } catch (error: unknown) {
            logger.error("Error Getting User by ID", { error, id });
            return null;
        }
    }

    async findByEmail(email: string): Promise<TUser | null> {
        try {
            const user = await this.model.findOne({ email }).select("-password");
            return user ? user : null;
        } catch (error: unknown) {
            logger.error("Error Getting User by Email", { error, email });
            return null;
        }
    }

    async count(filter?: FilterQuery<TUser>): Promise<number> {
        try {
            const count = await this.model.countDocuments(filter);
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
            const updatedUser = await this.model.findByIdAndUpdate(id, data, { new: true });
            return updatedUser;
        } catch (error) {
            logger.error("Error Updating User", { error, id, data });
            return null;
        }
    }

    async delete(id: ID): Promise<boolean> {
        try {
            const result = await this.model.findByIdAndDelete(id);
            return result !== null;
        } catch (error) {
            logger.error("Error Deleting User", { error, id });
            return false;
        }
    }

    async query(options?: IQueryFilters<TUser>): Promise<IQueryResult<TUser> | null> {
        try {
            const limit = options?.limit ?? 10;
            const page = options?.page ?? 1;
            const skip = (page - 1) * limit;
            const projection: ProjectionType<TUser> = options?.projection ?? { password: 0 };

            const [users, totalCount, filterCount] = await Promise.all([
                this.model.find(options?.filter ?? {}, projection, {
                    ...options?.queryOptions,
                    limit,
                    skip
                }),
                this.model.countDocuments(),
                this.model.countDocuments(options?.filter),
            ]);

            const data = toArray<TUser>(users);
            return {
                data,
                filterCount: filterCount ?? 0,
                limit,
                page,
                totalCount: totalCount ?? 0,
            };
        } catch (error) {
            logger.error("Error Querying Users", { error, options });
            return null;
        }
    }
}
