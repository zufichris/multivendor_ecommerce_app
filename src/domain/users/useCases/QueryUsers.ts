import { TUser } from "../../../data/entities/user";
import { Role } from "../../../data/enums/user";
import { IQueryFilters, IQueryResult } from "../../../global/entities";
import { EStatusCodes } from "../../../global/enums";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/useCase";
import { IUserRepository } from "../repositories";

export class QueryUsersUseCase implements BaseUseCase<IQueryFilters<TUser>, IQueryResult<TUser>, AuthContext> {
  constructor(private readonly userRepository: IUserRepository) { }
  async execute(input: IQueryFilters<TUser>, context?: AuthContext): Promise<UseCaseResult<IQueryResult<TUser>>> {
    try {
      const limit = input.limit ?? 10
      const page = input.page ?? 1
      input.limit = limit;
      input.page = page
      if (!context?.userId || (context?.roles.includes(Role.Admin))) {
        return handleUseCaseError("Unauthorized", "Query Users", EStatusCodes.enum.forbidden)
      }
      const data = await this.userRepository.query(input)
      if (!data) {
        return handleUseCaseError("Error Getting Users", "Query Users")
      }
      return ({
        success: true,
        data: data
      })
    } catch (error) {
      return handleUseCaseError(error, "Query Users")
    }
  }
}