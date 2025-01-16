import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { env } from "../../config/env";
import { AppError } from "../../global/error";
import { DB } from "../../config/dbConfig";
import { logger } from "../../utils/logger";

export function Start(app: Express.Application) {
  const server = createServer(app);
  if (isNaN(Number(env.port)))
    throw new AppError({
      message: "Invalid port number",
      description: "add the env variable PORT, example PORT=5000",
      type: "HTTP Server Connection Error",
    });
  else {
    server.listen(env.port, () => {
      logger.info(`App running on http://localhost:${env.port}`)
    });
  }
}