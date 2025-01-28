import express from "express";
import AuthRoutes from "./auth";
import UserRoutes from "./user";
import LoggedInUserRoutes from "./me"
import { authMiddleWare } from "../middleware/auth";

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
router.use("/me", 
  authMiddleWare.requireAuth,
   LoggedInUserRoutes
)
export default router;
