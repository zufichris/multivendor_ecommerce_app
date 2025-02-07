import { Response, Request, NextFunction, CookieOptions } from "express";
import { GoogleAuthConfig } from "../../../config/google";
import { AuthUseCase } from "../../../domain/auth/usecase/AuthUseCase";
import { GoogleAuthControllers } from "./GoogleAuth";
import { CreateUserSchema, SignInDTO, SignInSchema, SocialSignInDTO, SocialSignInSchema } from "../../../data/dto/user";
import { validateData } from "../../../utils/functions";
import { EStatusCodes } from "../../../global/enums";
import { IResponseData } from "../../../global/entities";
import { TUser } from "../../../data/entities/user";
import { UserRepositoryImpl } from "../../../data/orm/repositoryImpl/user";
import { UserModel } from "../../../data/orm/models/user";
import { CreateUserUseCase } from "../../../domain/users/usecases/CreateUser";
import { IAuthUseCaseRepository } from "../../../domain/auth/repository";

export class AuthControllers {
  public googleAuthControllers = new GoogleAuthControllers(GoogleAuthConfig);

  constructor(private readonly authUseCase: IAuthUseCaseRepository) {
    this.signUp = this.signUp.bind(this);
    this.signIn = this.signIn.bind(this);
    this.socialSignIn = this.socialSignIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.setCookies = this.setCookies.bind(this);
    this.clearCookies = this.clearCookies.bind(this);
  }

  private generateMetadata(req: Request, message: string, type?: string) {
    return {
      url: req.url,
      path: req.path,
      type: type ?? "Auth",
      message,
      error: {
        message,
      },
    };
  }

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = validateData<TUser>(req.body, CreateUserSchema);
      if (!validation.success) {
        const data = {
          ...this.generateMetadata(req, "Validation failed"),
          status: EStatusCodes.enum.badRequest,
          success: false,
          description: "Invalid input data for creating a new user",
          error: validation.error,
        };
        res.status(data.status).json(data);
        return;
      }

      const result = await this.authUseCase.signUp(validation.data);
      if (!result.success) {
        const data = {
          ...this.generateMetadata(req, "User creation conflict"),
          status: EStatusCodes.enum.conflict,
          success: false,
          description: "Email already in use or other conflict occurred",
          error: result.error,
        };
        res.status(data.status).json(data);
        return;
      }

      const data: IResponseData<TUser> = {
        ...this.generateMetadata(req, "New user created"),
        status: EStatusCodes.enum.created,
        success: true,
        description: "New user successfully created with email and password",
        data: result.data,
      };
      res.status(data.status).json(data);
    } catch (error) {
      next(error);
    }
  }
  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = validateData<SignInDTO>(req.body, SignInSchema);;
      if (!validation.success) {
        const data = {
          ...this.generateMetadata(req, "Invalid login credentials"),
          status: EStatusCodes.enum.badRequest,
          success: false,
          description: "Validation failed for the provided email and password",
          error: validation.error,
        };
        res.status(data.status).json(data);
        return;
      }
      const result = await this.authUseCase.signIn(validation.data);
      if (!result.success) {
        const data = {
          ...this.generateMetadata(req, result.error ?? "Authentication failed", "Auth"),
          status: result.status ?? EStatusCodes.enum.unauthorized,
          success: false,
          description: "Invalid email or password",
          error: result.error,
        };
        res.status(data.status).json(data);
        return;
      }

      const data = {
        ...this.generateMetadata(req, "Login successful"),
        status: EStatusCodes.enum.ok,
        success: true,
        description: "User successfully logged in",
        data: result.data,
      };

      this.setCookies(
        res,
        result.data.tokenPair?.accessToken as string,
        result.data.tokenPair?.refreshToken as string
      ).status(data.status).json(data);
    } catch (error) {
      next(error);
    }
  }

  async socialSignIn(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = validateData<SocialSignInDTO>(req.body, SocialSignInSchema);
      if (!validation.success) {
        const data = {
          ...this.generateMetadata(req, "Invalid social login credentials"),
          status: EStatusCodes.enum.badRequest,
          success: false,
          description: `Validation failed for  login data`,
          error: validation.error,
        };
        res.status(data.status).json(data);
        return;
      }

      const user = validation.data;
      const result = await this.authUseCase.signIn(user);
      if (!result.success) {
        const data = {
          ...this.generateMetadata(req, "Social authentication failed"),
          status: EStatusCodes.enum.unauthorized,
          success: false,
          description: "Social login failed for the provided user details",
          error: result.error,
        };
        res.status(data.status).json(data);
        return;
      }

      const data: IResponseData<TUser> = {
        ...this.generateMetadata(req, "Social login successful"),
        status: EStatusCodes.enum.ok,
        success: true,
        description: "User successfully logged in using social account",
        data: result.data,
      };
      res.status(data.status).json(data);
    } catch (error) {
      next(error);
    }
  }

  async signOut(req: Request, res: Response, next: NextFunction) {
    try {
      this.clearCookies(res)
        .status(EStatusCodes.enum.ok)
        .json({
          ...this.generateMetadata(req, "Successfully logged out"),
          status: EStatusCodes.enum.ok,
          success: true,
        });
    } catch (error) {
      next(error);
    }
  }

  private getTokenOptions() {
    return {
      accessTokenOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
        domain: "localhost",
        path: "/",
        credentials: true,
      } as CookieOptions,
      refreshTokenOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        domain: "localhost",
        path: "/",
        credentials: true,
      } as CookieOptions,
    };
  }

  private setCookies(res: Response, accessToken?: string, refreshToken?: string) {
    const { accessTokenOptions, refreshTokenOptions } = this.getTokenOptions();
    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);
    return res;
  }

  private clearCookies(res: Response) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return res;
  }
}

const userRepository = new UserRepositoryImpl(UserModel);
const createUser = new CreateUserUseCase(userRepository);
const authUseCase = new AuthUseCase(userRepository, createUser);

export const authControllers = new AuthControllers(authUseCase);