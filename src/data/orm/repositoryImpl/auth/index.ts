// import { AuthRepository } from "../../../../domain/auth/repository";
// import { IUserRepository } from "../../../../domain/users/repositories";
// import { ID } from "../../../../global/entities";
// import { logger } from "../../../../utils/logger";


// export class AuthRepositoryImpl extends AuthRepository {
//     constructor(private readonly userRepository: IUserRepository) {
//         super();
//     }
//     async signUp(data: SignUpDto): Promise<IUser | null> {
//         try {
//             const existingUser = await this.userRepository.findByEmail(data.email);
//             if (existingUser) {
//                 throw new Error("User already exists");
//             }

//             const hashedPassword = await this.hashPassword(data.password!);
//             if (!hashedPassword) {
//                 throw new Error("Error hashing password");
//             }

//             const newUser = await this.userRepository.create({
//                 ...data,
//                 password: hashedPassword,
//             })

//             return newUser;
//         } catch (error) {
//             logger.error("Error during sign up", error);
//             throw new Error("Failed to sign up user");
//         }
//     }
//     async verifyAccount(userId: ID): Promise<IUser | null> {
//         try {
//             const user = await this.userRepository.findById(userId);
//             if (!user) {
//                 throw new Error("User not found");
//             }
//             user.isEmailVerified = true;
//             await this.userRepository.update(userId, user);
//             return user;
//         } catch (error) {
//             logger.error("Error during account verification", error);
//             throw new Error("Failed to verify account");
//         }
//     }

//     async signIn(credentials: SignInDto): Promise<IUser | null> {
//         try {
//             const user = await this.userRepository.findByEmail(credentials.email);
//             if (!user) {
//                 throw new Error("User not found");
//             }

//             const isPasswordValid = await this.verifyPassword(credentials.password, user.password!);
//             if (!isPasswordValid) {
//                 throw new Error("Invalid password");
//             }

//             return user;
//         } catch (error) {
//             logger.error("Error during sign in", error);
//             throw new Error("Failed to sign in user");
//         }
//     }
//     async signOut(userId: ID): Promise<void> {
//         try {
//             logger.info(`User ${userId} signed out successfully`);
//         } catch (error) {
//             logger.error("Error during sign out", error);
//             throw new Error("Failed to sign out user");
//         }
//     }
//     async changePassword(userId: ID, oldPassword: string, newPassword: string): Promise<boolean> {
//         try {
//             const user = await this.userRepository.findById(userId);
//             if (!user) {
//                 throw new Error("User not found");
//             }

//             const isOldPasswordValid = await this.verifyPassword(oldPassword, user.password!);
//             if (!isOldPasswordValid) {
//                 throw new Error("Old password is incorrect");
//             }

//             const hashedNewPassword = await this.hashPassword(newPassword);
//             if (!hashedNewPassword) {
//                 throw new Error("Error hashing new password");
//             }

//             user.password = hashedNewPassword;
//             await this.userRepository.update(userId, user);
//             return true;
//         } catch (error) {
//             logger.error("Error during password change", error);
//             throw new Error("Failed to change password");
//         }
//     }

//     async forgotPassword(email: string): Promise<boolean> {
//         try {
//             const user = await this.userRepository.findByEmail(email);
//             if (!user) {
//                 throw new Error("User not found");
//             }

//             logger.info(`Password reset requested for ${email}`);
//             return true;
//         } catch (error) {
//             logger.error("Error during forgot password", error);
//             throw new Error("Failed to process forgot password request");
//         }
//     }

//     async resetPassword(userId: ID): Promise<IUser | null> {
//         try {
//             const user = await this.userRepository.findById(userId);
//             if (!user) {
//                 throw new Error("User not found");
//             }

//             return user;
//         } catch (error) {
//             logger.error("Error during reset password", error);
//             throw new Error("Failed to reset password");
//         }
//     }

//     async revokeToken(userId: ID): Promise<void> {
//         try {
//             logger.info(`Token for user ${userId} revoked`);
//         } catch (error) {
//             logger.error("Error during token revocation", error);
//             throw new Error("Failed to revoke token");
//         }
//     }
// }
