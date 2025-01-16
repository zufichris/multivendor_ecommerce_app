import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../global/error";
import { StatusCodes } from "../../../global/enums";
import { authControllers } from "../../controllers/auth";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authControllers.verifyToken(req);
    if (!user)
      throw new AppError({
        message: "Forbidden",
        status: StatusCodes.forbidden,
        url: req.url,
        path: req.path,
        description: "Cannot access resource",
        type: "Auth",
      });

    next();
  } catch (error: any) {
    next(
      new AppError({
        message: "Unauthorized Access",
        status: StatusCodes.forbidden,
        ...(error?.error ?? {}),
      })
    );
  }
};
