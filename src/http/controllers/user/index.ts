import { Request, Response, NextFunction } from "express";
import { CreateUserUseCase } from "../../../domain/users/usecase/CreateUser";
import { QueryUsersUseCase } from "../../../domain/users/usecase/QueryUsers";
import { GetUserUseCase } from "../../../domain/users/usecase/GetUser";
import { ChangeUserStatusUseCase } from "../../../domain/users/usecase/ChangeUserStatus";
import { ChangeUserRoleUseCase } from "../../../domain/users/usecase/ChangeUserRole";
import { UpdateUserUseCase } from "../../../domain/users/usecase/UpdateUser";
import { validateData } from "../../../utils/functions";
import { CreateUserDTO, CreateUserSchema, UpdateUserDTO, UpdateUserSchema } from "../../../data/dto/user";
import { EStatusCodes } from "../../../global/enums";
import { IQueryFilters, IResponseData, IResponseDataPaginated } from "../../../global/entities";
import { TUser } from "../../../data/entities/user";
import { UserRepositoryImpl } from "../../../data/orm/repositoryImpl/user";
import { UserModel } from "../../../data/orm/models/user";
import { AddressModel } from "../../../data/orm/models/address";
import { AddAddressUseCase, GetAddressesUseCase, UpdateAddressUseCase } from "../../../domain/users/usecase/Addresses";
import { AddressSchema, TAddress } from "../../../data/entities/address";

export class UserControllers {
  constructor(
    private readonly createUseCase: CreateUserUseCase,
    private readonly queryCase: QueryUsersUseCase,
    private readonly getCase: GetUserUseCase,
    private readonly changeStatusCase: ChangeUserStatusUseCase,
    private readonly changeRoleCase: ChangeUserRoleUseCase,
    private readonly updateCase: UpdateUserUseCase,
    private readonly addAddressCase: AddAddressUseCase,
    private readonly updateAddressCase: UpdateAddressUseCase,
    private readonly getAddressesCase: GetAddressesUseCase
  ) {
    this.queryUsers = this.queryUsers.bind(this)
    this.createUser = this.createUser.bind(this)
    this.getMe = this.getMe.bind(this)
    this.getUser = this.getUser.bind(this)
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

  async queryUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const query = this.generateUserQuery(req.query)
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
      const custId = req.params.custId;
      const result = await this.getCase.execute({ custId }, { roles: req.user?.roles!, userId: req.user?.id! });
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
  async getAddresses(req: Request, res: Response, next: NextFunction) {
    try {
      const { custId } = req.params;
      if (!custId) {
        const data = {
          ...this.generateMetadata(req, "Customer ID is required"),
          status: EStatusCodes.enum.badRequest,
          success: false,
        };
        res.status(data.status).json(data);
        return;
      }
      const { page = 1, limit = 5, type = undefined } = req.query
      const filter: { type?: string, custId: string } = {
        type: type?.toString(),
        custId
      }
      if (!filter.type)
        delete filter.type

      const result = await this.getAddressesCase.execute({
        filter
      });
      if (!result.success) {
        const data = {
          ...this.generateMetadata(req, result.error ?? "Failed to retrieve addresses"),
          status: result.status ?? EStatusCodes.enum.notFound,
          success: false,
        };
        res.status(data.status).json(data);
        return;
      }

      const data: IResponseDataPaginated<TAddress> = {
        ...this.generateMetadata(req, "Addresses retrieved successfully"),
        status: EStatusCodes.enum.ok,
        success: true,
        ...result.data,
      };
      res.status(data.status).json(data);
    } catch (error) {
      next(error);
    }
  }
  async updateAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const validate = validateData<TAddress>(req.body, AddressSchema);
      if (!validate.success) {
        const data = {
          ...this.generateMetadata(req, "Validation Failed"),
          status: EStatusCodes.enum.badRequest,
          success: false,
        };
        res.status(data.status).json(data);
        return;
      }

      const result = await this.updateAddressCase.execute(validate.data);
      if (!result.success) {
        const data = {
          ...this.generateMetadata(req, result.error ?? "Failed to update address"),
          status: result.status ?? EStatusCodes.enum.conflict,
          success: false,
        };
        res.status(data.status).json(data);
        return;
      }

      const data: IResponseData<TAddress> = {
        ...this.generateMetadata(req, "Address updated successfully"),
        status: EStatusCodes.enum.ok,
        success: true,
        data: result.data,
      };
      res.status(data.status).json(data);
    } catch (error) {
      next(error);
    }
  }
  async addAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const validate = validateData<TAddress>(req.body, AddressSchema);
      if (!validate.success) {
        const data = {
          ...this.generateMetadata(req, "Validation Failed"),
          status: EStatusCodes.enum.badRequest,
          success: false,
        };
        res.status(data.status).json(data);
        return;
      }

      const result = await this.addAddressCase.execute(validate.data);
      if (!result.success) {
        const data = {
          ...this.generateMetadata(req, result.error ?? "Failed to add address"),
          status: result.status ?? EStatusCodes.enum.conflict,
          success: false,
        };
        res.status(data.status).json(data);
        return;
      }

      const data: IResponseData<TAddress> = {
        ...this.generateMetadata(req, "Address added successfully"),
        status: EStatusCodes.enum.ok,
        success: true,
        data: result.data,
      };
      res.status(data.status).json(data);
    } catch (error) {
      next(error);
    }
  }
  async getMeAddress(req: Request, res: Response, next: NextFunction) {
    try {
      req.params.custId = req.user?.custId!
      await this.getAddresses(req, res, next)
    } catch (error) {
      next(error);
    }
  }

  async addMeAddress(req: Request, res: Response, next: NextFunction) {
    try {
      req.params.custId = req.user?.custId!
      await this.addAddress(req, res, next)
    } catch (error) {
      next(error);
    }
  }

  async updateMeAddress(req: Request, res: Response, next: NextFunction) {
    try {
      req.params.custId = req.user?.custId!
      await this.updateAddress(req, res, next)
    } catch (error) {
      next(error);
    }
  }

  async getUserStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { custId } = req.params;
      if (!custId) {
        const data = {
          ...this.generateMetadata(req, "User ID is required"),
          status: EStatusCodes.enum.badRequest,
          success: false,
        };
        res.status(data.status).json(data);
        return;
      }
      const result = await this.getCase.execute({ custId: custId.toString() }, {
        roles: req.user?.roles!,
        userId: req.user?.id!
      });
      if (!result.success) {
        const data = {
          ...this.generateMetadata(req, result.error ?? "Failed to retrieve user stats"),
          status: result.status ?? EStatusCodes.enum.notFound,
          success: false,
        };
        res.status(data.status).json(data);
        return;
      }

      const data: IResponseData<TUser> = {
        ...this.generateMetadata(req, "User stats retrieved successfully"),
        status: EStatusCodes.enum.ok,
        success: true,
        data: result.data,
      };
      res.status(data.status).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getMeStats(req: Request, res: Response, next: NextFunction) {
    try {
      req.params.custId = req.user?.custId!
      await this.getUserStats(req, res, next)
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
  private generateUserQuery(query: qs.ParsedQs) {
    let {
      page = 1,
      limit = 10,
      sort_order = "asc",
      sort_by = "firstName"
    } =
      query;
    if (sort_by === 'name') {
      sort_by = 'firstName'
    }
    const sortByStr = String(sort_by);
    const sortOrderStr = String(sort_order);
    const sort = { [sortByStr]: sortOrderStr === 'desc' ? -1 : 1 }
    const searchTerm = typeof query.search === 'string' ? query.search : '';
    const search = searchTerm ? {
      $or: [
        { email: { $regex: searchTerm, $options: 'i' } },
        { firstName: { $regex: searchTerm, $options: 'i' } },
        { lastName: { $regex: searchTerm, $options: 'i' } }
      ]
    } : undefined;
    const filter = search ?? {
      isActive: !query.show_inactive ? true : { "$in": [true, false] },
    }

    const queryOptions = {
      sort
    }
    const projection = {
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
    }

    const options: IQueryFilters<TUser> = {
      filter,
      limit: Number(limit ?? 10),
      page: Number(page ?? 1),
      projection,
      queryOptions
    }
    return options
  }
}
const userRepository = new UserRepositoryImpl(UserModel, AddressModel)
export const userControllers = new UserControllers(
  new CreateUserUseCase(userRepository),
  new QueryUsersUseCase(userRepository),
  new GetUserUseCase(userRepository),
  new ChangeUserStatusUseCase(userRepository),
  new ChangeUserRoleUseCase(userRepository),
  new UpdateUserUseCase(userRepository),
  new AddAddressUseCase(userRepository),
  new UpdateAddressUseCase(userRepository),
  new GetAddressesUseCase(userRepository))