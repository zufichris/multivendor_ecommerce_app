import { Request, Response, NextFunction } from "express";
import { CreateUserUseCase } from "../../../domain/users/useCases/CreateUser";
import { QueryUsersUseCase } from "../../../domain/users/useCases/QueryUsers";
import { GetUserUseCase } from "../../../domain/users/useCases/GetUser";
import { ChangeUserStatusUseCase } from "../../../domain/users/useCases/ChangeUserStatus";
import { ChangeUserRoleUseCase } from "../../../domain/users/useCases/ChangeUserRole";
import { UpdateUserUseCase } from "../../../domain/users/useCases/UpdateUser";
import { validateData } from "../../../utils/functions";
import { CreateUserDTO, CreateUserSchema, UpdateUserDTO, UpdateUserSchema } from "../../../data/dto/user";
import { EStatusCodes } from "../../../global/enums";
import { IResponseData, IResponseDataPaginated } from "../../../global/entities";
import { TUser } from "../../../data/entities/user";
import { UserRepositoryImpl } from "../../../data/orm/repositoryImpl/user";
import { UserModel } from "../../../data/orm/models/user";

export class UserControllers {
  constructor(
    private readonly createUseCase: CreateUserUseCase,
    private readonly queryCase: QueryUsersUseCase,
    private readonly getCase: GetUserUseCase,
    private readonly changeStatusCase: ChangeUserStatusUseCase,
    private readonly changeRoleCase: ChangeUserRoleUseCase,
    private readonly updateCase: UpdateUserUseCase
  ) { }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      let data: IResponseData<TUser | null> = {
        path: req.path,
        url: req.url,
        type: "Create User",
        status: EStatusCodes.enum.badRequest,
        success: false,
        message: "Validation Failed",
        data: null,
        errors: [],
      };

      const validate = validateData<CreateUserDTO>(req.body, CreateUserSchema);
      if (!validate.success) {
        data.errors = [{ validation: validate.error }];
        res.status(data.status).json(data);
        return
      }

      const result = await this.createUseCase.execute(validate.data);
      if (!result.success) {
        data.status = EStatusCodes.enum.conflict;
        data.message = "User creation conflict";
        data.errors = [{ conflict: result.error }];
        res.status(data.status).json(data);
        return
      }

      data.status = EStatusCodes.enum.created;
      data.success = true;
      data.message = "User created successfully";
      data.data = result.data;
      res.status(data.status).json(data);

    } catch (error) {
      next(error);
    }
  }

  async queryUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const result = await this.queryCase.execute({ page: Number(page), limit: Number(limit) });
      if (!result.success) {
        res.status(EStatusCodes.enum.internalServerError).json({
          message: "Failed to query users",
          status: EStatusCodes.enum.internalServerError,
        });
        return
      }

      const data: IResponseDataPaginated<TUser> = {
        data: result.data.data,
        page: result.data.page,
        limit: result.data.limit,
        filterCount: result.data.filterCount,
        totalCount: result.data.totalCount,
        status: EStatusCodes.enum.ok,
        message: "Users retrieved successfully",
        success: true
      };

      res.status(data.status).json(data);

    } catch (error) {
      next(error);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const result = await this.getCase.execute({ userId });
      if (!result.success) {
        res.status(EStatusCodes.enum.notFound).json({
          message: `User with ID ${userId} not found`,
          status: EStatusCodes.enum.notFound,
        });
        return
      }

      const data: IResponseData<TUser> = {
        data: result.data,
        status: EStatusCodes.enum.ok,
        message: "User retrieved successfully",
        success: true
      };

      res.status(data.status).json(data);

    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      let data: IResponseData<unknown> = {
        path: req.path,
        url: req.url,
        type: "Update User",
        success: false,
        message: "Update User Failed",
        status: EStatusCodes.enum.badRequest,
        data: null,
      }

      const validate = validateData<UpdateUserDTO>(req.body, UpdateUserSchema);
      if (!validate.success) {
        data = {
          ...data,
          message: "Validation Failed",
          errors: [{ validation: validate.error }],
          status: EStatusCodes.enum.badRequest,
          data: null,
          success: false,
        };
        res.status(data.status).json(data);
        return
      }

      const result = await this.updateCase.execute(validate.data, {
        roles: req.user?.roles!,
        userId: req.user?.userId!
      });
      if (!result.success) {
        data.status = EStatusCodes.enum.conflict;
        data.message = "User update conflict";
        data.errors = [{ conflict: result.error }];
        res.status(data.status).json(data);
        return
      }

      data.status = EStatusCodes.enum.ok;
      data.success = true;
      data.message = "User updated successfully";
      data.data = result.data;
      res.status(data.status).json(data);

    } catch (error) {
      next(error);
    }
  }

  async changeUserStatus(req: Request, res: Response, next: NextFunction) {
    try {

      const result = await this.changeStatusCase.execute({
        userId: req.user?.userId!,
        isActive: true
      }, {
        roles: req.user?.roles!,
        userId: req.user?.userId!
      });
      if (!result.success) {
        res.status(EStatusCodes.enum.badRequest).json({
          message: "Failed to change user status",
          status: EStatusCodes.enum.badRequest,
        });
        return
      }

      const data: IResponseData<TUser> = {
        data: result.data,
        status: EStatusCodes.enum.ok,
        message: "User status updated successfully",
        success: true
      };

      res.status(data.status).json(data);

    } catch (error) {
      next(error);
    }
  }

  async changeUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const role = req.body.role;

      const result = await this.changeRoleCase.execute({ userId, roles: role }, {
        userId: req.user?.userId!,
        roles: req.user?.roles!
      });
      if (!result.success) {
        res.status(EStatusCodes.enum.badRequest).json({
          message: "Failed to change user role",
          status: EStatusCodes.enum.badRequest,
        });
        return
      }

      const data: IResponseData<TUser> = {
        data: result.data,
        status: EStatusCodes.enum.ok,
        message: "User role updated successfully",
        success: true
      };

      res.status(data.status).json(data);

    } catch (error) {
      next(error);
    }
  }
}
const userRepository = new UserRepositoryImpl(UserModel)
export const userControllers = new UserControllers(
  new CreateUserUseCase(userRepository),
  new QueryUsersUseCase(userRepository),
  new GetUserUseCase(userRepository),
  new ChangeUserStatusUseCase(userRepository),
  new ChangeUserRoleUseCase(userRepository),
  new UpdateUserUseCase(userRepository)
)