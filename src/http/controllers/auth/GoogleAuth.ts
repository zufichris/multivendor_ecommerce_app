import QueryString from "qs";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../global/error";
import { IUser } from "../../../data/entities/user";
import { AuthTypes, OAuthProviders } from "../../../data/enums/auth";

export class GoogleAuth {
  constructor(
    private readonly options: {
      clientId: string;
      clientSecret: string;
      redirectUri: string;
      accessType?: string;
      responseType: string;
      prompt: string;
      scope: string[];
      codeAccessUrl: string;
      tokenAccessUrl: string;
      profileAccessUrl: string;
      grantType: string;
    }
  ) {}
  async authRequest(res: Response) {
    try {
      const options = QueryString.stringify({
        client_id: this.options.clientId,
        redirect_uri: this.options.redirectUri,
        access_type: this.options.accessType,
        response_type: this.options.responseType,
        prompt: this.options.prompt,
        scope: this.options.scope.join(" "),
      });
      const url = `${this.options.codeAccessUrl}?${options}`;
      res.redirect(url);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getTokens(req: Request, res: Response, next: NextFunction) {
    try {
      const query = QueryString.stringify({
        code: req.query.code,
        client_id: this.options.clientId,
        client_secret: this.options.clientSecret,
        redirect_uri: this.options.redirectUri,
        grant_type: this.options.grantType,
      });
      if (!req.query.code)
        throw new AppError({
          message: "Invalid Google Code",
          type: "Auth Error",
        });
      const url = `${this.options.tokenAccessUrl}?${query}`;

      const response = await fetch(url, {
        method: "POST",
      });

      const data = await response.json();
      req.body = data;
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async getUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { access_token, refresh_token, expires_in, id_token, token_type } =
        req.body;
      const response = await fetch(
        `${this.options.profileAccessUrl}?alt=json&access_token=${access_token}`,
        {
          headers: {
            Authorization: `${token_type} ${id_token}`,
          },
        }
      );
      const profile = await response.json();
      const userData: IUser = {
        name: profile.name,
        email: profile.email,
        authType: AuthTypes.OAuth,
        avatar: profile.picture,
        oAuthId: profile.id,
        oAuthProvider: OAuthProviders.Google,
        userName: profile.name,
        verified: profile?.verified,
      };
      req.body = userData;
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
