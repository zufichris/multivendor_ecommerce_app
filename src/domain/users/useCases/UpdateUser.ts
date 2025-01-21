import { TUser } from "../../../data/entities/user";
import { UpdateUserDTO, UpdateUserSchema } from "../../../data/dto/user";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/useCase";
import { IUserRepository } from "../repositories";
import { validateData } from "../../../utils/functions";
import { EStatusCodes } from "../../../global/enums";
import { Role } from "../../../data/enums/user";

export class UpdateUserUseCase implements BaseUseCase<UpdateUserDTO, TUser, AuthContext> {
    constructor(private readonly userRepository: IUserRepository) { }

    async execute(input: UpdateUserDTO, context: AuthContext): Promise<UseCaseResult<TUser>> {
        try {
            if (!context?.userId || (context?.roles.includes(Role.Admin))) {
                return handleUseCaseError("Unauthorized", "Update User", EStatusCodes.enum.forbidden)
            }
            const validate = validateData<UpdateUserDTO>(input, UpdateUserSchema);
            if (!validate.success) {
                return handleUseCaseError(validate.error, "Update User", EStatusCodes.enum.badRequest);
            }
            const data = await this.userRepository.update(input.userId!, validate.data!);
            if (!data) {
                return handleUseCaseError("Error Updating User", "Update User");
            }

            return {
                success: true,
                data,
            };
        } catch (error) {
            return handleUseCaseError(error, "Update User");
        }
    }
}
