import express from "express";
import { userControllers } from "../../controller/user";
import { authMiddleware } from "../../middleware/auth";

const router = express.Router();
router.use(authMiddleware.requireAuth)
router.route("/")
  .post(userControllers.createUser)
  .get(authMiddleware.requirePermission("user", "create"), userControllers.queryUsers);
router.route("/:custId",)
  .get(authMiddleware.requirePermission("user", "view_own"),userControllers.getUser)
  .patch(userControllers.updateUser,authMiddleware.requirePermission("user", "update"))
router.route("/address/:custId")
router.route("/stats/:custId")
  .get(userControllers.getUserStats,authMiddleware.requirePermission("user", "view_own"))

export default router;
