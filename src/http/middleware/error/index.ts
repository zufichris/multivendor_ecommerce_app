import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../global/error";
import { EStatusCodes } from "../../../global/enums";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    next(
        new AppError({
            message: "Resource Not Found",
            status: EStatusCodes.enum.notFound,
            type: "Invalid path or url",
            url: req.url,
            path: req.path,
        })
    );
};

export const errorHandler = (
    err: AppError<any>,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    delete err?.stack
    res.status(err?.error?.status ?? EStatusCodes.enum.badGateway).json(err)
};
