import { TUser } from '../../../data/entities/user';
import { CreateUserDTO } from '../../../data/dto/user';
import { UseCaseResult } from '../../../global/useCase';
import { Role } from '../../../data/enums/user';
import { ID } from '../../../global/entities';

export type TokenPair = { accessToken: string, refreshToken: string }

export interface IAuthRepository {
    signUp(data: CreateUserDTO): Promise<UseCaseResult<TUser>>
    signIn(credentials: CreateUserDTO): Promise<UseCaseResult<TUser>>
    signOut(userId: ID): Promise<void>
    // verifyAccount(userId: ID): Promise<TUser | null>
    verifyPassword(password: string, hash: string): Promise<boolean>
    // resetPassword(userId: ID): Promise<TUser | null>
    // changePassword(userId: ID, oldPassword: string, newPassword: string): Promise<boolean>
    // revokeToken(userId: ID): Promise<void>
    // forgotPassword(email: string): Promise<boolean>
    signJWT(payload: { userId: ID,roles:Role[] }, expiresIn: number): string | null
    decodeJWT(token: string): { userId: ID, roles: Role[] } | null
    generateTokens(userId: ID,roles:Role[]): TokenPair | null
    hashPassword(password: string): Promise<string | null>
}
export abstract class AuthRepository implements IAuthRepository {
    abstract signIn(credentials: CreateUserDTO): Promise<UseCaseResult<TUser>>
    abstract signUp(data: CreateUserDTO): Promise<UseCaseResult<TUser>>
    abstract signOut(userId: ID): Promise<void>;
    // abstract changePassword(userId: ID, oldPassword: string, newPassword: string): Promise<boolean>
    // abstract forgotPassword(email: string): Promise<boolean>;
    // abstract resetPassword(userId: ID): Promise<TUser | null>;
    // abstract revokeToken(userId: ID): Promise<void>;
    // abstract verifyAccount(userId: ID): Promise<TUser | null>;
    abstract signJWT(payload: { userId: ID,roles:Role[] }, expiresIn: number): string | null
    abstract decodeJWT(token: string): { userId: ID, roles: Role[] } | null
    abstract generateTokens(userId: ID,roles:Role[]): TokenPair | null
    abstract hashPassword(password: string): Promise<string | null>
    abstract verifyPassword(password: string, hash: string): Promise<boolean>;
}

