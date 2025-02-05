import { TUser } from "../../../data/entities/user";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/usecase";
import { IUserRepository } from "../repositories";
import { EStatusCodes } from "../../../global/enums";
import { Role } from "../../../data/enums/user";

export class ChangeUserRoleUseCase implements BaseUseCase<{ userId: string, roles: Role[] }, TUser, AuthContext> {
    constructor(private readonly userRepository: IUserRepository) { }

    async execute(input: { userId: string, roles: Role[] }, context: AuthContext): Promise<UseCaseResult<TUser>> {
        try {
            if (!context?.userId || (context?.roles.includes(Role.Admin))) {
                return handleUseCaseError({ error: "Unauthorized", title: "Change User Role", status: EStatusCodes.enum.forbidden });
            }

            const data = await this.userRepository.update(input.userId, {
                roles: input.roles
            });
            if (!data) {
                return handleUseCaseError({ error: "Error Changing User Role", title: "Change User Role" });
            }

            return {
                success: true,
                data,
            };
        } catch (error) {
            return handleUseCaseError({title:"Change User Role"});
        }
    }
}
