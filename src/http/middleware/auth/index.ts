import { NextFunction, Request, Response } from "express";
import { IAuthUseCaseRepository } from "../../../domain/auth/repository";
import RoleUseCase from "../../../domain/role/use-case";
import { AppError } from "../../../global/error";
import { AuthContext } from "../../../global/use-case";
import { EStatusCodes } from "../../../global/enum";
import { getPermission, hasRequiredPermissions } from "../../../util/functions";
import { EPermissionResource, EPermissionValue, TRolePermission } from "../../../data/entity/role";
import AuthUseCase from "../../../domain/auth/use-case";
import { UserRepositoryImpl } from "../../../data/orm/repository-implementation/user";
import { UserModel } from "../../../data/orm/model/user";
import { CreateUserUseCase } from "../../../domain/user/use-case/create-user";
import { RoleModel } from "../../../data/orm/model/role";
import { RoleRepositoryImpl } from "../../../data/orm/repository-implementation/role";
import { z } from "zod";

export class AuthMiddleWare {
  constructor(
    private readonly authUseCase: IAuthUseCaseRepository,
    private readonly roleUseCase: RoleUseCase
  ) {
    this.requireAuth = this.requireAuth.bind(this);
    this.requirePermission = this.requirePermission.bind(this);
  }

  async requireAuth(req: Request, _: Response, next: NextFunction) {
    try {
      const token = this.getToken(req, "access_token");
      if (!token) {
        throw new AppError({
          message: "Authentication required",
          type: "Auth Error",
          statusCode: 401,
        });
      }
      if (!token.startsWith("Bearer ")) {
        throw new AppError({
          message: "Invalid authentication format",
          type: "Auth Error",
          statusCode: 401,
        });
      }
      const decoded = this.authUseCase.decodeJWT(token.split(" ")[1]);
      if (!decoded) {
        throw new AppError({
          message: "Invalid token",
          type: "Auth Error",
          statusCode: 401,
        });
      }
      req.user = decoded as AuthContext;
      next();
    } catch (error) {
      next(
        new AppError({
          message: "Authentication failed",
          type: "Auth Error",
          statusCode: 401,
        })
      );
    }
  }
  requirePermission(resource: z.infer<typeof EPermissionResource>, action: z.infer<typeof EPermissionValue>) {
    return async (req: Request, _: Response, next: NextFunction) => {
      try {
    const requiredPermission = getPermission(resource, action)
        if (!req.user?.userId || !req.user.roles || req.user.roles.length === 0) {
          throw new AppError({ message: "Unauthorized", statusCode: EStatusCodes.enum.unauthorized });
        }
        const userPermissions = await this.getUserPermissions(req.user);
        req.user.permissions = userPermissions;
        if (!hasRequiredPermissions(requiredPermission, userPermissions)) {
          throw new AppError({
            message: "Forbidden: insufficient permissions",
            statusCode: EStatusCodes.enum.forbidden,
          });
        }
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  private async getUserPermissions(context: Partial<AuthContext>): Promise<TRolePermission[]> {
    if (!context.userId || !context.roles || context.roles.length === 0) {
      throw new Error("Unauthorized Access");
    }
    const rolesData = await this.roleUseCase.query.execute({
      filter: { name: { "$in": context.roles } }
    });
    if (!rolesData.success) {
      throw new Error(rolesData.error);
    }
    const permissionSet = new Set<TRolePermission>();
    rolesData.data.data.forEach(role => {
      role.permissions.forEach(permission => {
        permissionSet.add(permission);
      });
    });
    const permissions = Array.from(permissionSet)
    if (!permissions.length) {
      throw new Error("Insufficient Permissions to perform this action");
    }
    return permissions;
  }

  private getToken(req: Request, tokenName: "access_token" | "refresh_token") {
    return req.cookies[tokenName] || req.headers.authorization;
  }
}


const userRepository = new UserRepositoryImpl(UserModel)
const createUser = new CreateUserUseCase(userRepository)
const authUseCase = new AuthUseCase(userRepository, createUser)
const roleUseCase = new RoleUseCase(new RoleRepositoryImpl(RoleModel))
export const authMiddleware = new AuthMiddleWare(authUseCase, roleUseCase)