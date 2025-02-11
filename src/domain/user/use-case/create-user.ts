import { CreateUserDTO, CreateUserSchema } from "../../../data/dto/user";
import { TUser } from "../../../data/entity/user";
import { BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/use-case";
import { IUserRepository } from "../repository";
import { validateData } from "../../../util/functions";
import { EStatusCodes } from "../../../global/enum";
import { Role } from "../../../data/enum/user";

export class CreateUserUseCase implements BaseUseCase<CreateUserDTO, TUser> {
  constructor(private readonly userRepository: IUserRepository) { }
  async execute(input: any, context?: void | undefined): Promise<UseCaseResult<TUser>> {
    try {
      const validate = validateData<CreateUserDTO>(input, CreateUserSchema)
      if (!validate.success)
        return handleUseCaseError({ error: validate.error, title: "Create User - Validation Error", status: EStatusCodes.enum.badRequest })
      const exists = await this.userRepository.findByEmail(validate.data.email)
      if (exists) {
        return handleUseCaseError({ error: "A user with this email address already exists.", title: "Create User - Duplicate Email", status: EStatusCodes.enum.conflict })
      }
      const data = {
        ...validate.data,
        isActive: true,
        isEmailVerified: validate.data.isEmailVerified || false,
        firstName: validate.data.firstName ?? validate.data?.email.split("@")[0],
        roles: [Role.User],
        oauth: validate.data.oauth || null,
      }
      const created = await this.userRepository.create(data)
      if (!created) {
        return handleUseCaseError({ error: "Failed to create user in the database.", title: "Create User - Database Error", status: EStatusCodes.enum.internalServerError })
      }
      created.password = undefined
      return ({
        data: created,
        success: true
      })
    } catch (error: any) {
      return handleUseCaseError({ error: "An unexpected error occurred during user creation.", title: "Create User - Unexpected Error", status: EStatusCodes.enum.internalServerError })
    }
  }
}