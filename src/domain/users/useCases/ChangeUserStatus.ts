import { TUser } from "../../../data/entities/user";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/useCase";
import { IUserRepository } from "../repositories";
import { EStatusCodes } from "../../../global/enums";
import { Role } from "../../../data/enums/user";
import { ID } from "../../../global/entities";

export class ChangeUserStatusUseCase implements BaseUseCase<{ userId: string, isActive: boolean }, TUser, AuthContext> {
    constructor(private readonly userRepository: IUserRepository) { }

    async execute(input: { userId: ID, isActive: boolean }, context: AuthContext): Promise<UseCaseResult<TUser>> {
        try {
            if (!context?.userId || (context?.roles.includes(Role.Admin))) {
                return handleUseCaseError("Unauthorized", "Change User Status", EStatusCodes.enum.forbidden);
            }

            const data = await this.userRepository.update(input.userId, {
                isActive: input.isActive
            });
            if (!data) {
                return handleUseCaseError("Error Changing User Status", "Change User Status");
            }

            return {
                success: true,
                data,
            };
        } catch (error) {
            return handleUseCaseError(error, "Change User Status");
        }
    }
}
