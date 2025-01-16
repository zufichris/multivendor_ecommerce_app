import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../global/error";
import { StatusCodes } from "../../../global/enums";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(
    new AppError({
      message: "Resource Not Found",
      status: StatusCodes.notFound,
      type: "Invalid path or url",
      url: req.url,
      path: req.path,
    })
  );
};

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err?.error?.status ?? StatusCodes.badGateway).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login-Lynx - ${err?.error?.status} - ${
    err?.error?.message
  }</title>
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
                    padding: 20px;
                    margin: 20px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    border-radius: 8px;
                    max-width: 600px;
                    width: 100%;
                    height: 95%;
                }
                h1 {
                    color: ${
                      err?.error?.status! >= 500 ? "#e74c3c" : "#f39c12"
                    };
                }
                .error-details {
                    margin-top: 20px;
                    background-color: #f8d7da;
                    padding: 15px;
                    border-left: 4px solid ${
                      err?.error?.status! >= 500 ? "#e74c3c" : "#f39c12"
                    };
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }
                .back-link {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 10px 15px;
                    background-color: #3498db;
                    color: white;
                    text-decoration: none;
                    border-radius: 4px;
                }
                .back-link:hover {
                    background-color: #2980b9;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Error ${err?.error?.status}: ${err?.error?.message}</h1>
                <p><strong>Type:</strong> ${err?.error?.type}</p>
                <p><strong>Path:</strong> ${err?.error?.path}</p>
                <p><strong>URL:</strong> ${err?.error?.url}</p>
                <p><strong>Description:</strong> ${err?.error?.description}</p>
                ${
                  err?.error?.stack
                    ? `
                <div class="error-details">
                    <h3>Stack Trace:</h3>
                    <p>${err?.error?.stack}</p>
                </div>`
                    : ""
                }
                <a href="/" class="back-link">Go Back to Home</a>
            </div>
        </body>
        </html>
    `);
};
