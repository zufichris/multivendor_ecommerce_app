import http from "http";
import { env } from "../../config/env";
import { AppError } from "../../global/error";
import { logger } from "../../util/logger";

export function Start(app: Express.Application) {
  const server = http.createServer(app);
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
