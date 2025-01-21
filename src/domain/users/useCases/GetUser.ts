import { TUser } from "../../../data/entities/user";
import { BaseUseCase, UseCaseResult, handleUseCaseError, AuthContext } from "../../../global/useCase";
import { IUserRepository } from "../repositories";
import { EStatusCodes } from "../../../global/enums";
import { Role } from "../../../data/enums/user";

export class GetUserUseCase implements BaseUseCase<| { userId: string } | { email: string }, TUser, AuthContext> {
    constructor(private readonly userRepository: IUserRepository) { }

    async execute(input: | { userId: string, email?: undefined } | { email: string, userId?: undefined }, context?: AuthContext): Promise<UseCaseResult<TUser>> {
        try {
            if (!context?.userId ||
                (context?.userId !== input.userId && !context.roles.includes(Role.Admin))) {
                return handleUseCaseError("Unauthorized", "Get User", EStatusCodes.enum.forbidden);
            }

            let data: TUser | null = null;

            if (input.userId) {
                data = await this.userRepository.findById(input.userId);
            } else {
                data = await this.userRepository.findByEmail(input.email!);
            }

            if (!data) {
                return handleUseCaseError("User not found", "Get User", EStatusCodes.enum.notFound);
            }

            return {
                success: true,
                data,
            };
        } catch (error) {
            return handleUseCaseError(error, "Get User");
        }
    }
}
