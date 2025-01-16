import { IUser } from "../../data/entities/user";
import { UserRepositoryImpl } from "../../data/orm/repository/UserRepositoryImpl";
import { IResponseDataPaginated } from "../../global/entities";
import { StatusCodes } from "../../global/enums";
import { AppError } from "../../global/error";
import { BaseUseCase } from "../../global/usecase";
import { toArray } from "../../utils/functions";

export class QueryUsers
  implements BaseUseCase<Partial<IUser>, IResponseDataPaginated<IUser>>
{
  constructor(private readonly userRepositoryImpl: UserRepositoryImpl) {}
  async execute(
    query: Partial<IUser>,
    options?: { limit?: number; page?: number }
  ): Promise<IResponseDataPaginated<IUser>> {
    try {
      const limit = isNaN(Number(options?.limit)) ? 5 : Number(options?.limit);
      const page = isNaN(Number(options?.page!)) ? 1 : Number(options?.page);

      const skip = (page - 1) * limit;
      const users = await this.userRepositoryImpl.query(query, undefined, {
        limit,
        skip,
      });

      const filterCount = await this.userRepositoryImpl.count(query);
      const totalCount = await this.userRepositoryImpl.count(query);

      return {
        data: toArray<Omit<IUser, "password">>(users),
        filterCount,
        totalCount,
        limit,
        message: "Success",
        page,
        status: StatusCodes.ok,
      };
    } catch (error) {
      throw new AppError({
        message: "Error Getting Users",
      });
    }
  }
}
