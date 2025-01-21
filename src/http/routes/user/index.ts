import express from "express";
import { userControllers } from "../../controllers/user";
import { authMiddleWare } from "../../middleware/auth";
import { Role } from "../../../data/enums/user";

const router = express.Router();
router.use(
  authMiddleWare.requireAuth,
  (req, res, next) => authMiddleWare.authorize([Role.Admin], req, res, next)
);

router
  .route("/")
  .post(userControllers.createUser)
  .get(userControllers.queryUsers);

export default router;
