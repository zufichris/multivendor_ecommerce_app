import { CookieOptions, NextFunction, Request, Response } from "express";
import { UserRepositoryImpl } from "../../../data/orm/repository/UserRepositoryImpl";
import { Auth } from "../../../domain/useCases/Auth";
import { env } from "../../../config/env";
import { StatusCodes } from "../../../global/enums";
import { UserModel } from "../../../data/orm/models/user";
import { GoogleAuth } from "./GoogleAuth";
import { AppError } from "../../../global/error";
import { IUser } from "../../../data/entities/user";

export class AuthControllers {
  private readonly authUseCase: Auth;
  public readonly googleAuth: GoogleAuth;
  constructor(private readonly userRepository: UserRepositoryImpl) {
    this.authUseCase = new Auth(userRepository);
    this.googleAuth = new GoogleAuth({
      clientId: env.google_client_id,
      clientSecret: env.google_client_secret,
      redirectUri: env.google_callback_url,
      accessType: "offline",
      responseType: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
      codeAccessUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenAccessUrl: "https://oauth2.googleapis.com/token",
      profileAccessUrl: "https://www.googleapis.com/oauth2/v1/userinfo",
      grantType: "authorization_code",
    });
  }
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, name, password } = req.body;
      //FIXME Validation
      if (
        [
          !email,
          !email.includes("@"),
          !name,
          !password,
          !(password?.length >= 6),
        ].includes(true)
      )
        throw Error("Invalid Data");

      const login = await this.authUseCase.register({
        email,
        name,
        password,
      });
      if (!login) throw Error("Error registering User");

      this.setCookies(res, {
        accessToken: login.accessToken!,
        refreshToken: login.refreshToken!,
      })
        .status(StatusCodes.created)
        .redirect("/");
      // .json(login);
    } catch (error: any) {
      next(
        new AppError({
          ...(error?.error ?? {}),
          message: error?.message,
          status: error?.error?.status ?? 400,
          path: req.baseUrl,
          url: req.originalUrl,
          type: "Register user",
        })
      );
    }
  }
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) throw Error("Invalid Email or Password");
      const login = await this.authUseCase.login({
        email,
        password,
      });
      if (!login) throw Error("Invalid Email or Password");
      this.setCookies(res, {
        accessToken: login.accessToken!,
        refreshToken: login.refreshToken!,
      })
        .status(StatusCodes.ok)
        .json(login);
    } catch (error) {
      throw error;
    }
  }
  async socialLogin(req: Request, res: Response) {
    try {
      //FIXME
      const user = req.body;
      if (!user?.name || !user?.email) throw Error("Invalid User");
      const login = await this.authUseCase.socialLogin(
        user,
        user?.oAuthProvider,
        user?.oAuthId
      );

      if (!login) throw Error("Login Failed");
      this.setCookies(res, {
        accessToken: login.accessToken!,
        refreshToken: login.refreshToken!,
      })
        .status(StatusCodes.ok)
        .redirect("/api/v1/users");
    } catch (error) {
      throw error;
    }
  }
  async logout(req: Request, res: Response) {
    try {
      const user = await this.verifyToken(req);
      if (user) {
        await this.authUseCase.logout(user.id!);
      }
      this.clearCookies(res).redirect("/");
    } catch (error) {
      this.clearCookies(res).redirect("/");
    }
  }
  async verifyToken(req: Request): Promise<IUser | null> {
    try {
      const token = this.getToken(req, "refresh_token");
      const payload = this.authUseCase.decodeJWT(token);
      if (!payload) throw Error("Invalid Token");
      const { userId } = JSON.parse(payload);
      if (!userId) return null;
      const user = await this.userRepository.findById(userId);
      return user;
    } catch (error) {
      return null;
    }
  }

  private getTokenOptions() {
    const accessTokenOptions: CookieOptions = {
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
      httpOnly: true,
      secure: env.in_prod,
      path: "/",
    };
    const refreshTokenOptions: CookieOptions = {
      maxAge: 12 * 4 * 24 * 60 * 60 * 60 * 1000,
      sameSite: "strict",
      httpOnly: true,
      secure: env.in_prod,
      path: "/",
    };
    return { accessTokenOptions, refreshTokenOptions };
  }

  private setCookies(
    res: Response,
    { accessToken, refreshToken }: { refreshToken: string; accessToken: string }
  ) {
    const { accessTokenOptions, refreshTokenOptions } = this.getTokenOptions();
    res
      .cookie("access_token", accessToken, accessTokenOptions)
      .cookie("refresh_token", refreshToken, refreshTokenOptions);

    return res;
  }

  getToken(req: Request, tokenName: "access_token" | "refresh_token") {
    const token = req.cookies[tokenName];
    return token;
  }
  private clearCookies(res: Response) {
    const { accessTokenOptions, refreshTokenOptions } = this.getTokenOptions();
    res
      .clearCookie("access_token", { ...accessTokenOptions, maxAge: undefined })
      .clearCookie("refresh_token", {
        ...refreshTokenOptions,
        maxAge: undefined,
      });

    return res;
  }
}
const userRepositoryImpl = new UserRepositoryImpl(UserModel);
export const authControllers = new AuthControllers(userRepositoryImpl);
