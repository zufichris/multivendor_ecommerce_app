import mongoose from "mongoose";
import { AppError } from "../global/error";
import { logger } from "../utils/logger";

export class DB {
  constructor(private readonly connectionString: string) { }
  private readonly connection?: mongoose.Connection;

  connect(options?: mongoose.ConnectOptions) {
    mongoose
      .connect(this.connectionString, options)
      .then((con) => {
        logger.info("Database Connected")
      })
      .catch((err: mongoose.MongooseError) => {
        throw new AppError({
          message: err.message,
          type: "Database Error",
        });
      });
  }
}
