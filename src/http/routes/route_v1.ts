import express from "express";
import AuthRoutes from "./auth";
import UserRoutes from "./user";
import { authMiddleware } from "../middleware/auth";
import { authControllers } from "../controllers/auth";
const router = express.Router();

router.use(
  "/auth",
  async (req, res, next) => {
    if (req.path.includes("logout")) return next();
    else {
      const user = await authControllers.verifyToken(req);
      if (!user) return next();
      else res.redirect("/");
    }
  },
  AuthRoutes
);
router.use(
  "/users",
  (req, res, next) => authMiddleware(req, res, next),
  UserRoutes
);
export default router;
