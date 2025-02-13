import { TUser } from "../../../data/entity/user";
import { BaseUseCase, UseCaseResult, handleUseCaseError, AuthContext } from "../../../global/use-case";
import { IUserRepository } from "../repository";
import { EStatusCodes } from "../../../global/enum";
import { getPermission, hasRequiredPermissions } from "../../../util/functions";

export class GetUserUseCase implements BaseUseCase<{ userId?: string, email?: string, custId?: string }, TUser, AuthContext> {
    constructor(private readonly userRepository: IUserRepository) { }

    async execute(input: { userId?: string, email?: string, custId?: string }, context?: AuthContext): Promise<UseCaseResult<TUser>> {
        try {
            if (!context?.userId) {
                return handleUseCaseError({
                    error: "Authentication required. Please log in.",
                    title: "Get User",
                    status: EStatusCodes.enum.unauthorized
                });
            }

           const REQUIRED_PERMISSION = getPermission("user", "view_own");
                       const hasPermission = hasRequiredPermissions(REQUIRED_PERMISSION, context.permissions);
                       if (!hasPermission) {
                           return handleUseCaseError({
                               error: "Forbidden: You do not have permission to create roles.",
                               title: "Create Role - Authorization",
                               status: EStatusCodes.enum.forbidden,
                           });
                       }

            let data: TUser | null = null;

            if (input.userId) {
                data = await this.userRepository.findById(input.userId);
            } else if (input.email) {
                data = await this.userRepository.findByEmail(input.email);
            } else if (input.custId) {
                data = await this.userRepository.findOne({ custId: input.custId });
            }

            if (!data) {
                return handleUseCaseError({
                    error: "User not found.",
                    title: "Get User",
                    status: EStatusCodes.enum.notFound
                });
            }

            // Never expose password or other sensitive information
            const { password, ...safeUserData } = data;

            return {
                success: true,
                data: safeUserData,
            };
        } catch (error: any) {
            return handleUseCaseError({
                title: "Get User",
                error: "An unexpected error occurred while retrieving user data.",
                status: EStatusCodes.enum.internalServerError
            });
        }
    }
}