import { TUser } from '../../../data/entities/user';
import { CreateUserDTO, SignInDTO, SocialSignInDTO } from '../../../data/dto/user';
import { UseCaseResult } from '../../../global/usecase';
import { ID } from '../../../global/entities';

export type TokenPair = { accessToken: string, refreshToken: string }

export interface IAuthUseCaseRepository {
    signUp(data: CreateUserDTO): Promise<UseCaseResult<TUser>>
    signIn(credentials: SignInDTO | SocialSignInDTO): Promise<UseCaseResult<TUser>>
    signOut(userId: ID): Promise<void>
    // verifyAccount(userId: ID): Promise<TUser | null>
    verifyPassword(password: string, hash: string): Promise<boolean>
    // resetPassword(userId: ID): Promise<TUser | null>
    // changePassword(userId: ID, oldPassword: string, newPassword: string): Promise<boolean>
    // revokeToken(userId: ID): Promise<void>
    // forgotPassword(email: string): Promise<boolean>
    signJWT(payload: Partial<TUser>, expiresIn: number): string
    decodeJWT(token: string): Partial<TUser> | null
    generateTokens(user: Pick<TUser, "id" | "roles" | "email" | "profilePictureUrl" | "firstName" | "lastName">): TokenPair
    hashPassword(password: string): Promise<string | null>
}
export abstract class AutUseCaseRepository implements IAuthUseCaseRepository {
    abstract signIn(credentials: SignInDTO | SocialSignInDTO): Promise<UseCaseResult<TUser>>
    abstract signUp(data: CreateUserDTO): Promise<UseCaseResult<TUser>>
    abstract signOut(userId: ID): Promise<void>;
    // abstract changePassword(userId: ID, oldPassword: string, newPassword: string): Promise<boolean>
    // abstract forgotPassword(email: string): Promise<boolean>;
    // abstract resetPassword(userId: ID): Promise<TUser | null>;
    // abstract revokeToken(userId: ID): Promise<void>;
    // abstract verifyAccount(userId: ID): Promise<TUser | null>;
    abstract signJWT(payload: Partial<TUser>, expiresIn: number): string
    abstract decodeJWT(token: string): Partial<TUser> | null
    abstract generateTokens(user: Pick<TUser, "id" | "roles" | "email" | "profilePictureUrl" | "firstName" | "lastName">): TokenPair
    abstract hashPassword(password: string): Promise<string | null>
    abstract verifyPassword(password: string, hash: string): Promise<boolean>;
}

