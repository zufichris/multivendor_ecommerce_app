import { TUser } from "../../../data/entity/user";
import { AuthContext, BaseUseCase, handleUseCaseError, UseCaseResult } from "../../../global/use-case";
import { IUserRepository } from "../repository";
import { EStatusCodes } from "../../../global/enum";
import { Role } from "../../../data/enum/user";
import { ID } from "../../../global/entity";

export class ChangeUserStatusUseCase implements BaseUseCase<{ userId: string, isActive: boolean }, TUser, AuthContext> {
    constructor(private readonly userRepository: IUserRepository) { }

    async execute(input: { userId: ID, isActive: boolean }, context: AuthContext): Promise<UseCaseResult<TUser>> {
        try {
            if (!context?.userId || (context?.roles.includes(Role.Admin))) {
                return handleUseCaseError({ error: "Unauthorized", title: "Change User Status", status: EStatusCodes.enum.forbidden });
            }

            const data = await this.userRepository.update(input.userId, {
                isActive: input.isActive
            });
            if (!data) {
                return handleUseCaseError({ error: "Error Changing User Status", title: "Change User Status" });
            }

            return {
                success: true,
                data,
            };
        } catch (error) {
            return handleUseCaseError({ title: "Change User Status" });
        }
    }
}
