import { CreateUserDTO, CreateUserSchema } from "../../../data/dto/user";
import { TUser} from "../../../data/entities/user";
import { BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/usecase";
import { IUserRepository } from "../repositories";
import {validateData } from "../../../utils/functions";
import { EStatusCodes } from "../../../global/enums";
import { Role } from "../../../data/enums/user";

export class CreateUserUseCase implements BaseUseCase<CreateUserDTO, TUser> {
  constructor(private readonly userRepository: IUserRepository) { }
  async execute(input: any, context?: void | undefined): Promise<UseCaseResult<TUser>> {
    try {
      const validate = validateData<CreateUserDTO>(input, CreateUserSchema)
      if (!validate.success)
        return handleUseCaseError({ error: validate.error, title: "Create User", status: EStatusCodes.enum.badRequest })
      const exists = await this.userRepository.findByEmail(validate.data.email)
      if (exists) {
        return handleUseCaseError({ error: "User With Credentials Already Exists", title: "Create User" })
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
        return handleUseCaseError({ error: "Error Creating User", title: "Create User" })
      }
      created.password = undefined
      return ({
        data: created,
        success: true
      })
    } catch (error) {
      return handleUseCaseError({ title: "Create User",status:500 })
    }
  }
}