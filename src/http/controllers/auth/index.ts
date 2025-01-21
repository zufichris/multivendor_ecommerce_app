import { Response, Request, NextFunction, CookieOptions } from "express";
import { GoogleAuthConfig } from "../../../config/google";
import { AuthUseCase } from "../../../domain/auth/useCases/AuthUseCase";
import { GoogleAuthControllers } from "./GoogleAuth";
import { CreateUserSchema, SignInDTO, SignInSchema, SocialSignInDTO, SocialSignInSchema } from "../../../data/dto/user";
import { validateData } from "../../../utils/functions";
import { EStatusCodes } from "../../../global/enums";
import { IResponseData } from "../../../global/entities";
import { TUser } from "../../../data/entities/user";
import { UserRepositoryImpl } from "../../../data/orm/repositoryImpl/user";
import { UserModel } from "../../../data/orm/models/user";
import { CreateUserUseCase } from "../../../domain/users/useCases/CreateUser";
export class AuthControllers {
  public googleAuthControllers = new GoogleAuthControllers(GoogleAuthConfig)
  constructor(
    private readonly authUseCase: AuthUseCase
  ) { }

  async signUp(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const validation = validateData<TUser>(req.body, CreateUserSchema);
      if (!validation.success) {
        res.status(EStatusCodes.enum.badRequest).json({
          error: validation.error,
          message: "Validation failed",
          status: EStatusCodes.enum.badRequest,
          description: "Invalid input data for creating a new user",
          url: req.url,
          path: req.path,
        });
        return
      }

      const result = await this.authUseCase.signUp(validation.data);

      if (!result.success) {
        res.status(EStatusCodes.enum.conflict).json({
          error: result.error,
          message: "User creation conflict",
          status: EStatusCodes.enum.conflict,
          description: "Email already in use or other conflict occurred",
          url: req.url,
          path: req.path,
        });
        return
      }
      const responseData: IResponseData<TUser> = {
        ...result,
        message: "New User Created",
        status: EStatusCodes.enum.created,
        description: "New user successfully created with email and password",
        url: req.url,
        path: req.path,
        documentsModified: 1,
        type: "Create User",
      };

      res.status(responseData.status).json(responseData);
    } catch (error) {
      next(error);
    }
  }
  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = validateData<SignInDTO>(req.body, SignInSchema);
      if (!validation.success) {
        res.status(EStatusCodes.enum.badRequest).json({
          error: validation.error,
          message: "Invalid login credentials",
          status: EStatusCodes.enum.badRequest,
          description: "Validation failed for the provided email and password",
          url: req.url,
          path: req.path,
        });
        return
      }
      const { email, password } = validation.data;
      const result = await this.authUseCase.signIn({ email, password });
      if (!result.success) {
        res.status(EStatusCodes.enum.unauthorized).json({
          error: result.error,
          message: "Authentication failed",
          status: EStatusCodes.enum.unauthorized,
          description: "Invalid email or password",
          url: req.url,
          path: req.path,
        });
        return
      }
      const responseData = {
        data: result.data,
        message: "Login successful",
        status: EStatusCodes.enum.ok,
        description: "User successfully logged in",
        url: req.url,
        path: req.path,
        type: "Sign In",
      };

      this.setCookies(
        res,
        result.data.tokenPair?.accessToken as string,
        result.data.tokenPair?.refreshToken as string
      ).status(EStatusCodes.enum.ok).json(responseData);
    } catch (error) {
      next(error);
    }
  }


  async socialSignIn(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = validateData<SocialSignInDTO>(req.body, SocialSignInSchema);
      if (!validation.success) {
        res.status(EStatusCodes.enum.badRequest).json({
          error: validation.error,
          message: "Invalid social login credentials",
          status: EStatusCodes.enum.badRequest,
          description: "Validation failed for the provided social login data",
          url: req.url,
          path: req.path,
        });
        return
      }

      const user = validation.data;

      const result = await this.authUseCase.signIn(user);
      if (!result.success) {
        res.status(EStatusCodes.enum.unauthorized).json({
          error: result.error,
          message: "Social authentication failed",
          status: EStatusCodes.enum.unauthorized,
          description: "Social login failed for the provided user details",
          url: req.url,
          path: req.path,
        });
        return
      }
      const responseData = {
        data: result.data,
        message: "Social login successful",
        status: EStatusCodes.enum.ok,
        description: "User successfully logged in using social account",
        url: req.url,
        path: req.path,
        type: "Social Sign In",
      };

      this.setCookies(
        res,
        result.data.tokenPair?.accessToken as string,
        result.data.tokenPair?.refreshToken as string
      ).status(EStatusCodes.enum.ok).json(responseData);
    } catch (error) {
      next(error);
    }
  }


  async signOut(req: Request, res: Response, next: NextFunction) {
    try {
      // const userId = req.user!.userId!;
      // await this.authUseCase.signOut(userId);
      this.clearCookies(res).status(EStatusCodes.enum.ok)
        .json({ message: "Successfully logged out" });
    } catch (error) {
      next(error);
    }
  }

  private getTokenOptions() {
    return {
      accessTokenOptions: {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      } as CookieOptions,
      refreshTokenOptions: {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      } as CookieOptions,
    }
  }


  private setCookies(
    res: Response,
    accessToken?: string,
    refreshToken?: string
  ) {
    const { accessTokenOptions, refreshTokenOptions } = this.getTokenOptions();

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);
    return res
  }
  private clearCookies(res: Response) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return res
  }
}


const userRepository = new UserRepositoryImpl(UserModel)
const createUserUseCase = new CreateUserUseCase(userRepository)
const authUseCase = new AuthUseCase(userRepository, createUserUseCase)
export const authControllers = new AuthControllers(authUseCase)