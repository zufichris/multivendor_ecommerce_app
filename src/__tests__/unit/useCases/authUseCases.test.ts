import { CreateUserDTO, SignInDTO, SocialSignInDTO } from '../../../data/dto/user';
import { Role } from '../../../data/enums/user';
import { EStatusCodes } from '../../../global/enums';
import JWT from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { IAuthRepository } from '../../../domain/auth/repository';
import { IUserRepository } from '../../../domain/users/repositories';
import { CreateUserUseCase } from '../../../domain/users/useCases/CreateUser';
import { AuthUseCase } from '../../../domain/auth/useCases/AuthUseCase';
import { TUser } from '../../../data/entities/user';
import { AppError } from '../../../global/error';
import { UseCaseResult } from '../../../global/useCase';
import { OAuthProviders } from '../../../data/enums/auth';
import { TENV } from '../../../config/env';
const env: TENV = {
    jwt_secret: "123",
    google_callback_url: "url",
    mongo_uri: "mongo",
    port: "6000",
    in_prod: false,
    google_client_id: "id",
    google_client_secret: "secret",
    url: "url"
}
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../../utils/logger', () => ({
    logger: {
        error: jest.fn(),
    },
}));
describe('AuthUseCase', () => {
    let authUseCase: IAuthRepository;
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let mockCreateUserUseCase: jest.Mocked<CreateUserUseCase>;

    const sampleUser: Partial<TUser> = {
        id: 'user123',
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User',
        roles: [Role.User],
    };

    beforeEach(() => {
        mockUserRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
            query: jest.fn(),
        } as unknown as jest.Mocked<IUserRepository>;

        mockCreateUserUseCase = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<CreateUserUseCase>;

        authUseCase = new AuthUseCase(mockUserRepository, mockCreateUserUseCase);

        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');

        (JWT.sign as jest.Mock).mockReturnValue('mock_token');
        (JWT.decode as jest.Mock).mockReturnValue({ userId: 'user123', roles: [Role.User] });
    });

    describe('signUp', () => {
        const signUpData: CreateUserDTO = {
            email: 'test@example.com',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
        };

        it('should successfully create a new user', async () => {
            const successResult: UseCaseResult<TUser> = {
                success: true,
                data: sampleUser as TUser,
            };

            mockCreateUserUseCase.execute.mockResolvedValueOnce(successResult);

            const result = await authUseCase.signUp(signUpData);

            expect(result.success).toBe(true);
            expect(result).toEqual(successResult);
            expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith({
                ...signUpData,
                password: 'hashedPassword',
            });
        });

        it('should handle invalid data', async () => {
            const invalidData = { ...signUpData,email:"Invalid email" } as CreateUserDTO

            const result = await authUseCase.signUp(invalidData);

            expect(result.success).toBe(false);
        });

        it('should handle creation failure', async () => {
            const errorResult: UseCaseResult<TUser> = {
                success: false,
                error: new AppError({
                    message: 'Failed To Create User',
                    statusCode: EStatusCodes.enum.badRequest,
                    name: 'CreateUserError'
                })
            };

            mockCreateUserUseCase.execute.mockResolvedValueOnce(errorResult);

            const result = await authUseCase.signUp(signUpData);

            expect(result.success).toBe(false);
            expect((result as { error: AppError<any> }).error).toBeInstanceOf(AppError);
        });
    });

    describe('signIn', () => {
        const signInData: SignInDTO = {
            email: 'test@example.com',
            password: 'password123',
        };

        it('should successfully sign in with email and password', async () => {
            mockUserRepository.findByEmail.mockResolvedValueOnce(sampleUser as TUser);
            mockUserRepository.update.mockResolvedValueOnce(sampleUser as TUser);

            const result = await authUseCase.signIn(signInData);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(sampleUser);
            }
            expect(mockUserRepository.update).toHaveBeenCalledWith(
                'user123',
                expect.objectContaining({
                    tokenPair: expect.objectContaining({
                        accessToken: expect.any(String),
                        refreshToken: expect.any(String),
                    })
                })
            );
        });

        it('should handle non-existent user', async () => {
            mockUserRepository.findByEmail.mockResolvedValueOnce(null);

            const result = await authUseCase.signIn(signInData);

            expect(result.success).toBe(false);
            expect((result as { error: AppError<any> }).error.message).toContain('No Account With this Credentials');
        });

        it('should handle invalid password', async () => {
            mockUserRepository.findByEmail.mockResolvedValueOnce(sampleUser as TUser);
            (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

            const result = await authUseCase.signIn(signInData);

            expect(result.success).toBe(false);
            expect((result as { error: AppError<any> }).error.message).toContain('Invalid Email Or Password');
        });

        it('should handle social sign in for new user', async () => {
            const socialSignInData = {
                ...signInData,
                externalProvider: OAuthProviders.Google,
            } as SocialSignInDTO

            mockUserRepository.findByEmail.mockResolvedValueOnce(null);
            mockCreateUserUseCase.execute.mockResolvedValueOnce({
                success: true,
                data: sampleUser as TUser,
            });
            mockUserRepository.update.mockResolvedValueOnce(sampleUser as TUser);

            const result = await authUseCase.signIn(socialSignInData);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(sampleUser);
            }
            expect(mockUserRepository.update).toHaveBeenCalled();
        });
    });

    describe('signOut', () => {
        it('should successfully sign out user', async () => {
            await authUseCase.signOut('user123');

            expect(mockUserRepository.update).toHaveBeenCalledWith('user123', {
                tokenPair: {
                    accessToken: undefined,
                    refreshToken: undefined,
                    provider: undefined,
                },
            });
        });

        it('should handle sign out error', async () => {
            mockUserRepository.update.mockRejectedValueOnce(new Error('Database error'));

            await expect(authUseCase.signOut('user123')).rejects.toThrow();
        });
    });

    describe('token management', () => {
        const payload = {
            userId: 'user123',
            roles: [Role.User],
        };

        it('should generate JWT token', () => {
            const token = authUseCase.signJWT(payload, 3600);

            expect(token).toBe('mock_token');
        });

        it('should decode JWT token', () => {
            const decoded = authUseCase.decodeJWT('mock_token');

            expect(decoded).toEqual({
                userId: 'user123',
                roles: [Role.User],
            });
        });

        it('should generate token pair', () => {
            const tokens = authUseCase.generateTokens('user123', [Role.User]);

            expect(tokens).toHaveProperty('accessToken');
            expect(tokens).toHaveProperty('refreshToken');
        });
    });

    describe('password management', () => {
        it('should hash password successfully', async () => {
            const hashedPassword = await authUseCase.hashPassword('password123');

            expect(hashedPassword).toBe('hashedPassword');
            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
        });

        it('should handle password hashing error', async () => {
            (bcrypt.genSalt as jest.Mock).mockRejectedValueOnce(new Error('Hashing error'));

            await expect(authUseCase.hashPassword('password123')).rejects.toThrow('Error hashing password');
        });

        it('should verify password successfully', async () => {
            const isValid = await authUseCase.verifyPassword('password123', 'hashedPassword');

            expect(isValid).toBe(true);
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
        });
    });
});