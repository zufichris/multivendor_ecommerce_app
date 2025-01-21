import JWT from 'jsonwebtoken';
import bcrypt from "bcrypt"
import { CreateUserDTO, CreateUserSchema, SignInDTO, SocialSignInDTO } from "../../../data/dto/user";
import { TUser } from "../../../data/entities/user";
import { ID } from "../../../global/entities";
import { EStatusCodes } from "../../../global/enums";
import { handleUseCaseError, UseCaseResult } from "../../../global/useCase";
import { validateData } from "../../../utils/functions";
import { logger } from "../../../utils/logger";
import { IUserRepository } from "../../users/repositories";
import { CreateUserUseCase } from "../../users/useCases/CreateUser";
import { AuthRepository, TokenPair } from "../repository";
import { env } from '../../../config/env';
import { Role } from '../../../data/enums/user';


export class AuthUseCase extends AuthRepository {
  constructor(private readonly userRepository: IUserRepository, private readonly createNewUser: CreateUserUseCase) {
    super()
  }

  async signUp(data: CreateUserDTO): Promise<UseCaseResult<TUser>> {
    try {
      const validate = validateData<CreateUserDTO>(data, CreateUserSchema)
      if (!validate.success)
        return handleUseCaseError("Invalid data", "Sign Up", EStatusCodes.enum.badRequest)
      const hashedPassword = await this.hashPassword(validate.data?.password!)

      const created = await this.createNewUser.execute({ ...data, password: hashedPassword })
      if (!created.success) {
        return handleUseCaseError(created.error, "SignUp")
      }
      return created
    } catch (error) {
      return handleUseCaseError(error, "Sign Up")
    }
  }
  async signIn(data: SignInDTO | SocialSignInDTO): Promise<UseCaseResult<TUser>> {
    try {
      const validate = validateData<CreateUserDTO>(data, CreateUserSchema)
      if (!validate.success) {
        return handleUseCaseError("Invalid Email Or Password", "SignIn")
      }
      let exists = await this.userRepository.findByEmail(validate.data?.email!);
      let externalProvider = validate.data?.externalProvider

      if (!exists && !externalProvider) {
        return handleUseCaseError("No Account With this Credentials", "SignIn")
      }

      if (!exists && externalProvider) {
        //handle OAuth first signIn
        const newUser = await this.createNewUser.execute(validate?.data!)
        if (!newUser.success) {
          return handleUseCaseError(`Create User from ${externalProvider}`, `${externalProvider} SignIn`)
        }
        exists = newUser.data
      }

      if (exists && externalProvider) {
        //handle OAuth  signIn
      }

      if (exists && !externalProvider) {
        //Email and Password
        const matched = await this.verifyPassword(validate.data?.password!, exists?.password!);
        if (!matched) {
          return handleUseCaseError("Invalid Email Or Password", "SignIn")
        }
      }

      const tokens = this.generateTokens(exists?.id!, exists?.roles!);

      const loggedIn = await this.userRepository.update(exists?.id!, {
        tokenPair: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          provider: externalProvider
        }
      });
      if (!loggedIn) {
        return handleUseCaseError("Login Error", "SignIn")
      }
      return ({
        data: loggedIn,
        success: true
      });
    } catch (error) {
      return handleUseCaseError(error, "SignIn")
    }
  }
  async signOut(userId: ID): Promise<void> {
    try {
      await this.userRepository.update(userId, {
        tokenPair: {
          accessToken: undefined,
          refreshToken: undefined,
          provider: undefined
        }
      });
    } catch (error: unknown) {
      throw error
    }
  }

  signJWT(payload: { userId: ID, roles: Role[] }, expiresIn: number): string {
    const token = JWT.sign(payload, env.jwt_secret, {
      expiresIn: expiresIn,
    });
    return token;
  }

  decodeJWT(token: string): { userId: ID, roles: Role[] } | null {
    const decoded = JWT.decode(token);
    if (decoded && typeof decoded === "object" && "userId" in decoded) {
      const data = {
        userId: decoded.userId as ID,
        roles: (decoded.role || [Role.User]) as Role[]
      }
      return data
    }
    return null;
  }


  generateTokens(userId: ID, roles: Role[]): TokenPair {
    const refreshToken = this.signJWT({ userId, roles }, 12 * 4 * 7 * 24 * 60 * 60);
    const accessToken = this.signJWT({ userId, roles }, 24 * 60 * 60);
    return { refreshToken, accessToken };
  }
  async hashPassword(password: string): Promise<string | null> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      return hashed;
    } catch (err) {
      logger.error("Error Hashing Password", err);
      throw new Error("Error hashing password");
    }
  }
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const matched = await bcrypt.compare(password, hash);
    return matched;
  }

}
