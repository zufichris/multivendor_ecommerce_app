import express from "express";
import cookieParser from "cookie-parser";
import router from "./http/routes/route_v1";
import { Start } from "./http/server/httpServer";
import { errorHandler, notFound } from "./http/middleware/error";
import { StatusCodes } from "./global/enums";
import { IUser } from "./data/entities/user";
import { authControllers } from "./http/controllers/auth";
import { DB } from "./config/dbConfig";
import { env } from "./config/env";
import { loggerMiddleware } from "./http/middleware/logger";
new DB(env.mongo_uri).connect();
const app = express();
app.use(express.json({}));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(loggerMiddleware)
app.get("/", async (req, res) => {
  const user = await authControllers.verifyToken(req);
  res.status(StatusCodes.ok).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Login-Lynx</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
            .container {
                background-color: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                text-align: center;
                max-width: 400px;
                width: 100%;
            }
            h1 {
                color: #333;
            }
            p {
                color: #555;
            }
            .btn {
                background-color: #007BFF;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                text-decoration: none;
                display: inline-block;
                margin-top: 20px;
            }
            .btn:hover {
                background-color: #0056b3;
            }
                img{
                height:80px;
                width:80px;
                border-radius:50%;
                }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Welcome to Login-Lynx</h1>
            <p>Your one-stop solution for easy and secure login!</p>
          <hr/>
            ${user
      ? `<div>
                  <img src="${user?.avatar}"/>
                <h3>You Are Live ${user.name}</h3>
                   <a href="/api/v1/users" class="btn">View All users</a>
                <div>`
      : ` <a href="/api/v1/auth/google" class="btn">Continue With Google</a>`
    }
        </div>
    </body>
    </html>
    `);
});
app.use("/api/v1", router);
app.use(notFound);
app.use(errorHandler);
Start(app);
export default app;
