import { CreateUserDTO } from "../../../data/dto/user";
import { TUser, UserSchema } from "../../../data/entities/user";
import { BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/useCase";
import { IUserRepository } from "../repositories";
import { validateData } from "../../../utils/functions";
import { EStatusCodes } from "../../../global/enums";

export class CreateUserUseCase implements BaseUseCase<CreateUserDTO, TUser> {
  constructor(private readonly userRepository: IUserRepository) { }
  async execute(input: CreateUserDTO, context?: void | undefined): Promise<UseCaseResult<TUser>> {
    try {
      const validate = validateData<CreateUserDTO>(input, UserSchema)
      if (!validate.success)
        return handleUseCaseError(validate.error, "Create User", EStatusCodes.enum.badRequest)
      const exists = await this.userRepository.findByEmail(validate.data?.email!)
      if (exists) {
        return handleUseCaseError("User With Credentials Already Exists", "Create User")
      }
      const data = await this.userRepository.create(validate.data!)
      if (!data) {
        return handleUseCaseError("Error Creating User", "Create User")
      }
      return ({
        data,
        success: true
      })
    } catch (error) {
      return handleUseCaseError(error, "Create User")
    }
  }
}