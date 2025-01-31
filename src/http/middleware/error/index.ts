import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../global/error";
import { EStatusCodes } from "../../../global/enums";
import { IResponseData } from "../../../global/entities";
import { env } from "../../../config/env";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    next(
        new AppError({
            message: "Resource Not Found",
            status: EStatusCodes.enum.notFound,
            type: "Invalid path or url",
            description: 'We Could Not Find What You are Looking For',
            url: req.url,
            path: req.path,
        })
    );
};

export const errorHandler = (
    err: AppError<any>,
    req: Request,
    res: Response,
    _: NextFunction
) => {
    const error: IResponseData<undefined> = {
        success: false,
        message: err?.message ?? "An Unexpected Error Occurred",
        status: err?.error?.status ?? EStatusCodes.enum.badGateway,
        description: err?.error?.description ?? 'An Unexpected Error Occurred',
        error: {
            message: err?.message ?? "An Unexpected Error Occurred",
        },
        path: req.path,
        url: req.url,
        stack: env.in_prod ? undefined : err.stack,
        type: err.error?.type ?? "Error",
    }
    console.log(err);
    res.status(error.status).json(error);
};
