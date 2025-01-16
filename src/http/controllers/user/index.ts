import { Request, Response } from "express";
import { CreateUser } from "../../../domain/useCases/CreateUser";
import { UserRepositoryImpl } from "../../../data/orm/repository/UserRepositoryImpl";
import { UserModel } from "../../../data/orm/models/user";
import { IResponseData } from "../../../global/entities";
import { StatusCodes } from "../../../global/enums";
import { CreateUserDto } from "../../../data/dto/user";
import { AppError } from "../../../global/error";
import { QueryUsers } from "../../../domain/useCases/QueryUsers";


class Controllers {
  private readonly createUserUseCase: CreateUser;
  private readonly queryUsersUseCase: QueryUsers;

  constructor(private readonly userRepositoryImpl: UserRepositoryImpl) {
    this.createUserUseCase = new CreateUser(userRepositoryImpl);
    this.queryUsersUseCase = new QueryUsers(userRepositoryImpl);
  }

  async createUser(req: Request, res: Response) {
    try {
      const body = req.body;
      const userData: CreateUserDto = {
        email: body.email,
        name: body.name,
        ...body,
      };
      const error = new AppError({
        message: "Data Validation Failed Invalid Data",
        errors: [],
        type: "create user",
        status: StatusCodes.badRequest,
      });
      if (!userData.name)
        error.error.errors?.push({ name: "Name is Required" });
      if (!userData.email)
        error.error.errors?.push({ email: "Email is Required" });

      if (error.error.errors?.length) throw error;

      const result = await this.createUserUseCase.execute(userData);
      res.status(result.status).redirect("/api/v1/users");
    } catch (err: any) {
      const error: IResponseData<null> = {
        message: "Error Creating User",
        status: err?.error?.status ?? StatusCodes.badGateway,
        type: "create user",
        data: null,
        ...err,
      };
      res.status(error.status).json(err);
    }
  }
  async queryUsers(req: Request, res: Response) {
    try {
      const query = req.query;
      const page = isNaN(Number(query.page)) ? 1 : Number(query.page);
      const limit = isNaN(Number(query.limit)) ? 1 : Number(query.limit);
      delete query?.limit;
      delete query?.page;
      const result = await this.queryUsersUseCase.execute(query, {
        page,
        limit,
      });
      const userCards = result.data
        .map(
          (user) => `
        <div class="card">
           ${
             user.avatar
               ? ` <img src="${user.avatar}" alt="${user.name}'s avatar">`
               : `<div class="fake-av-con">
               <h2 class="fake-av">${(
                 user.name?.charAt(0) + user.name.charAt(1)
               ).toUpperCase()}</h2>
               </div>`
           }
            <h2>${user.name}</h2>
            <p><strong>Username:</strong> ${user.userName}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p class="${user.verified ? "verified" : "not-verified"}">
                <strong>Verified:</strong> ${user.verified ? "Yes" : "No"}
            </p>
            <p><strong>Created At:</strong> ${user.createdAt?.toLocaleString()}</p>
            <p><strong>Updated At:</strong> ${user.updatedAt?.toLocaleString()}</p>
        </div>
    `
        )
        .join("");
      const prevButton =
        result.page > 1
          ? `<a href="/api/v1/users?page=${
              result.page - 1
            }" class="btn">Previous</a>`
          : "";
      const nextButton =
        result.page < result.totalCount!
          ? `<a href="/api/v1/users?page=${
              result.page + 1
            }" class="btn">Next</a>`
          : "";

      res.status(StatusCodes.ok).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login-Lynx - User List</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 20px;
                }
                h1 {
                    text-align: center;
                    color: #333;
                }
                .card-container {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 20px;
                    margin-top: 20px;
                }
                .card {
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                    width: 250px;
                    text-align: center;
                }
                .card img  {
                    border-radius: 50%;
                    width: 80px;
                    height: 80px;
                    object-fit: cover;
                    margin-bottom: 15px;
                }
                .card h2 {
                    font-size: 1.5em;
                    margin: 10px 0;
                }
                .card p {
                    margin: 5px 0;
                }
                    .fake-av{
                    color: orange;
                    height:80px;
                    width:80px;
                    border-radius:50%;
                    background-color:grey;
                     display:flex;
                      justify-content:center;
                      align-items:center;
                    }
                    .fake-av-con{
                      width:100%;
                      display:flex;
                      justify-content:center;
                    }
                .verified {
                    color: green;
                }
                .not-verified {
                    color: red;
                }
                .pagination {
                    text-align: center;
                    margin-top: 20px;
                }
                .pagination a {
                    padding: 10px 15px;
                    margin: 0 5px;
                    background-color: #3498db;
                    color: white;
                    text-decoration: none;
                    border-radius: 4px;
                }
                .pagination a:hover {
                    background-color: #2980b9;
                }
                .pagination a.disabled {
                    background-color: #ccc;
                    pointer-events: none;
                }
            </style>
        </head>
        <body>
            <h1>User List</h1>
            <div class="card-container">
                ${userCards}
            </div>
            <div class="pagination">
                ${prevButton}
                ${nextButton}
            </div>
        </body>
        </html>
    `);
    } catch (err: any) {
      const error: IResponseData<null> = {
        message: "Error Getting Users",
        status: err?.error?.status ?? StatusCodes.badGateway,
        type: "query users",
        data: null,
        ...err,
      };
      throw new AppError(error);
    }
  }
}

export const userControllers = new Controllers(
  new UserRepositoryImpl(UserModel)
);
