import JWT from 'jsonwebtoken';
import bcrypt from "bcrypt"
import { CreateUserDTO, CreateUserSchema, SignInDTO, SocialSignInDTO, SocialSignInSchema } from "../../../data/dto/user";
import { TUser } from "../../../data/entities/user";
import { ID } from "../../../global/entities";
import { EStatusCodes } from "../../../global/enums";
import { handleUseCaseError, UseCaseResult } from "../../../global/useCase";
import { validateData } from "../../../utils/functions";
import { logger } from "../../../utils/logger";
import { IUserRepository } from "../../users/repositories";
import { CreateUserUseCase } from "../../users/useCases/CreateUser";
import { AutUseCaseRepository, TokenPair } from "../repository";
import { env } from '../../../config/env';


export class AuthUseCase extends AutUseCaseRepository {
  constructor(private readonly userRepository: IUserRepository, private readonly createNewUser: CreateUserUseCase) {
    super()
    this.signUp = this.signUp.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.signJWT = this.signJWT.bind(this);
    this.decodeJWT = this.decodeJWT.bind(this);
    this.generateTokens = this.generateTokens.bind(this);
    this.hashPassword = this.hashPassword.bind(this);
    this.verifyPassword = this.verifyPassword.bind(this);
  }

  async signUp(data: CreateUserDTO): Promise<UseCaseResult<TUser>> {
    try {
      const validate = validateData<CreateUserDTO>(data, CreateUserSchema)
      if (!validate.success) {
        return handleUseCaseError({ error: "Invalid data", title: "Sign Up", status: EStatusCodes.enum.badRequest })
      }
      const hashedPassword = await this.hashPassword(validate.data?.password!)
      data.password = hashedPassword
      const created = await this.createNewUser.execute(data)
      if (!created.success) {
        return handleUseCaseError({ error: created.error, title: "SignUp" })
      }
      const tokens = this.generateTokens(created.data);
      created.data.tokenPair = { ...tokens, provider: undefined }
      return created
    } catch (error) {
      return handleUseCaseError({ title: "Sign Up" })
    }
  }
  async signIn(data: SignInDTO | SocialSignInDTO): Promise<UseCaseResult<TUser>> {
    try {
      const validate = validateData<CreateUserDTO>(data, CreateUserSchema)
      if (!validate.success) {
        return handleUseCaseError({ error: `Invalid Email Or Password-${validate.error}`, title: "SignIn" })
      }
      let exists = await this.userRepository.findByEmail(validate.data.email);
      let externalProvider = validate.data?.externalProvider

      if (!exists && !externalProvider) {
        return handleUseCaseError({ error: "No Account With this Credentials", title: "SignIn" })
      }

      if (!exists && externalProvider) {
        //handle OAuth first signIn
        const validateNewOAuth = validateData<SocialSignInDTO>(data, SocialSignInSchema)
        if (!validateNewOAuth.success) {
          return handleUseCaseError({ error: `Create User from ${externalProvider}- ${validateNewOAuth.error}`, title: `${externalProvider} SignIn` })
        }
        const newUser = await this.createNewUser.execute(validateNewOAuth?.data)
        if (!newUser.success) {
          return handleUseCaseError({ error: `Create User from ${externalProvider}`, title: `${externalProvider} SignIn` })
        }
        exists = newUser.data
      }

      if (exists && !externalProvider) {
        const existPassword = await this.userRepository.getPasswordHash(exists.id!)

        const matched = await this.verifyPassword(validate.data?.password!, existPassword ?? "");
        if (!matched) {
          return handleUseCaseError({ error: "Invalid Email Or Password", title: "SignIn" })
        }
      }
      const tokenData = { firstName: exists?.firstName, lastName: exists?.lastName, id: exists?.id, profilePictureUrl: exists?.profilePictureUrl, email: exists?.email!, roles: exists?.roles! }
      const tokens = this.generateTokens(tokenData);

      const loggedIn = await this.userRepository.update(exists?.id!, {
        tokenPair: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          provider: externalProvider
        }
      });
      if (!loggedIn) {
        return handleUseCaseError({ error: "Login Error", title: "SignIn" })
      }
      return ({
        data: loggedIn,
        success: true
      });
    } catch (error) {
      return handleUseCaseError({ title: "SignIn" })
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

  signJWT(payload: Partial<TUser>, expiresIn: number): string {
    const token = JWT.sign(payload, env.jwt_secret, {
      expiresIn: expiresIn,
    });
    return token;
  }

  decodeJWT(token: string): Partial<TUser> | null {
    const decoded = JWT.decode(token);
    if (decoded && typeof decoded === 'object') {
      return decoded as Partial<TUser>
    }
    return null;
  }


  generateTokens(user: Pick<TUser, "id" | "roles" | "email" | "profilePictureUrl" | "firstName" | "lastName">): TokenPair {
    const refreshToken = this.signJWT(user, 12 * 4 * 7 * 24 * 60 * 60);
    const accessToken = this.signJWT(user, 24 * 60 * 60);
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
