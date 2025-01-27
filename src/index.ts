import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import router from "./http/routes/route_v1";
import { Start } from "./http/server/httpServer";
import { errorHandler, notFound } from "./http/middleware/error";
import { DB } from "./config/dbConfig";
import { env } from "./config/env";
import { loggerMiddleware } from "./http/middleware/logger";

new DB(env.mongo_uri).connect();

const app = express();
app.use(cors())
app.use(express.json({}))
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(cookieParser());
app.use(loggerMiddleware)

app.use("/api/v1", router);
app.get("/", (_, res) => {
    res.send(`
        <h1>Welcome to Vendor Verse API</h1></br>
        <a href='/api/v1'>Explore API</a>
    `)
})
app.use(notFound);
app.use(errorHandler);
Start(app);
export default app;
