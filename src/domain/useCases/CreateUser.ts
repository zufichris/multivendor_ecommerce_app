import { CreateUserDto } from "../../data/dto/user";
import { IUser } from "../../data/entities/user";
import { UserRepositoryImpl } from "../../data/orm/repository/UserRepositoryImpl";
import { IResponseData } from "../../global/entities";
import { StatusCodes } from "../../global/enums";
import { AppError } from "../../global/error";
import { BaseUseCase } from "../../global/usecase";

export class CreateUser
  implements BaseUseCase<Partial<IUser>, IResponseData<IUser>>
{
  constructor(private readonly userRepositoryImpl: UserRepositoryImpl) {}

  async execute(input: CreateUserDto): Promise<IResponseData<IUser>> {
    try {
      let newUser;
      const exist = await this.userRepositoryImpl.findByEmail(input.email);

      if (!exist) {
        newUser = await this.userRepositoryImpl.create({
          ...input,
          userName: input.email.split("@")[0],
        });
      }

      return {
        data: exist ?? newUser,
        message: newUser ? "User Created" : "User Exists",
        status: newUser ? StatusCodes.created : StatusCodes.ok,
        documentsModified: newUser ? 1 : 0,
        type: newUser ? "create user" : "Existing User",
      };
    } catch (error: any) {
      throw new AppError(error);
    }
  }
}
