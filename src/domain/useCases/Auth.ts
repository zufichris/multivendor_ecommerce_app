import { compare, genSalt, hash } from "bcrypt";
import { UserRepositoryImpl } from "../../data/orm/repository/UserRepositoryImpl";
import { ID } from "../../global/entities";
import { sign, verify } from "jsonwebtoken";
import { env } from "../../config/env";
import { AuthTypes, OAuthProviders } from "../../data/enums/auth";
import { CreateUserDto } from "../../data/dto/user";
import { AppError } from "../../global/error";
import { StatusCodes } from "../../global/enums";

export class Auth {
  constructor(private readonly userRepositoryImpl: UserRepositoryImpl) {}

  async register({
    email,
    name,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    try {
      const exist = await this.userRepositoryImpl.findByEmail(email);
      if (exist) throw Error("User Already Exists");
      const hashedPassword = await this.hashPassword(password);
      await this.userRepositoryImpl.create({
        email,
        name,
        password: hashedPassword,
        authType: AuthTypes.EmailAndPassword,
      });
      //FIXME
      const loggedIn = await this.login({ email, password });
      return loggedIn;
    } catch (error: any) {
      throw new AppError({
        message: error?.message,
        status: StatusCodes.badRequest,
      });
    }
  }
  async login({ email, password }: { email: string; password: string }) {
    try {
      const exists = await this.userRepositoryImpl.findByEmail(email);
      if (!exists) throw new Error("User does not exists");
      const matched = await this.verifyPassword(password, exists.password!);
      if (!matched) throw new Error("Invalid Email or Password");

      const tokens = this.generateTokens(exists.id!);
      const loggedIn = await this.userRepositoryImpl.update(exists.id!, tokens);
      return loggedIn;
    } catch (error) {
      throw error;
    }
  }
  async socialLogin(
    data: CreateUserDto,
    provider: OAuthProviders,
    oAuthId?: string
  ) {
    try {
      let exists = await this.userRepositoryImpl.findByEmail(data.email);
      if (!exists)
        exists = await this.userRepositoryImpl.create({
          ...data,
          oAuthProvider: provider,
          oAuthId,
        });
      const tokens = this.generateTokens(exists.id!);
      const loggedIn = await this.userRepositoryImpl.update(exists.id!, tokens);
      return loggedIn;
    } catch (error) {
      throw error;
    }
  }
  async logout(userId: ID): Promise<void> {
    try {
      await this.userRepositoryImpl.update(userId, {
        accessToken: undefined,
        refreshToken: undefined,
      });
    } catch (error) {
      throw error;
    }
  }
  async resetPassword(userId: ID) {}
  async verifyAccount(userId: ID) {}
  private async hashPassword(password: string): Promise<string> {
    if (password === "") return "";
    const salt = await genSalt(10);
    const hashed = hash(password, salt);
    return hashed;
  }
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const matched = await compare(password, hash);
    return matched;
  }
  private signJWT(payload: { userId: ID }, expiresIn: number): string {
    const token = sign(payload, env.jwt_secret, {
      expiresIn: expiresIn,
    });
    return token;
  }
  decodeJWT(token: string): string | null {
    try {
      const user = verify(token, env.jwt_secret);
      return JSON.stringify(user);
    } catch (error) {
      return null;
    }
  }
  private generateTokens(userId: ID): {
    refreshToken: string;
    accessToken: string;
  } {
    try {
      const refreshToken = this.signJWT({ userId }, 12 * 4 * 7 * 24 * 60 * 60);
      const accessToken = this.signJWT({ userId }, 24 * 60 * 60);
      return { refreshToken, accessToken };
    } catch (error) {
      throw error;
    }
  }
}
