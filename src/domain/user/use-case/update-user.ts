import { TUser } from "../../../data/entity/user";
import { UpdateUserDTO, UpdateUserSchema } from "../../../data/dto/user";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/use-case";
import { IUserRepository } from "../repository";
import { validateData } from "../../../util/functions";
import { EStatusCodes } from "../../../global/enum";
import { Role } from "../../../data/enum/user";

export class UpdateUserUseCase implements BaseUseCase<UpdateUserDTO, TUser, AuthContext> {
    constructor(private readonly userRepository: IUserRepository) { }

    async execute(input: UpdateUserDTO, context: AuthContext): Promise<UseCaseResult<TUser>> {
        try {
            if (!context?.userId || (context?.roles.includes(Role.Admin))) {
                return handleUseCaseError({ error: "Unauthorized", title: "Update User", status: EStatusCodes.enum.forbidden })
            }
            const validate = validateData<UpdateUserDTO>(input, UpdateUserSchema);
            if (!validate.success) {
                return handleUseCaseError({ error: validate.error, title: "Update User", status: EStatusCodes.enum.badRequest });
            }
            const data = await this.userRepository.update(input.userId, validate.data);
            if (!data) {
                return handleUseCaseError({ error: "Error Updating User", title: "Update User" });
            }

            return {
                success: true,
                data,
            };
        } catch (error) {
            return handleUseCaseError({ title: "Update User" });
        }
    }
}
