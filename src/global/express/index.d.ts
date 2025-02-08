import { TUser } from "../../data/entity/user";
import { Role } from "../data/enums/user";
import { ID } from "../entity";

declare module 'express-serve-static-core' {
    interface Request {
        user?: Partial<TUser>
    }
}