import { TUser } from "../../../data/entities/user";
import { BaseUseCase, UseCaseResult, handleUseCaseError, AuthContext } from "../../../global/usecase";
import { IUserRepository } from "../repositories";
import { EStatusCodes } from "../../../global/enums";
import { Role } from "../../../data/enums/user";

export class GetUserUseCase implements BaseUseCase<| { userId?: string, email?: string, custId?: string }, TUser, AuthContext> {
    constructor(private readonly userRepository: IUserRepository) { }

    async execute(input: { userId?: string, email?: string, custId?: string }, context?: AuthContext): Promise<UseCaseResult<TUser>> {
        try {
            if (!context?.userId ||
                (context?.userId !== input.userId && !context.roles.includes(Role.Admin))) {
                return handleUseCaseError({ error: "Unauthorized", title: "Get User", status: EStatusCodes.enum.forbidden });
            }

            let data: TUser | null = null;

            if (input.userId) {
                data = await this.userRepository.findById(input.userId);
            } else if (input.email) {
                data = await this.userRepository.findByEmail(input.email);
            } else if (input.custId) {
                data = await this.userRepository.findOne({ custId: input.custId })
            }
            if (!data) {
                return handleUseCaseError({ error: "User not found", title: "Get User", status: EStatusCodes.enum.notFound });
            }

            return {
                success: true,
                data,
            };
        } catch (error) {
            return handleUseCaseError({ title: "Get User" });
        }
    }
}
