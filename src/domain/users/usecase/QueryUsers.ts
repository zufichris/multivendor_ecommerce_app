import { TUser } from "../../../data/entities/user";
import { Role } from "../../../data/enums/user";
import { IQueryFilters, IQueryResult } from "../../../global/entities";
import { EStatusCodes } from "../../../global/enums";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/usecase";
import { IUserRepository } from "../repositories";

export class QueryUsersUseCase implements BaseUseCase<IQueryFilters<TUser>, IQueryResult<TUser> & {
  activeCount: number,
  suspendedCount: number,
}, AuthContext> {
  constructor(private readonly userRepository: IUserRepository) { }
  async execute(input: IQueryFilters<TUser>, context?: AuthContext): Promise<UseCaseResult<IQueryResult<TUser> & {
    activeCount: number,
    suspendedCount: number,
  }>> {
    try {
      const limit = input.limit ?? 10
      const page = input.page ?? 1
      input.limit = limit;
      input.page = page
      if (!context?.userId || !(context?.roles.includes(Role.Admin))) {
        return handleUseCaseError({ error: "Unauthorized", title: "Query Users", status: EStatusCodes.enum.forbidden })
      }
      const result = await this.userRepository.query(input)
      if (!result) {
        return handleUseCaseError({ title: "Query Users" })
      }
      return ({
        success: true,
        data: result
      })
    } catch (error) {
      return handleUseCaseError({ title: "Query Users" })
    }
  }
}