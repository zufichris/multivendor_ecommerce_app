import express from "express";
import AuthRoutes from "./auth";
import UserRoutes from "./user";
import { authMiddleWare } from "../middleware/auth";
const router = express.Router();

router.use(
  "/auth",
  AuthRoutes
);
router.use(
  "/users",
  authMiddleWare.requireAuth,
  UserRoutes
);
export default router;
