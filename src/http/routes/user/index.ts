import express from "express";
import { userControllers } from "../../controllers/user";
import { authMiddleWare } from "../../middleware/auth";
import { Role } from "../../../data/enums/user";

const router = express.Router();

router.route("/")
  .post(userControllers.createUser)
  .get((req, res, next) => authMiddleWare.authorize([Role.Admin], req, res, next), userControllers.queryUsers);
router.route("/:custId",)
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
router.route("/address/:custId")
router.route("/stats/:custId")
  .get(userControllers.getUserStats)

export default router;
