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
import { IQueryFilters, IResponseData, IResponseDataPaginated } from "../../../global/entities";
import { TUser } from "../../../data/entities/user";
import { UserRepositoryImpl } from "../../../data/orm/repositoryImpl/user";
import { UserModel } from "../../../data/orm/models/user";
import { AddressModel } from "../../../data/orm/models/address";

export class UserControllers {
  constructor(
    private readonly createUseCase: CreateUserUseCase,
    private readonly queryCase: QueryUsersUseCase,
    private readonly getCase: GetUserUseCase,
    private readonly changeStatusCase: ChangeUserStatusUseCase,
    private readonly changeRoleCase: ChangeUserRoleUseCase,
    private readonly updateCase: UpdateUserUseCase
  ) {
    this.queryUsers = this.queryUsers.bind(this)
    this.createUser = this.createUser.bind(this)
    this.getMe = this.getMe.bind(this)
  }
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        const data = {
          ...this.generateMetadata(req, "Not Found"),
          status: EStatusCodes.enum.notFound,
          success: false,
        }
        res.status(data.status).json(data)
        return
      }

      const data: IResponseData<TUser> = {
        ...this.generateMetadata(req, "User retrieved successfully"),
        data: req.user as TUser,
        status: EStatusCodes.enum.ok,
        success: true
      };
      res.status(data.status).json(data);
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {


      const validate = validateData<CreateUserDTO>(req.body, CreateUserSchema);
      if (!validate.success) {
        const data = {
          ...this.generateMetadata(req, "Validation Failed"),
          status: EStatusCodes.enum.badRequest,
          success: false,
          description: validate.error
        }
        res.status(data.status).json(data);
        return
      }

      const result = await this.createUseCase.execute(validate.data);
      if (!result.success) {
        const data = {
          ...this.generateMetadata(req, result.error),
          status: EStatusCodes.enum.badRequest,
          success: false,
          description: result.error,
        }
        res.status(data.status).json(data);
        return
      }

      const data: IResponseData<TUser> = {
        ...this.generateMetadata(req, "User Created Successfully"),
        status: EStatusCodes.enum.badRequest,
        success: true,
        data: result.data,
      }
      res.status(data.status).json(data);
    } catch (error) {
      next(error);
    }
  }
  private generateQuery(query: qs.ParsedQs) {
    const {
      page = 1,
      limit = 10,
    } =
      query;
    const filters: IQueryFilters<TUser> = {
      filter: {
        isActive: !query.show_inactive ? true : { "$in": [true, false] },
      },
      limit: Number(limit ?? 10),
      page: Number(page ?? 1),
      projection: {
        firstName: true,
        lastName: true,
        createdAt: true,
        custId: true,
        email: true,
        id: true,
        phoneNumber: true,
        profilePictureUrl: true,
        isActive: true,
        updatedAt: true
      },
    }
    return filters
  }
  async queryUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const query = this.generateQuery(req.query)
      const result = await this.queryCase.execute(query, {
        roles: req.user?.roles!,
        userId: req.user?.id!
      });
      if (!result.success) {
        const data = {
          ...this.generateMetadata(req, result.error),
          status: result.status ?? EStatusCodes.enum.badGateway,
          success: false
        }
        res.status(data.status).json(data);
        return
      }
      const data: IResponseDataPaginated<TUser> = {
        ...this.generateMetadata(req, "User query successful"),
        success: true,
        status: EStatusCodes.enum.ok,
        ...result.data
      }
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
        const data = {
          ...this.generateMetadata(req, result.error ?? "User Not Found"),
          status: result.status ?? EStatusCodes.enum.notFound,
          success: false
        }
        res.status(data.status).json(data);
        return
      }

      const data: IResponseData<TUser> = {
        ...this.generateMetadata(req, "User retrieved successfully"),
        data: result.data,
        status: EStatusCodes.enum.ok,
        success: true
      };

      res.status(data.status).json(data);

    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const validate = validateData<UpdateUserDTO>(req.body, UpdateUserSchema);
      if (!validate.success) {
        const data = {
          ...this.generateMetadata(req, "Validation Failed"),
          status: EStatusCodes.enum.badRequest,
          success: false,
        };
        res.status(data.status).json(data);
        return
      }

      const result = await this.updateCase.execute(validate.data, {
        roles: req.user?.roles!,
        userId: req.user?.id!
      });
      if (!result.success) {
        const data = {
          ...this.generateMetadata(req, result.error ?? "User update conflict"),
          success: false,
          status: result.status ?? EStatusCodes.enum.conflict
        }
        res.status(data.status).json(data);
        return
      }
      const data: IResponseData<TUser> = {
        ...this.generateMetadata(req, "User updated successfully"),
        status: EStatusCodes.enum.ok,
        success: true,
        data: result.data
      }
      res.status(data.status).json(data);
    } catch (error) {
      next(error);
    }
  }

  async changeUserStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const toChangeId = req.params.userId
      const result = await this.changeStatusCase.execute({
        userId: toChangeId,
        isActive: true
      }, {
        roles: req.user?.roles!,
        userId: req.user?.id!
      });
      if (!result.success) {
        const data = {
          ...this.generateMetadata(req, result.error ?? "Failed to change user status"),
          status: result.status ?? EStatusCodes.enum.badGateway,
          success: false
        }
        res.status(data.status).json(data);
        return
      }

      const data: IResponseData<TUser> = {
        ...this.generateMetadata(req, "User status updated successfully"),
        data: result.data,
        status: EStatusCodes.enum.ok,
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
        userId: req.user?.id!,
        roles: req.user?.roles!
      });
      if (!result.success) {
        const data = {
          ...this.generateMetadata(req, result.error ?? "Failed to change user role"),
          status: result.status ?? EStatusCodes.enum.badGateway,
          success: false
        }
        res.status(data.status).json(data);
        return
      }

      const data: IResponseData<TUser> = {
        ...this.generateMetadata(req, "User role updated successfully"),
        data: result.data,
        status: EStatusCodes.enum.ok,
        success: true
      };
      res.status(data.status).json(data);
    } catch (error) {
      next(error);
    }
  }

  private generateMetadata(req: Request, message: string, type?: string) {
    return ({
      url: req.url,
      path: req.path,
      type: type ?? "User",
      message,
      error: {
        message
      }
    })
  }
}
const userRepository = new UserRepositoryImpl(UserModel, AddressModel)
export const userControllers = new UserControllers(
  new CreateUserUseCase(userRepository),
  new QueryUsersUseCase(userRepository),
  new GetUserUseCase(userRepository),
  new ChangeUserStatusUseCase(userRepository),
  new ChangeUserRoleUseCase(userRepository),
  new UpdateUserUseCase(userRepository)
)