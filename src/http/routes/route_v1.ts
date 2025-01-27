import express from "express";
import AuthRoutes from "./auth";
import UserRoutes from "./user";
import { authMiddleWare } from "../middleware/auth";
import { userControllers } from "../controllers/user";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to VendorVerse API",
    documentation: "/api/v1/docs",
  });
});
router.use(
  "/auth",
  AuthRoutes
);
router.use(
  "/users",
  authMiddleWare.requireAuth,
  UserRoutes
);
router.use(authMiddleWare.requireAuth).route("/me")
  .get(userControllers.getMe);
export default router;
