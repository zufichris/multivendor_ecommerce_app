import fs from "fs";
import { env } from "../../config/env";
import { IResponseData } from "../entities";
import { logger } from "../../utils/logger";

export class AppError extends Error {
  public error: Partial<IResponseData<any>>;
  constructor(err: Partial<IResponseData<any>>) {
    logger.error(err?.message! ?? "An Error Occured", { error: err })

    super(err.message);
    this.error = err;

    const errorFilePath = this.stack!.split(")")[0];

    this.error.description = `${this.error.description ?? this.message
      }-Reference:${!env?.in_prod ? errorFilePath ?? this.stack : ""}`;

    this.error.stack = env?.in_prod ? undefined : this.stack;
    Error.stackTraceLimit = 2;
    Error.captureStackTrace(this, this.constructor);
  }
}
