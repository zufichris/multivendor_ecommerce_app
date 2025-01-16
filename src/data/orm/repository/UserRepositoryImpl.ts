import { IUser } from "../../entities/user";
import { IBaseRepository } from "../../../global/repository";
import { UserModel } from "../models/user";
import { AppError } from "../../../global/error";
import { StatusCodes } from "../../../global/enums";
import { ID } from "../../../global/entities";
import {
  Document,
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  Types,
} from "mongoose";
import { toArray } from "../../../utils/functions";

export class UserRepositoryImpl implements IBaseRepository<IUser> {
  constructor(private readonly model: typeof UserModel) {}
  async create(data: IUser): Promise<IUser> {
    try {
      const newUser = await this.model.create(data);
      return newUser as IUser;
    } catch (error: any) {
      throw new AppError({
        message: "Error creating user",
        type: "Insert users",
        description: error.message,
        fieldsModified: 0,
        status: StatusCodes.notModified,
      });
    }
  }
  async findById(id: ID): Promise<IUser> {
    try {
      const user = await this.model.findById(id);
      return user as IUser;
    } catch (error: any) {
      throw new AppError({
        message: "Error getting user",
        type: "Find user",
        description: error.message,
        fieldsModified: 0,
        status: StatusCodes.notFound,
      });
    }
  }
  async findByEmail(email: string): Promise<IUser> {
    try {
      const user = await this.model.findOne({ email });
      return user as IUser;
    } catch (error: any) {
      throw new AppError({
        message: "Error getting user",
        type: "Find user",
        description: error.message,
        fieldsModified: 0,
        status: StatusCodes.notFound,
      });
    }
  }
  async count(filter?: FilterQuery<IUser> | undefined): Promise<number> {
    try {
      const number = await this.model.countDocuments(filter);
      return number;
    } catch (error) {
      throw error;
    }
  }
  async query(
    filter?: FilterQuery<IUser> | undefined,
    projection?: ProjectionType<IUser>,
    options?:
      | QueryOptions<
          Model<
            IUser,
            {},
            {},
            {},
            Document<unknown, {}, IUser> &
              IUser & { _id: Types.ObjectId } & { __v?: number },
            any
          >
        >
      | undefined
  ): Promise<IUser[]> {
    try {
      const users = await this.model.find(filter ?? {}, projection, options);
      return toArray<IUser>(users);
    } catch (error) {
      throw error;
    }
  }
async update(id:ID,data: Partial<IUser> | IUser[]): Promise<IUser> {
    try {
      const updated=await this.model.findByIdAndUpdate(id,data,
        {
          new:true
        }
      )
      return updated
    } catch (error) {
      throw error
    }
  }
}
